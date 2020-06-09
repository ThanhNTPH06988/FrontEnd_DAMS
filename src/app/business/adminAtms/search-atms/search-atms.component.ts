import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { DialogUsersComponent } from '../../adminUsers/dialog-users/dialog-users.component';
import { DialogAtmsComponent } from '../dialog-atms/dialog-atms.component';
import { ConfirmDialogComponent } from 'src/app/common/ulti/gui/confirm-dialog/confirm-dialog.component';
import { APP_CONSTANT } from 'src/app/common/constant/appConstant';

@Component({
  selector: 'app-search-atms',
  templateUrl: './search-atms.component.html',
  styleUrls: ['./search-atms.component.scss']
})
export class SearchAtmsComponent implements OnInit {
  event: EventEmitter<any>=new EventEmitter();
  
  searchForm: FormGroup;

  lstRecord: any = [];
  lstStatus:any = [];
  lstBranch: any = [];

  totalRecord: number = 0;

  loading: boolean = false;

  bsModalRef: BsModalRef;

  size:number = APP_CONSTANT.PAGINATION.SIZE;
  page:number = 1;
  maxPageView:number = 10;

  constructor(
    private modalService: BsModalService,
    private api : ApiService,
    private toast : ToastUltiService,
    private fb: FormBuilder
  ) { 
    api.get(API_URL_CONSTANT.REQUEST.GET_BRANCH, {}).subscribe(data => {
      this.lstBranch = data;
    }, error => {
      this.toast.showError("Lỗi", "Không lấy được danh sách chi nhánh.");
    })
  }

  ngOnInit() {
    this.lstStatus = [
      {id:0,name:'Không hoạt động'},
      {id:1,name:'Hoạt động'}
    ];
    this.buildForm();
    this.searchAtms(null);
  }

  buildForm(){
    this.searchForm = this.fb.group({
      code:[''],
      addr:[''],
      dateFrom: [''],
      dateTo: [''],
      branchId:['']
    })
  }

  searchAtms(event: any):void{
    this.loading = true;

    if(event != null)
      this.page = event.page;
    else
      this.page = 1;

    var searchDTO = {
      code : this.searchForm.controls.code.value,
      addr: this.searchForm.controls.addr.value,
      branchId : this.searchForm.controls.branchId.value !== '' ? this.searchForm.controls.branchId.value : null,
      dateFrom : this.searchForm.controls.dateFrom.value !== '' ? this.searchForm.controls.dateFrom.value : null,
      dateTo : this.searchForm.controls.dateTo.value !== '' ? this.searchForm.controls.dateTo.value : null,
      page:this.page-1,
      size:this.size
    }
    let params = {
      searchDTO: JSON.stringify(searchDTO)
    }
    debugger;
    this.api.get(API_URL_CONSTANT.ATMS.SEARCH,params).subscribe(data =>{
      this.lstRecord = data.list;
      console.log(this.lstRecord);
      this.totalRecord = data.count;
      this.loading = false;
    },error =>{
      this.loading = false;
    });
  }

  openDialog(item:any):void{
  
    const initialState = {
      title: item != null ? 'Cập nhật thông tin ATM <b>'+item.code+'</b>' : 'Thêm mới thông tin ATM',
      item:item
    };
    this.bsModalRef = this.modalService.show(DialogAtmsComponent, {initialState,class: 'modal-lg'});
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.searchAtms(null);
      }
    });
  }

  confirmDeleted(item:any):void{
    //open confirm dialog
    const initialState = {
      title: 'Xác nhận xóa',
      message:'Bạn có chắc chắn muốn xóa bản ghi <span class=\'lbl-bold\'>'+item.code+'</span> khỏi CSDL của hệ thống?'
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, {initialState});
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.deleted(item.id,item.code);
      }
    });
  }

  deleted(atmId:number,atmCode:string):void{
    this.loading = true;
    this.api.post(API_URL_CONSTANT.ATMS.DELETED,{},{atmId:atmId}).subscribe(data=>{
    this.toast.showSuccess('Thông báo','Xóa thành công thông tin ATM <span class=\'lbl-bold\'>'+atmCode+'</span> khỏi CSDL của hệ thống.');
    this.loading = false;
    this.searchAtms(null);
    },error=>{
      this.toast.showWarning('Thông báo','Hệ thống đang bận. Xin vui lòng thửu lại sau.');
      this.loading = false;
    });
  }

  lockOrUnlock(item:any):void{
    let lblMsg: string;
    let msgSucess: string;
    let params = {
      atmId: item.id,
      type : null
    }

    if(item.status === 1){
      msgSucess = 'Khóa thành công ATM <span class=\'lbl-bold\'>'+item.code+'</span>';
      lblMsg = 'Bạn có chắc chắn muốn khóa ATM <span class=\'lbl-bold\'>'+item.code+'</span> không';
      params.type = 1;
    }else{
      msgSucess = 'Mở khóa thành công ATM<span class=\'lbl-bold\'>'+item.code+'</span>';
      lblMsg = 'Bạn có chắc chắn muốn mở khóa cho ATM <span class=\'lbl-bold\'>'+item.code+'</span> không?'
      params.type = 0;
    }

    //open confirm dialog
    const initialState = {
      title: item.status===1 ? 'Xác nhận khóa ATM' : 'Xác nhận mở khóa ATM',
      message:lblMsg
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent,{initialState});
    this.bsModalRef.content.event.subscribe(result =>{
      if(result == 'OK'){
        this.loading = true;
        this.api.post(API_URL_CONSTANT.ATMS.LOCK_UNLOCK,{},params).subscribe(data => {
          this.searchAtms(null);
          this.toast.showSuccess('Thông báo',msgSucess);
          this.loading = false;
        },error =>{
          this.toast.showInfo('Thông báo','Có lỗi phát sinh, vui lòng liên hệ với quản trị viên để được trợ giúp.Cảm ơn!');
          this.loading = false;
        });
      }
    })
  }
}
