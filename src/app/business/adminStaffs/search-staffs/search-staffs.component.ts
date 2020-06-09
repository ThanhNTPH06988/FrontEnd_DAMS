import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { APP_CONSTANT } from 'src/app/common/constant/appConstant';
import { ApiService } from 'src/app/common/api/api.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { DialogStaffsComponent } from '../dialog-staffs/dialog-staffs.component';
import { ConfirmDialogComponent } from 'src/app/common/ulti/gui/confirm-dialog/confirm-dialog.component';
import { DetailsStaffsComponent } from '../details-staffs/details-staffs.component';

@Component({
  selector: 'app-search-staffs',
  templateUrl: './search-staffs.component.html',
  styleUrls: ['./search-staffs.component.scss']
})
export class SearchStaffsComponent implements OnInit {

  bsModalRef: BsModalRef;
  size:number = APP_CONSTANT.PAGINATION.SIZE;
  page:number = 1;
  loading:boolean = false;
  totalRecord:number = 0;
  lstRecord: any = [];
  lstStatus: any = [];
  lstPosition: any = [];
  lstBranch: any = [];

  searchForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private api : ApiService,
    private toast: ToastUltiService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.lstStatus = [
      { id: "1", name: 'Hoạt động'},
      { id: "0", name: 'Không hoạt động'}
    ]
    this.buildForm();
    this.searchData(null);
    this.getListPosition();
    this.getListBranch();
  }
  getListPosition() {
    this.api.get(API_URL_CONSTANT.STAFF.POSITION.GET_POSITION, {}).subscribe(data => {
      this.lstPosition = data;
    }, error => {
      this.toast.showError("Lỗi", "Không lấy được dữ liệu.");
    });
  }
  getListBranch(){
    this.api.get(API_URL_CONSTANT.BRANCH.GET_ALL, {}).subscribe(data => {
      this.lstBranch = data.list;
    }, error =>{
      this.toast.showError("Lỗi","Không lấy được dữ liệu.");
    });
    
  }
  buildForm() {
    this.searchForm = this.fb.group({
      code: [''],
      name: [''],
      idcard: [''],
      branchId: [''],
      position: [''],
      status: ['']
    })
  }
  searchData(event: any):void{
    this.loading = true;
    if(event != null)
      this.page = event.page;
    else
      this.page = 1;

      debugger;
    let searchDTO = {
      code: this.searchForm.controls.code.value,
      name: this.searchForm.controls.name.value,
      idcard: this.searchForm.controls.idcard.value,
      branchId:  this.searchForm.controls.branchId.value == '' ? null : this.searchForm.controls.branchId.value,
      positionId: this.searchForm.controls.position.value == '' ? null : this.searchForm.controls.position.value,
      status: this.searchForm.controls.status.value == '' ? null : Number(this.searchForm.controls.status.value),
      page: this.page - 1,
      size: this.size
    }
    let params = {
      searchDTO: JSON.stringify(searchDTO)
    }
    this.api.get(API_URL_CONSTANT.STAFF.SEARCH,params).subscribe(data =>{
      this.lstRecord = data.list;
      console.log(this.lstRecord);
      this.totalRecord = data.count;
      this.loading = false;
    },error =>{
      this.loading = false;
    });
  }

  detailsStaff(item:any){
    const initialState = {
      title: 'Thông tin chi tiết nhân viên <span class=\'lbl-bold\'>'+item.code+'</span> khỏi CSDL của hệ thống?',
      item: item
    };
    this.bsModalRef = this.modalService.show(DetailsStaffsComponent, { initialState, class: 'modal-lg' });
    this.bsModalRef.content.onClose.subscribe(result => {
      this.searchData(null);
    })
  }

  openDialog(item: any) {
    const initialState = {
      title: item == null ? 'Thêm mới thông tin nhân viên' : 'Chỉnh sửa thông tin nhân viên',
      item: item
    };

    this.bsModalRef = this.modalService.show(DialogStaffsComponent, { initialState, class: 'modal-lg' });
    this.bsModalRef.content.onClose.subscribe(result => {
      this.searchData(null);
    })
  }
  confirmDeleted(item:any):void{
    //open confirm dialog
    const initialState = {
      title: 'Xác nhận xóa',
      message:'Bạn có chắc chắn muốn xóa bản ghi <span class=\'lbl-bold\'>'+item.name+'</span> khỏi CSDL của hệ thống?'
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, {initialState});
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.deleted(item.id);
      }
    });
  }
  deleted(userId:number):void{
    this.loading = true;
    this.api.post(API_URL_CONSTANT.STAFF.DELETED,{},{userId:userId}).subscribe(data => {
      this.searchData(null);
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
      staffId: item.id,
      type: null
    }
    if(item.status === 1){
      msgSucess = 'Khóa thành công nhân viên <span class=\'lbl-bold\'>'+item.name+'</span>';
      lblMsg = 'Bạn có chắc chắn muốn khóa nhân viên <span class=\'lbl-bold\'>'+item.name+'</span> không';
      params.type = 1;
    }else{
      msgSucess = 'Mở khóa thành công nhân viên <span class=\'lbl-bold\'>'+item.name+'</span>';
      lblMsg = 'Bạn có chắc chắn muốn mở khóa cho nhân viên <span class=\'lbl-bold\'>'+item.name+'</span> không?'
      params.type = 0;
    }
    //open confirm dialog
    const initialState = {
      title: item.status===1 ? 'Xác nhận khóa nhân viên' : 'Xác nhận mở khóa nhân viên',
      message:lblMsg
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent,{initialState});
    this.bsModalRef.content.event.subscribe(result =>{
      if(result == 'OK'){
        this.loading = true;
        this.api.post(API_URL_CONSTANT.STAFF.LOCK_UNLOCK,{},params).subscribe(data => {
          this.searchData(null);
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
