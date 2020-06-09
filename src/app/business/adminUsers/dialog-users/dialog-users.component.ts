import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IContextService } from 'src/app/common/ulti/iContext/icontext.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import * as _ from 'lodash';
import { APP_CONSTANT } from 'src/app/common/constant/appConstant';
import { ValidateFileService } from 'src/app/common/ulti/file/validate-file.service';

@Component({
  selector: 'app-dialog-users',
  templateUrl: './dialog-users.component.html',
  styleUrls: ['./dialog-users.component.scss']
})
export class DialogUsersComponent implements OnInit {

  //params
  title:string;
  item:any;
  //close dialog
  event: EventEmitter<any>=new EventEmitter();

  clearAvatar:boolean=false;


  loading:boolean = false;
  submitted:boolean = false;
  isExitUsername:boolean = false;

  usersForm:FormGroup;

  lstRoleGrant:any = [];
  lstRoleNoGrant:any = [];

  lstBranch:any = [];

  lstStaff:any = [];
  staffChoice:any = {
    position:'',
    email:'',
    phone:'',
    branch:''
  };
  staff:any;

  chkAllNoGrant:boolean = false;
  chkAllGrant:boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private api : ApiService,
    private toast : ToastUltiService,
    private fb: FormBuilder,
    private iContext : IContextService,
    private validFile : ValidateFileService
  ) { }

  get f(){return this.usersForm.controls}

  ngOnInit() {
    this.buildForm();
    this.getRoleGrant();
    this.getAllBranch();
  }

  buildForm():void{
    this.usersForm = this.fb.group({
      userName:['',[
        Validators.required
      ]],
      staffId:['',[
        Validators.required
      ]],
      branchId:['',[
        Validators.required
      ]],
      avatarUrl:[''],
      avatarName:['']
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

  getStaffByBranch():void{
    this.lstStaff = [];
    this.usersForm.controls.staffId.setValue("");
    //clear data old
    this.staffChoice.position = null;
    this.staffChoice.email = null;
    this.staffChoice.phone = null;
    this.staffChoice.branch = null;
    this.staff = null;

    this.loading = true;
    this.api.get(API_URL_CONSTANT.STAFF.GET_BY_BRANCH,{branchId:this.usersForm.controls.branchId.value}).subscribe(data => {
      this.lstStaff = data.list;
      this.loading = false;
    },error => {
      this.loading = false;
    });
  }

  // checkIsExitInUsers():void{
  //   this.loading = true;
  //   this.api.get(API_URL_CONSTANT.STAFF.IS_EXIT_IN_USERS,{}).subscribe(data=>{
  //     let rs = data.data;
  //     if(rs >0){
  //       this.toast.showInfo('Thông báo','Nhân viên');
  //     }
  //   },error=>{

  //   });
  // }

  onChangeStaff():void{
    let staffCh = _.filter(this.lstStaff,(obj)=>{
      return obj.id === this.usersForm.controls.staffId.value;
    })[0];

    this.staffChoice.position = staffCh.staffPositionDomain.name;
    this.staffChoice.email = staffCh.email;
    this.staffChoice.phone = staffCh.phoneNumber;
    this.staffChoice.branch = staffCh.branchDomain.name;

    this.staff = staffCh;
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
      this.usersForm.controls.avatarUrl.setValue(data.fileDownloadUri);
      this.usersForm.controls.avatarName.setValue(data.fileName);
      this.toast.showSuccess('Thông báo','Tải ảnh đại diện lên thành công');
      event.target.value = '';
      this.loading = false;
    }, error => {
      this.toast.showError('Lỗi','Có lỗi phát sinh, vui lòng thao tác lại!');
      this.loading = false;
    });

  }

  deletedAvatar():void{
    this.loading = true;

    this.api.post(API_URL_CONSTANT.API_FILE.DELETED,{},{fileGuiId:this.usersForm.controls.avatarUrl.value}).subscribe(data => {
      this.clearAvatar = false;
      this.usersForm.controls.avatarUrl.setValue(null);
      this.usersForm.controls.avatarName.setValue(null);
      this.toast.showSuccess('Thông báo','Xóa ảnh đại diện thành công');
      this.loading = false;
    },error => {
      this.loading = false;
      this.toast.showError('Lỗi','Có lỗi phát sinh, vui lòng thao tác lại!');
    });
  }

  checkGrantItem(type:number):void{
    if(type === 0){
      let lstChoieNoGrant = _.filter(this.lstRoleNoGrant,(obj)=>{
        return obj.choice;
      });
      if(lstChoieNoGrant.length === this.lstRoleNoGrant.length){
        this.chkAllNoGrant = true;
      }else{
        this.chkAllNoGrant = false;
      }
    }else{
      let lstChoieGrant = _.filter(this.lstRoleGrant,(obj)=>{
        return obj.choice;
      });
      if(lstChoieGrant.length === this.lstRoleGrant.length){
        this.chkAllGrant = true;
      }else{
        this.chkAllGrant = false;
      }
    }
  }

  checkGrant(type:number):void{
    if(type === 0){
      _.map(this.lstRoleNoGrant,(obj)=>{
        obj.choice = this.chkAllNoGrant;
        return obj;
      });
    }else{
      _.map(this.lstRoleGrant,(obj)=>{
        obj.choice = this.chkAllGrant;
        return obj;
      });
    }
  }
  moveRight():void{
    let lstChoice = _.filter(this.lstRoleNoGrant,(obj)=>{
      return obj.choice;
    });

    if(lstChoice.length === 0){
      this.toast.showInfo('Thông báo','Chọn ít nhất 1 quyền để gán cho menu');
      return;
    }
    //xoa khoi danh sach chua duoc phan quyen
    this.lstRoleNoGrant = _.reject(this.lstRoleNoGrant,(obj)=>{
      return obj.choice;
    });

    //chuyen sang lst phan quyen
    _.map(lstChoice,(obj)=>{
      obj.choice = false;
      return obj;
    });
    this.lstRoleGrant = _.concat(this.lstRoleGrant,lstChoice);
  
    if(this.chkAllNoGrant)
      this.chkAllNoGrant = !this.chkAllNoGrant;
  }
  moveLeft():void{
    let lstChoice = _.filter(this.lstRoleGrant,(obj)=>{
      return obj.choice;
    });

    if(lstChoice.length === 0){
      this.toast.showInfo('Thông báo','Chọn ít nhất 1 quyền để bỏ gán cho menu');
      return;
    }

    //xoa khoi danh sach chua duoc phan quyen
    this.lstRoleGrant = _.reject(this.lstRoleGrant,(obj)=>{
      return obj.choice;
    });

    //chuyen sang lst phan quyen
    _.map(lstChoice,(obj)=>{
      obj.choice = false;
      return obj;
    });
    this.lstRoleNoGrant = _.concat(this.lstRoleNoGrant,lstChoice);
  
    if(this.chkAllGrant)
      this.chkAllGrant = !this.chkAllGrant;
  }

  getRoleGrant():void{
    this.loading = true;
    let param = {
      userId:this.item != null ? this.item.id : 0
    }    
    this.api.get(API_URL_CONSTANT.USERS.GET_ROLE_FOR_USERS,param).subscribe(data => {
      let rs = JSON.parse(JSON.stringify(data.data));
      this.lstRoleGrant = rs.lstGrant != null ? rs.lstGrant : [];
      this.lstRoleNoGrant = rs.lstNoGrant != null ? rs.lstNoGrant : [];
      this.loading = false;
    },error => {
      this.toast.showWarning('Thông báo','Hệ thống đang bận. Xin vui lòng thửu lại sau.');
      this.loading = false;
    })
  }

  saveOrUpdate():void{

    if(this.item != null){
      this.grantRole();
    }else{
      this.save();
    }
  }

  grantRole():void{
    this.loading = true;
    let str = {
      userId:this.item.id,
      lstRoles:this.lstRoleGrant
    }

    let params = {
      grantDTO: JSON.stringify(str)
    }

    this.api.post(API_URL_CONSTANT.USERS.GRANT_ROLE,{},params).subscribe(data=>{
      this.toast.showSuccess('Thông báo','Phân quyền thành công.');
      this.loading = false;
      this.event.emit('OK');
      this.bsModalRef.hide();
    },error => {
      this.toast.showInfo('Thông báo','Có lỗi phát sinh, vui lòng liên hệ với quản trị viên để được trợ giúp.Cảm ơn!');
      this.loading = false;
    });

  }

  save():void{
    this.submitted = true;
    if (this.usersForm.invalid) {
      this.toast.showInfo('Thông báo','Kiểm tra lại dữ liệu đầu vào');
      return;
    }

    this.loading = true;

    debugger;
    let users = {
      userName:this.usersForm.controls.userName.value,
      staffId:this.usersForm.controls.staffId.value,
      avatarGuiId:this.usersForm.controls.avatarUrl.value,
      avatarName:this.usersForm.controls.avatarName.value,
      lstRoles:this.lstRoleGrant,
      staffDomainAdd:this.staff
    }

    this.api.post(API_URL_CONSTANT.USERS.SAVE_OR_UPDATE,users,{}).subscribe(data=>{
      debugger;
      this.isExitUsername = false;
      if(data === null){
        this.toast.showSuccess('Thông báo','Tên đăng nhập đã tồn tại. Vui lòng chọn tên đăng nhập khác.');
        this.isExitUsername = true;
        return;
      }

      this.toast.showSuccess('Thông báo','Thêm mới tài khoản thành công.');
      this.loading = false;
      this.event.emit('OK');
      this.bsModalRef.hide();
    },error => {
      debugger;
      this.toast.showInfo('Thông báo','Có lỗi phát sinh, vui lòng liên hệ với quản trị viên để được trợ giúp.Cảm ơn!');
      this.loading = false;
    });
  }

  close(){
    this.bsModalRef.hide();
  }

}
