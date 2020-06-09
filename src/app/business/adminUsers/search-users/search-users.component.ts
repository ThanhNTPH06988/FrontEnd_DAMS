import { Component, OnInit } from '@angular/core';
import { APP_CONSTANT } from 'src/app/common/constant/appConstant';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { DialogUsersComponent } from '../dialog-users/dialog-users.component';
import { ConfirmDialogComponent } from 'src/app/common/ulti/gui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.scss']
})
export class SearchUsersComponent implements OnInit {

  bsModalRef: BsModalRef;

  loading:boolean = false;

  totalRecord:number = 0;
  size:number = APP_CONSTANT.PAGINATION.SIZE;
  page:number = 1;
  maxPageView:number = 10;

  lstRecord:any = [];
  lstStaffPosition:any = [];
  lstStatus:any = [];

  searchForm:FormGroup;

  constructor(
    private modalService: BsModalService,
    private api : ApiService,
    private toast : ToastUltiService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getStaffPosition();
    this.initData();
    this.search(null);
  }

  initData():void{
    this.lstStatus = [
      {id:"1",name:'Hoạt động'},
      {id:"0",name:'Không hoạt động'}
    ]
  }

  buildForm(){
    this.searchForm = this.fb.group({
      userName:[''],
      dateFrom:[''],
      dateTo:[''],
      staffName:[''],
      staffPositionId:[''],
      status:['']
    })
  }

  search(event: any):void{
    this.loading = true;
    if(event != null)
      this.page = event.page;
    else
      this.page = 1;

    var searchDTO = {
      userName:this.searchForm.controls.userName.value,
      dateFrom:this.searchForm.controls.dateFrom.value != "" ? this.searchForm.controls.dateFrom.value : null,
      dateTo:this.searchForm.controls.dateTo.value != "" ? this.searchForm.controls.dateTo.value : null,
      staffName:this.searchForm.controls.staffName.value,
      staffPositionId:this.searchForm.controls.staffPositionId.value != "" ? this.searchForm.controls.staffPositionId.value : null,
      status:this.searchForm.controls.status.value != "" ? Number(this.searchForm.controls.status.value) : null,
      page:this.page-1,
      size:this.size
    }
    debugger;
    let params = {
      searchDTO: JSON.stringify(searchDTO)
    }
    this.api.get(API_URL_CONSTANT.USERS.SEARCH,params).subscribe(data =>{
      this.lstRecord = data.list;
      this.totalRecord = data.count;
      this.loading = false;
    },error =>{
      this.loading = false;
    });
  }

  getStaffPosition():void{
    this.loading = true;
    this.api.get(API_URL_CONSTANT.STAFF.POSITION.GET_POSITION,{}).subscribe(data=>{
      this.lstStaffPosition = data;
      this.loading = false;
    },error=>{
      this.toast.showInfo('Thông báo','Không lấy được danh sách chức danh');
      this.loading = false;
    });
  }

  openDialog(item:any):void{
  
    const initialState = {
      title: item != null ? 'Phân quyền cho tài khoản <span class=\'lbl-bold\'>'+item.userName+'</span>' : 'Thêm mới tài khoản hệ thống',
      item:item
    };
    this.bsModalRef = this.modalService.show(DialogUsersComponent, {initialState,class: 'modal-lg'});
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.search(null);
      }
    });
  }

  confirmDeleted(item:any):void{
    //open confirm dialog
    const initialState = {
      title: 'Xác nhận xóa',
      message:'Bạn có chắc chắn muốn xóa tài khoản <span class=\'lbl-bold\'>'+item.userName+'</span> không?'
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, {initialState});
    this.bsModalRef.content.event.subscribe(result => {
      debugger;
      if (result == 'OK') {
        this.deleted(item.id);
      }
    });
  }

  deleted(userId:number):void{
    this.loading = true;

    this.api.post(API_URL_CONSTANT.USERS.DELETED,{},{userId:userId}).subscribe(data => {
      this.search(null);
      this.toast.showSuccess('Thông báo','Dữ liệu được xóa khỏi CSDL thành công.');
      this.loading = false;
    },error =>{
      this.toast.showInfo('Thông báo','Có lỗi phát sinh, vui lòng liên hệ với quản trị viên để được trợ giúp.Cảm ơn!');
      this.loading = false;
    });

  }

  lockOrUnlock(item:any):void{

    let lblMsg:string;
    let msgSucess:string;
    let params = {
      userId:item.id,
      type:null
    }

    if(item.status===1){
      msgSucess = 'Khóa thành công tài khoản <span class=\'lbl-bold\'>'+item.userName+'</span>';
      lblMsg = 'Bạn có chắc chắn muốn khóa tài khoản <span class=\'lbl-bold\'>'+item.userName+'</span> không?'
      params.type = 1;
    }else{
      msgSucess = 'Mở khóa thành công tài khoản <span class=\'lbl-bold\'>'+item.userName+'</span>';
      lblMsg = 'Bạn có chắc chắn muốn mở khóa cho tài khoản <span class=\'lbl-bold\'>'+item.userName+'</span> không?'
      params.type = 0;
    }

    //open confirm dialog
    const initialState = {
      title: item.status===1 ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản',
      message:lblMsg
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, {initialState});
    this.bsModalRef.content.event.subscribe(result => {
      debugger;
      if (result == 'OK') {
        this.loading = true;
        this.api.post(API_URL_CONSTANT.USERS.LOCK_UNLOCK,{},params).subscribe(data => {
          this.search(null);
          this.toast.showSuccess('Thông báo',msgSucess);
          this.loading = false;
        },error =>{
          this.toast.showInfo('Thông báo','Có lỗi phát sinh, vui lòng liên hệ với quản trị viên để được trợ giúp.Cảm ơn!');
          this.loading = false;
        });

      }
    });
  }

}
