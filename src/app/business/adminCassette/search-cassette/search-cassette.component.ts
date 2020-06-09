import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { APP_CONSTANT } from 'src/app/common/constant/appConstant';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { ConfirmDialogComponent } from 'src/app/common/ulti/gui/confirm-dialog/confirm-dialog.component';
import { DialogCassetteComponent } from '../dialog-cassette/dialog-cassette.component';

@Component({
  selector: 'app-search-cassette',
  templateUrl: './search-cassette.component.html',
  styleUrls: ['./search-cassette.component.scss']
})
export class SearchCassetteComponent implements OnInit {
  event: EventEmitter<any>=new EventEmitter();
  
  searchForm: FormGroup;

  lstRecord: any = [];
  lstStatus:any = [];
  lstType:any = [];

  totalRecord: number = 0;

  loading: boolean = false;

  bsModalRef: BsModalRef;

  size:number = APP_CONSTANT.PAGINATION.SIZE;
  page:number = 1;
  maxPageView:number = 5;
  constructor(
    private modalService: BsModalService,
    private api : ApiService,
    private toast : ToastUltiService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.lstStatus = [
      {id:0,name:'Không hoạt động'},
      {id:1,name:'Hoạt động'}
    ];
    this.buildForm();
    this.searchCasstte(null);
    this.getAllType();
  }

  buildForm(){
    this.searchForm = this.fb.group({
      code:[''],
      typeId:[''],
      status:['']
    })
  }

  getAllType(){
    this.api.get(API_URL_CONSTANT.CASSTTE_TYPE.ALL,{}).subscribe(data => {
      this.lstType = data;
      this.loading = false;
    },error => {
      this.toast.showError("Lỗi","Không lấy được dữ liệu!");    
      this.loading = false;  
    });
  }

  searchCasstte(event: any):void{
    this.loading = true;

    if(event != null)
      this.page = event.page;
    else
      this.page = 1;

    var dto = {
      code : this.searchForm.controls.code.value,
      typeId : this.searchForm.controls.typeId.value === '' ? null : this.searchForm.controls.typeId.value,
      status : this.searchForm.controls.status.value === '' ? null : this.searchForm.controls.status.value,
      // typeId: null,
      // status: null,
      page:this.page-1,
      size:this.size
    }
    let params = {
      searchDTO: JSON.stringify(dto)
    }
    debugger;
    this.api.get(API_URL_CONSTANT.CASSTTE.SEARCH,params).subscribe(data =>{
      this.lstRecord = data.list;
      this.totalRecord = data.count;
      this.loading = false;
      console.log(data);
    },error =>{
      this.loading = false;
    });
  }

  openDialog(item:any):void{
  
    const initialState = {
      title: item != null ? 'Cập nhật thông tin ATM <b>'+item.code+'</b>' : 'Thêm mới thông tin ATM',
      item:item
    };
    this.bsModalRef = this.modalService.show(DialogCassetteComponent, {initialState,class: 'modal-lg'});
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.searchCasstte(null);
      }
    });
  }

  confirmDeleted(item:any):void{
    //open confirm dialog
    const initialState = {
      title: 'Xác nhận xóa',
      message:'Bạn có chắc chắn muốn xóa bản ghi <b>'+item.code+'</b> khỏi CSDL của hệ thống?'
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, {initialState});
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.deleted(item.id,item.code);
      }
    });
  }

  deleted(cassId:number,cassCode:string):void{
    this.loading = true;
    this.api.post(API_URL_CONSTANT.CASSTTE.DELETED,{},{cassId:cassId}).subscribe(data=>{
    this.toast.showSuccess('Thông báo','Xóa thành công thông tin Cassette <b>'+cassCode+'</b> khỏi CSDL của hệ thống.');
    this.loading = false;
    this.searchCasstte(null);
    },error=>{
      this.toast.showWarning('Thông báo','Hệ thống đang bận. Xin vui lòng thửu lại sau.');
      this.loading = false;
    });
  }
}


