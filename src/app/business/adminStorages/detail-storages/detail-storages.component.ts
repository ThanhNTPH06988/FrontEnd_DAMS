import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { IContextService } from 'src/app/common/ulti/iContext/icontext.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import * as _ from 'lodash';

@Component({
  selector: 'app-detail-storages',
  templateUrl: './detail-storages.component.html',
  styleUrls: ['./detail-storages.component.scss']
})
export class DetailStoragesComponent implements OnInit {

  @Input() item: any;
  loading: boolean = false;
  event: EventEmitter<any> = new EventEmitter();
  storagesForm: FormGroup;
  userLogin: any;
  storagesItem: any;
  lstStaff: any = [];
  // lstStatus: any = [];
  lstBranch: any = [];
  lstProvince: any = [];
  lstDistrict: any = [];
  lstWard: any = [];
  isReadOnly: boolean = false;
  submitted: boolean = false;
  isCheckCode: boolean = false;
  lstStorages: any = [];


  constructor(
    private bsModalRef: BsModalRef,
    private api: ApiService,
    private toast: ToastUltiService,
    private iContext: IContextService,
    private fb: FormBuilder
  ) {


    // lay du lieu tinh, thanh pho
    this.api.get(API_URL_CONSTANT.ADDRESS.ADDR_PROVINCE, {}).subscribe(data => {
      this.lstProvince = data;
    }, error => {
      this.toast.showError("Lỗi", "Không lấy được dữ liệu tỉnh thành phố.");
    });

    // lay danh sach cac kho chua bi xoa
    api.get(API_URL_CONSTANT.STORAGES.GET_STORAGES_NO_DEL, {}).subscribe(data => {
      this.lstStorages = data;
    }, error => {
      toast.showError('Lỗi', 'Không lấy được danh sách kho tiền.');
    });
  }

  ngOnInit() {
    this.storagesItem = this.item;
    this.userLogin = this.iContext.userLogin;
    this.buildForm();
    if (this.storagesItem != null) {
      this.isReadOnly = true;
      this.bindingDataEdit();
    }
    this.getAllBranch();
  }

  // binding data when edit
  bindingDataEdit() {
    this.storagesForm.controls.codeStorage.setValue(this.storagesItem.code);
    this.storagesForm.controls.nameStorage.setValue(this.storagesItem.name);
    this.storagesForm.controls.branchId.setValue(this.storagesItem.branchId);
    this.getStaffByBranch();
    this.storagesForm.controls.staffId.setValue(this.storagesItem.staffManageId);
    this.storagesForm.controls.provinceCode.setValue(this.storagesItem.addr.provinceCode);
    this.getDistrict();
    this.storagesForm.controls.districtCode.setValue(this.storagesItem.addr.districtCode);
    this.getWard();
    this.storagesForm.controls.wardCode.setValue(this.storagesItem.addrId);
    this.storagesForm.controls.addrDetail.setValue(this.storagesItem.addrDetail);
  }

  get f() { return this.storagesForm.controls }

