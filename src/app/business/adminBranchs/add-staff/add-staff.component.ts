import { Component, EventEmitter, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap";
import { ApiService } from "src/app/common/api/api.service";
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { APP_CONSTANT } from 'src/app/common/constant/appConstant';
import { ValidateFileService } from "src/app/common/ulti/file/validate-file.service";
import { ToastUltiService } from "src/app/common/ulti/toast/toast-ulti.service";
import * as _ from 'lodash';

@Component({
  selector: "app-add-staff",
  templateUrl: "./add-staff.component.html",
  styleUrls: ["./add-staff.component.scss"]
})
export class AddStaffComponent implements OnInit {
  @Input() item: any;
  @Input() index: any;
  clearAvatar: boolean = false;
  clearFileExcel: boolean = false;
  isExitCode: boolean = false;
  maxDate: any = new Date();
  event: EventEmitter<any> = new EventEmitter();

  staffForm: FormGroup;
  staffItem: any;
  userLogin: any;
  lstStaff: any = [];
  lstPosition: any = [];
  lstProvince: any = [];
  lstDistrict: any = [];
  lstWard: any = [];
  lstBranch: any = [];

  loading: boolean = false;
  submitted: boolean = false;
  isReadOnly: boolean = false;

  constructor(
    public bsModalRefStaff: BsModalRef,
    private api: ApiService,
    private toast: ToastUltiService,
    private fb: FormBuilder,
    private validFile: ValidateFileService
  ) {
  }

  ngOnInit() {
    this.userLogin = JSON.parse(sessionStorage.getItem("userLogin"));
    this.staffItem = this.item;
    this.buildForm();
    if (this.staffItem != null) {
      this.isReadOnly = true;
      this.bindingDataEdit();
    }
    this.getPosition();
    this.getProvince();
    this.getBranch();
  }

  get f() { return this.staffForm.controls; }

  getBranch() {
    this.api.get(API_URL_CONSTANT.BRANCH.GET_ALL, {}).subscribe(data => {
      this.lstBranch = data.list;
    }, error => {
      this.toast.showError("Lỗi", "Không lấy được dữ liệu.");
    });
  }

  getProvince() {
    this.lstProvince = [];
    this.api.get(API_URL_CONSTANT.ADDR.ADDR_PROVINCE, {}).subscribe(data => {
      this.lstProvince = data;
    }, error => {
      this.toast.showError("Lỗi", "Không lấy được dữ liệu.");
    });
  }

  getDistrict() {
    this.loading = true;
    this.lstDistrict = [];
    this.lstWard = [];
    this.staffForm.controls.districtCode.setValue('');
    this.staffForm.controls.addrId.setValue('');

    let params = {
      provinceCode:this.staffForm.controls.provinceCode.value
    };
    this.api.get(API_URL_CONSTANT.ADDR.ADDR_DISTRICT, params).subscribe(data => {
      this.lstDistrict = data;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.toast.showError("Lỗi", "Không lấy được dữ liệu.");
    });
  }

  getWard() {
    this.loading = true;
    this.lstWard = [];
    this.staffForm.controls.addrId.setValue('');

    let params = {
      districtCode:this.staffForm.controls.districtCode.value
    };
    this.api.get(API_URL_CONSTANT.ADDR.ADDR_WARD, params).subscribe(data => {
      this.lstWard = data;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.toast.showError("Lỗi", "Không lấy được dữ liệu.");
    });
  }

  getPosition() {
    this.api.get(API_URL_CONSTANT.STAFF.POSITION.GET_POSITION, {}).subscribe(data => {
      this.lstPosition = data;
    }, error => {
      this.toast.showError("Lỗi", "Không lấy được dữ liệu.");
    });
  }

  bindingDataEdit() {
    this.staffForm.controls.provinceCode.setValue(this.item.addr ? this.item.addr.provinceCode : this.item.provinceCode);
    this.getDistrict();
    this.staffForm.controls.districtCode.setValue(this.item.addr ? this.item.addr.districtCode : this.item.districtCode);
    this.getWard();
    this.staffForm.controls.addrId.setValue(this.item.addrId);
    this.staffForm.controls.code.setValue(this.staffItem.code);
    this.staffForm.controls.name.setValue(this.staffItem.name);
    this.staffForm.controls.dateOfBirth.setValue(new Date(this.staffItem.dateOfBirth));
    this.staffForm.controls.idcard.setValue(this.staffItem.idcard);
    this.staffForm.controls.email.setValue(this.staffItem.email);
    this.staffForm.controls.phoneNumber.setValue(this.staffItem.phoneNumber);
    this.staffForm.controls.positionId.setValue(this.staffItem.positionId);
    this.staffForm.controls.addrDetail.setValue(this.staffItem.addrDetail);
  }

  buildForm() {
    this.staffForm = this.fb.group({
      code: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('[a-zA-Z0-9_\/]*')
      ]],
      name: ['', [
        Validators.required,
        Validators.maxLength(100),
      ]],
      dateOfBirth: ['', [
        Validators.required
      ]],
      idcard: ['', [
        Validators.required,
        Validators.pattern('[0-9]+'),
        Validators.minLength(9),
        Validators.maxLength(12),
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]+$')
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('[0-9]+'),
        Validators.minLength(10),
        Validators.maxLength(11),
      ]],
      positionId: ['', [
        Validators.required
      ]],
      provinceCode:['', [
        Validators.required
      ]],
      districtCode:['', [
        Validators.required
      ]],
      addrId:['', [
        Validators.required
      ]],
      addrDetail: ['', [
        Validators.required,
        Validators.maxLength(100),
      ]],
      avatarUrl:[''],
      avatarName:['']
    })
  }

  // save or update data
  saveOrUpdate() {
    this.submitted = true;
    if (this.staffForm.invalid) {
      this.toast.showInfo('Thông báo', 'Kiểm tra lại dữ liệu đầu vào');
      return;
    }

    let addrId = this.staffForm.controls.addrId.value;
    let obj = _.find(this.lstWard, function (obj) {
      return obj.id == addrId;
    });

    let staffInfo = {
      id: this.index != null ? this.staffItem.id : null,
      code: this.staffForm.controls.code.value,
      name: this.staffForm.controls.name.value,
      dateOfBirth: this.staffForm.controls.dateOfBirth.value,
      idcard: this.staffForm.controls.idcard.value,
      email: this.staffForm.controls.email.value,
      phoneNumber: this.staffForm.controls.phoneNumber.value,
      addrDetail: this.staffForm.controls.addrDetail.value,
      addrId: this.staffForm.controls.addrId.value,
      // branchId: this.staffItem != null ? this.staffItem.branchId : null,
      positionId: this.staffForm.controls.positionId.value,
      status:this.staffItem != null ? this.staffItem.status : 1,
      dateCreated:this.index != null ? this.staffItem.dateCreated : new Date(),
      userId:this.staffItem != null ? this.staffItem.userId : this.userLogin.id,
      deleted:this.staffItem != null ? this.staffItem.deleted : 'N',
      avatarGuiId:this.staffForm.controls.avatarUrl.value,
      avatarName:this.staffForm.controls.avatarName.value,
      provinceCode: this.staffForm.controls.provinceCode.value,
      districtCode: this.staffForm.controls.districtCode.value,
      fullName: obj.fullName
    }

    this.event.emit(staffInfo);
    this.bsModalRefStaff.hide();
  }

  //tamdt write upload avatar and excel
  downloadTemp():void{
    let urlFile:string = API_URL_CONSTANT.API_ROOT + API_URL_CONSTANT.API_FILE.DOWNLOD+APP_CONSTANT.DEFAULT.TEMPLATE;
    window.open(urlFile);
  }
  onUploadExcel(event: any){
    let files = event.target.files;
    if (files.length === 0)
      return;
    if (!this.validFile.validateFileExtensions(APP_CONSTANT.FILE_FORMAT.EXCEL,files[0].name))
      return ;

    let fd = new FormData();
    fd.append("file", files[0]);
    this.loading = true;
    this.api.uploadOneFile(fd).subscribe(data => {
      this.clearFileExcel = true;
      this.toast.showSuccess('Thông báo','Tải ảnh nhân viên lên thành công');
      event.target.value = '';
      this.loading = false;
    }, error => {
      this.toast.showError('Lỗi','Có lỗi phát sinh, vui lòng thao tác lại!');
      this.loading = false;
    });

  }

  onUploadAvatar(event: any){
    let files = event.target.files;
    if (files.length === 0)
      return;
    if (!this.validFile.validateFileExtensions(APP_CONSTANT.FILE_FORMAT.IMG,files[0].name))
      return ;

    let fd = new FormData();
    fd.append("file", files[0]);
    this.loading = true;
    this.api.uploadOneFile(fd).subscribe(data => {
      this.clearAvatar = true;
      this.staffForm.controls.avatarUrl.setValue(data.fileDownloadUri);
      this.staffForm.controls.avatarName.setValue(data.fileName);
      this.toast.showSuccess('Thông báo','Tải ảnh nhân viên lên thành công');
      event.target.value = '';
      this.loading = false;
    }, error => {
      this.toast.showError('Lỗi','Có lỗi phát sinh, vui lòng thao tác lại!');
      this.loading = false;
    });

  }

  deletedAvatar():void{
    this.loading = true;

    this.api.post(API_URL_CONSTANT.API_FILE.DELETED,{},{fileGuiId:this.staffForm.controls.avatarUrl.value}).subscribe(data => {
      this.clearAvatar = false;
      this.staffForm.controls.avatarUrl.setValue(null);
      this.staffForm.controls.avatarName.setValue(null);
      this.toast.showSuccess('Thông báo','Xóa ảnh thành công ảnh nhân viên');
      this.loading = false;
    },error => {
      this.loading = false;
      this.toast.showError('Lỗi','Có lỗi phát sinh, vui lòng thao tác lại!');
    });
  }

  close() {
    this.bsModalRefStaff.hide();
  }
}
