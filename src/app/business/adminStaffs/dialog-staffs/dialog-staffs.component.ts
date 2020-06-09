import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import * as _ from 'lodash';
import { ValidateFileService } from 'src/app/common/ulti/file/validate-file.service';
import { APP_CONSTANT } from 'src/app/common/constant/appConstant';
@Component({
  selector: 'app-dialog-staffs',
  templateUrl: './dialog-staffs.component.html',
  styleUrls: ['./dialog-staffs.component.scss']
})
export class DialogStaffsComponent implements OnInit {
  @Input() item: any;

  clearAvatar:boolean = false;
  clearFileExcel:boolean = false;
  isExitCode:boolean = false;
  maxDateBirth:any = new Date();

  staffForm: FormGroup;
  staffItem: any;
  userLogin: any;
  lstStaff: any = [];
  lstPosition: any = [];
  lstProvince: any =[];
  lstDistrict:any = [];
  lstWard: any = [];
  lstBranch: any =[];

  loading: boolean = false;
  submitted: boolean = false;
  isReadOnly: boolean = false;
  isDateBirthday: boolean = false;

  public onClose: Subject<boolean>;
  constructor(
    public bsModalRef: BsModalRef,
    private api: ApiService,
    private toast: ToastUltiService,
    private fb: FormBuilder,
    private validFile : ValidateFileService,
  ) {
    this.onClose = new Subject();
  }

  ngOnInit() {
    this.maxDateBirth = new Date();
    this.userLogin = JSON.parse(sessionStorage.getItem("userLogin"));
    this.staffItem = this.item;
    this.buildForm();

    if (this.staffItem != null) {
      console.log(this.staffItem);
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

    //clear dist and war
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
    //clear dist and war
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
    this.staffForm.controls.provinceCode.setValue(this.item.addr.provinceCode);
    this.getDistrict();
    this.staffForm.controls.districtCode.setValue(this.item.addr.districtCode);
    this.getWard();
    this.staffForm.controls.addrId.setValue(this.item.addrId);
    this.staffForm.controls.code.setValue(this.staffItem.code);
    this.staffForm.controls.name.setValue(this.staffItem.name);
    this.staffForm.controls.dateOfBirth.setValue(new Date(this.staffItem.dateOfBirth));
    this.staffForm.controls.idcard.setValue(this.staffItem.idcard);
    this.staffForm.controls.email.setValue(this.staffItem.email);
    this.staffForm.controls.phoneNumber.setValue(this.staffItem.phoneNumber);
    this.staffForm.controls.positionId.setValue(this.staffItem.positionId);
    this.staffForm.controls.branchId.setValue(this.staffItem.branchId);
    this.staffForm.controls.addrDetail.setValue(this.staffItem.addrDetail);

    //anh nhan vien
    if(this.staffItem.avatarGuiId != null && this.staffItem.avatarName != null){
      this.clearAvatar = true;
      this.staffForm.controls.avatarUrl.setValue(this.staffItem.avatarGuiId);
      this.staffForm.controls.avatarName.setValue(this.staffItem.avatarName);
    }
  }
  buildForm() {
    this.staffForm = this.fb.group({
      code: ['', [
        Validators.required,
        Validators.maxLength(50),
        // Validators.pattern('[a-zA-Z0-9_\/]*')
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
      branchId: ['', [
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

  validDateBirth() {
    debugger;
    let dateBirthday = this.staffForm.controls.dateOfBirth.value;
    var today = new Date();
    var birthDate = new Date(dateBirthday);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
    }

    if(age<18){
      this.isDateBirthday = true;
      return true;
    }else{
      this.isDateBirthday = false;
      return false;
    }
  }

  // save or update data
  saveOrUpdate() {
    this.submitted = true;
    debugger;
    if (this.staffForm.invalid || this.validDateBirth()) {
      this.toast.showInfo('Thông báo', 'Kiểm tra lại dữ liệu đầu vào');
      return;
    }
    
    let staffInfo = {
      id: this.staffItem != null ? this.staffItem.id : null,
      code: this.staffForm.controls.code.value,
      name: this.staffForm.controls.name.value,
      dateOfBirth: this.staffForm.controls.dateOfBirth.value,
      idcard: this.staffForm.controls.idcard.value,
      email: this.staffForm.controls.email.value,
      phoneNumber: this.staffForm.controls.phoneNumber.value,
      positionId: this.staffForm.controls.positionId.value,
      branchId: this.staffForm.controls.branchId.value,
      addrId: this.staffForm.controls.addrId.value,
      avatarGuiId:this.staffForm.controls.avatarUrl.value,
      avatarName:this.staffForm.controls.avatarName.value,
      addrDetail: this.staffForm.controls.addrDetail.value
    }

    let msgInfo = this.staffItem == null ? 'Thêm mới thông tin nhân viên <b>' + staffInfo.name + '</b> thành công.' : 'Cập nhật thông tin nhân viên <b>' + staffInfo.name + '</b> thành công.';

    this.api.post(API_URL_CONSTANT.STAFF.SAVEORUPDATE, staffInfo, {}).subscribe(data => {
      this.isExitCode = false;
      if(data === null){
        this.toast.showSuccess('Thông báo','Mã nhân viên đã tồn tại trong chi nhánh. Vui lòng nhập vào mã nhân viên khác.');
        this.isExitCode = true;
        return;
      }
      this.toast.showSuccess('Thông báo', msgInfo);
      this.loading = false;
      this.onClose.next(true);
      this.bsModalRef.hide();
    }, error => {
      console.log(error);
      this.toast.showError('Lỗi', 'Cập nhật thông tin nhân viên không thành công');
      this.loading = false;
    })
  }

  //tamdt write upload avatar and excel
  downloadTemp():void{
    let urlFile:string = API_URL_CONSTANT.API_ROOT + API_URL_CONSTANT.API_FILE.DOWNLOD+APP_CONSTANT.DEFAULT.TEMPLATE;
    window.open(urlFile);
  }
  onUploadExcel(event: any){
    debugger;
    let files = event.target.files;
    if (files.length === 0)
      return;
    if (!this.validFile.validateFileExtensions(APP_CONSTANT.FILE_FORMAT.EXCEL,files[0].name))
      return ;

    let fd = new FormData();
    fd.append("file", files[0]);
    this.loading = true;
    this.api.postFile("staffUploadExcel",fd).subscribe(data => {
      console.log(data);
    },error => {
      console.log(error);
    });

    // this.api.uploadOneFile(fd).subscribe(data => {
    //   this.clearFileExcel = true;
    //   this.toast.showSuccess('Thông báo','Tải ảnh nhân viên lên thành công');
    //   event.target.value = '';
    //   this.loading = false;
    // }, error => {
    //   this.toast.showError('Lỗi','Có lỗi phát sinh, vui lòng thao tác lại!');
    //   this.loading = false;
    // });

  }

  downloadAvatar():void{
    let urlDownload = API_URL_CONSTANT.API_ROOT+API_URL_CONSTANT.API_FILE.DOWNLOD+this.staffForm.controls.avatarUrl.value;
    window.open(urlDownload);
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
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