  buildForm() {
    this.storagesForm = this.fb.group({
      codeStorage: ['', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9\w\/\-]*'),
        Validators.maxLength(50),
      ]],
      nameStorage: ['', [
        Validators.required,
        Validators.maxLength(200),
      ]],
      staffId: ['', [
        Validators.required
      ]],
      branchId: ['', [
        Validators.required
      ]],
      provinceCode: ['', [
        Validators.required
      ]],
      districtCode: ['', [
        Validators.required
      ]],
      wardCode: ['', [
        Validators.required
      ]],
      addrDetail: ['', [
        Validators.required,
        Validators.maxLength(100),
      ]]
    })
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

  //lay danh sach can bo theo chi nhánh
  getStaffByBranch():void{
    this.loading = true;
    this.lstStaff = [];
    this.storagesForm.controls.staffId.setValue('');
    let params = {
      branchId: this.storagesForm.controls.branchId.value,
      storagesId: this.storagesItem != null ? this.storagesItem.id : ''
    }
    this.api.get(API_URL_CONSTANT.STAFF.GET_STAFF_BY_BRANCH_FOR_STORAGES, params).subscribe(data => {
      this.lstStaff = data;
      this.loading = false;
    },error => {
      this.loading = false;
    });
  }


  // lay danh muc quan huyen thi xa
  getDistrict() {
    let params = {
      provinceCode: this.storagesForm.controls.provinceCode.value
    };
    if (params.provinceCode === '') {
      this.lstDistrict = [];
      this.storagesForm.controls.districtCode.setValue('');
      this.lstWard = [];
      this.storagesForm.controls.wardCode.setValue('');
    } else {
      this.lstDistrict = [];
      this.storagesForm.controls.districtCode.setValue('');
      this.lstWard = [];
      this.storagesForm.controls.wardCode.setValue('');
      this.api.get(API_URL_CONSTANT.ADDRESS.ADDR_DISTRICT, params).subscribe(data => {
        this.lstDistrict = data;
      }, error => {
        this.toast.showError("Lỗi", "Không lấy được dữ liệu quận, huyện, thị trấn!");
      });
    }
  }

  // lay danh muc xa phuong thi tran
  getWard() {
    let params = {
      districtCode: this.storagesForm.controls.districtCode.value
    };
    if (params.districtCode === '') {
      this.lstWard = [];
      this.storagesForm.controls.wardCode.setValue('');
    } else {
      this.lstWard = [];
      this.storagesForm.controls.wardCode.setValue('');
      this.api.get(API_URL_CONSTANT.ADDRESS.ADDR_WARD, params).subscribe(data => {
        this.lstWard = data;
      }, error => {
        this.toast.showError("Lỗi", "Không lấy được dữ liệu xã, phường, thị trấn!");
      });
    }
  }

  // check ma kho da ton tai hay chua
  existCode() {
    let flag = false;
    let codeTemp = this.storagesForm.controls.codeStorage.value;
    let lstTemp = _.filter(this.lstStorages, (obj) => {
      return obj.code === codeTemp;
    })
    if (lstTemp.length > 0 && this.storagesItem == null) {
      flag = true;
      this.isCheckCode = true;
    } else {
      this.isCheckCode = false;
    }
    return flag;
  }

  // save or update
  saveOrUpdate() {
    debugger;
    // check validate
    let error = false;
    if (this.existCode()) {
      error = true;
    }

    this.submitted = true;
    if (this.storagesForm.invalid) {
      this.toast.showInfo('Thông báo', 'Kiểm tra lại dữ liệu đầu vào');
      error = true;
    }

    if (error === true) {
      return;
    }

    this.loading = true;
    let params = {
      id: this.storagesItem != null ? this.storagesItem.id : null,
      code: this.storagesForm.controls.codeStorage.value,
      name: this.storagesForm.controls.nameStorage.value,
      branchId: this.storagesForm.controls.branchId.value,
      addrDetail: this.storagesForm.controls.addrDetail.value,
      addrId: this.storagesForm.controls.wardCode.value,
      staffManageId: this.storagesForm.controls.staffId.value,
      status: 1,
      dateCreated: this.storagesItem != null ? this.storagesItem.dateCreated : new Date(),
      userId: this.userLogin.id,
      deleted: 'N'
    }

    let msgInfo = this.storagesItem == null ? 'Thêm mới thông tin kho tiền thành công.' : 'Cập nhật thông tin kho tiền thành công.';

    this.api.post(API_URL_CONSTANT.STORAGES.SAVE_OR_UPDATE, params, {}).subscribe(data => {
      if (data.id === null && this.storagesItem == null) {
        this.isCheckCode = true;
        this.loading = false;
      } else {
        this.toast.showSuccess('Thông báo', msgInfo);
        this.loading = false;
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    }, error => {
      this.toast.showError('Lỗi', 'Cập nhật thông tin kho tiền không thành công');
      this.loading = false;
    })
  }

  close() {
    this.bsModalRef.hide();
  }

}
