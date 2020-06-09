import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { APP_CONSTANT } from 'src/app/common/constant/appConstant';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { DetailStoragesComponent } from '../detail-storages/detail-storages.component';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { ConfirmDialogComponent } from 'src/app/common/ulti/gui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-search-storages',
  templateUrl: './search-storages.component.html',
  styleUrls: ['./search-storages.component.scss']
})
export class SearchStoragesComponent implements OnInit {

  bsModalRef: BsModalRef;

  loading: boolean = false;

  totalRecord: number = 0;
  size:number = APP_CONSTANT.PAGINATION.SIZE;
  page: number = 1;
  maxPageView: number = 10;

  searchForm: FormGroup;
  lstBranch: any = [];
  lstStatus: any = [];
  lstRecord: any = [];

  constructor(
    private modalService: BsModalService,
    private api: ApiService,
    private toast: ToastUltiService,
    private fb: FormBuilder
  ) {
    
   }

  ngOnInit() {
    this.lstStatus = [
      { id: 1, name: 'Hoạt động' },
      { id: 0, name: 'Không hoạt động' }
    ];
    this.buildForm();
    this.searchData(null);
    this.getAllBranch();
  }
  getAllBranch():void{
    this.loading = true;
    this.api.get(API_URL_CONSTANT.BRANCH.GET_ALL,{}).subscribe(data => {
      this.lstBranch = data.list;
      this.loading = false;
    },error => {
      this.loading = false;
    });
  }

  buildForm() {
    this.searchForm = this.fb.group({
      code: [''],
      name: [''],
      dateFrom: [''],
      dateTo: [''],
      branchId: [''],
      status: ['']
    })
  }

  searchData(event: any):void {
    if (event != null) {
      this.page = event.page;
    } else {
      this.page = 1;
    }
    this.loading = true;
    
    let dateF = this.searchForm.controls.dateFrom.value;
    let dateT = this.searchForm.controls.dateTo.value;
    
    
    var searchDTO = {
      code: this.searchForm.controls.code.value,
      name: this.searchForm.controls.name.value,
      branchId: this.searchForm.controls.branchId.value ===''? null : this.searchForm.controls.branchId.value,
      status: this.searchForm.controls.status.value === '' ? null : this.searchForm.controls.status.value,
      dateFrom: dateF != '' ? dateF : null,
      dateTo: dateT != '' ? dateT : null,
      page: this.page - 1,
      size: this.size
    }

    let params = {
      searchDTO: JSON.stringify(searchDTO)
    }

    this.api.get(API_URL_CONSTANT.STORAGES.SEARCH, params).subscribe(data => {
      this.lstRecord = data.list;
      this.totalRecord = data.count;
      console.log(this.lstRecord);
      this.loading = false;
    }, error => {
      this.toast.showWarning("Thông báo", "Hệ thống đang bận. Vui lòng thực hiện lại sau.");
      this.loading = false;
    })
  }

  openDialog(item: any) {
    const initialState = {
      title: item != null ? 'Sửa thông tin kho tiền' : 'Thêm mới thông tin kho tiền',
      item: item
    };
    this.bsModalRef = this.modalService.show(DetailStoragesComponent, { initialState, class: 'modal-lg' });
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.searchData(null);
      }
    });
  }

  confirmDeleted(item: any):void {
    const initialState = {
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa <span class=\'lbl-bold\'>'+item.name+'</span> khỏi CSDL không?'
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, { initialState });
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.deleted(item.id);
      }
    });
  }

  deleted(storId: number): void {
    this.loading = true;
    this.api.post(API_URL_CONSTANT.STORAGES.DELETED,{},{storId:storId}).subscribe(data => {
      this.searchData(null);
      this.toast.showSuccess('Thông báo','Dữ liệu được xóa khỏi CSDL thành công.');
      this.loading = false;
    }, error => {
      this.toast.showWarning('Thông báo', 'Hệ thống đang bận. Xin vui lòng thửu lại sau.');
      this.loading = false;
    });
  }
  lockOrUnlock(item:any):void{
    let lblMsg: string;
    let msgSucess: string;
    let params = {
      storId : item.id,
      type: null
    }
    if(item.status === 1){
      msgSucess = 'Khóa thành công Kho tiền <span class=\'lbl-bold\'>'+item.name+'</span>';
      lblMsg = 'Bạn có chắc chắn muốn khóa Kho tiền <span class=\'lbl-bold\'>'+item.name+'</span> không';
      params.type = 1;
    }else{
      msgSucess = 'Mở khóa thành công Kho tiền <span class=\'lbl-bold\'>'+item.name+'</span>';
      lblMsg = 'Bạn có chắc chắn muốn mở khóa cho Kho tiền <span class=\'lbl-bold\'>'+item.name+'</span> không?'
      params.type = 0;
    }
    //open confirm dialog
    const initialState = {
      title: item.status===1 ? 'Xác nhận khóa kho tiền' : 'Xác nhận mở khóa kho tiền',
      message:lblMsg
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent,{initialState});
    this.bsModalRef.content.event.subscribe(result =>{
      if(result == 'OK'){
        this.loading = true;
        this.api.post(API_URL_CONSTANT.STORAGES.LOCK_UNLOCK,{},params).subscribe(data => {
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
