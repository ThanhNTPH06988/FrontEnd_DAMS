import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { APP_CONSTANT } from 'src/app/common/constant/appConstant';
import { BsModalService } from 'ngx-bootstrap';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { ConfirmDialogComponent } from 'src/app/common/ulti/gui/confirm-dialog/confirm-dialog.component';
import { DailogBranchsComponent } from '../dailog-branchs/dailog-branchs.component';
import { SelectManagerComponent } from '../select-manager/select-manager.component';

@Component({
  selector: 'app-search-branchs',
  templateUrl: './search-branchs.component.html',
  styleUrls: ['./search-branchs.component.scss']
})
export class SearchBranchsComponent implements OnInit {

  searchForm: FormGroup;
  lstRecord: any = [];
  lstStatus: any = [];
  loading:boolean = false;

  totalRecord:number = 0;
  size:number = APP_CONSTANT.PAGINATION.SIZE;
  page:number = 1;
  bsModalRef: any;

  constructor(
    private modalService: BsModalService,
    private api : ApiService,
    private toast : ToastUltiService,
    private fb: FormBuilder

  ) { }

  ngOnInit() {
    this.lstStatus = [
      { id: 0, name: 'Không hoạt động'},
      { id: 1, name: 'Hoạt động'}
    ]
    this.buildForm();
    this.searchBranchs(null);
  }

  buildForm(){
    this.searchForm = this.fb.group({
      code:[''],
      name:[''],
      dateFrom:[''],
      dateTo:[''],
      status:[''],
      nameManager: ['']
    })
  }

  searchBranchs(event: any):void{
    this.loading = true;
    if(event != null)
      this.page = event.page;
    else
      this.page = 1;

    var searchDTO = {
      code:this.searchForm.controls.code.value,
      name:this.searchForm.controls.name.value,
      dateFrom:this.searchForm.controls.dateFrom.value != '' ? this.searchForm.controls.dateFrom.value : null,
      dateTo:this.searchForm.controls.dateTo.value != '' ? this.searchForm.controls.dateTo.value : null,
      status: this.searchForm.controls.status.value === '' ? null : this.searchForm.controls.status.value,
      nameManager: this.searchForm.controls.nameManager.value,
      page:this.page-1,
      size:this.size
    }
    let params = {
      searchDTO: JSON.stringify(searchDTO)
    }
    this.api.get(API_URL_CONSTANT.BRANCH.SEARCH,params).subscribe(data =>{
      this.lstRecord = data.list;
      this.totalRecord = data.count;
      this.loading = false;
    },error =>{
      this.loading = false;
    });
  }

  openDialog(item: any) {
    const initialState = {
      parameter: 2019,
      title: item == null ? 'Thêm mới thông tin chi nhánh' : 'Chỉnh sửa thông tin chi nhánh ',
      item: item
    };

    this.bsModalRef = this.modalService.show(DailogBranchsComponent, { initialState, class: 'modal-lg' });
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.searchBranchs(null);
      }
    })
  }

  selectManager(item: any) {
    const initialState = {
      parameter: 2019,
      title: 'Chọn cán bộ phụ trách chi nhánh <i>' + item.name +'</i>',
      item: item
    };

    this.bsModalRef = this.modalService.show(SelectManagerComponent, { initialState, class: 'modal-lg '});
    this.bsModalRef.content.event.subscribe(result => {
      if (result === 'OK') {
        this.searchBranchs(null);
      }
    })
  }

  confirmDeleted(item:any):void{
    //open confirm dialog
    const initialState = {
      title: 'Xác nhận xóa',
      message:'Bạn có chắc chắn muốn xóa chi nhánh <span class=\'lbl-bold\'>'+item.name+'</span> khỏi CSDL của hệ thống?'
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, {initialState});
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.deleted(item.id);
      }
    });
  }

  deleted(branchId:number):void{
    this.loading = true;
    this.api.post(API_URL_CONSTANT.BRANCH.DELETED,{},{branchId:branchId}).subscribe(data => {
      this.searchBranchs(null);
      this.toast.showSuccess('Thông báo','Dữ liệu được xóa khỏi CSDL thành công.');
      this.loading = false;
    },error =>{
      this.toast.showInfo('Thông báo','Có lỗi phát sinh, vui lòng liên hệ với quản trị viên để được trợ giúp.Cảm ơn!');
      this.loading = false;
    });

  }

  lockOrUnlock(item:any):void{
    let lblMsg: string;
    let msgSucess: string;
    let params = {
      branchId: item.id,
      type: null
    }
    if(item.status === 1){
      msgSucess = 'Khóa thành công chi nhánh <span class=\'lbl-bold\'>'+item.name+'</span>';
      lblMsg = 'Bạn có chắc chắn muốn khóa chi nhánh <span class=\'lbl-bold\'>'+item.name+'</span> không';
      params.type = 1;
    }else{
      msgSucess = 'Mở khóa thành công chi nhánh <span class=\'lbl-bold\'>'+item.name+'</span>';
      lblMsg = 'Bạn có chắc chắn muốn mở khóa cho chi nhánh <span class=\'lbl-bold\'>'+item.name+'</span> không?'
      params.type = 0;
    }
    //open confirm dialog
    const initialState = {
      title: item.status===1 ? 'Xác nhận khóa chi nhánh' : 'Xác nhận mở khóa chi nhánh',
      message:lblMsg
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent,{initialState});
    this.bsModalRef.content.event.subscribe(result =>{
      if(result == 'OK'){
        this.loading = true;
        this.api.post(API_URL_CONSTANT.BRANCH.LOCK_UNLOCK,{},params).subscribe(data => {
          this.searchBranchs(null);
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
