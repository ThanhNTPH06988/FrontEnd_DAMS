import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { IContextService } from 'src/app/common/ulti/iContext/icontext.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';

@Component({
  selector: 'app-dialog-atms',
  templateUrl: './dialog-atms.component.html',
  styleUrls: ['./dialog-atms.component.scss']
})
export class DialogAtmsComponent implements OnInit {
    //params
    title:string;
    item:any;
    userLogin: any;
    //close dialog
    event: EventEmitter<any>=new EventEmitter();
  
  
    loading:boolean = false;
    submitted:boolean = false;
    isReadOnly:boolean = false;
    atmsForm:FormGroup;

    lstStatus:any = [];
    lstBranch:any [];
    lstProvince:any = [];
    lstDistrict:any = [];
    lstWard:any = [];

  constructor(
    public bsModalRef: BsModalRef,
    private api : ApiService,
    private toast : ToastUltiService,
    private fb: FormBuilder,
    private iContext : IContextService
  ) { }

  get f(){return this.atmsForm.controls}

  ngOnInit() {
    this.lstStatus = [
      {id:0,name:'Không hoạt động'},
      {id:1,name:'Hoạt động'}
    ];
    if (this.item != null) {
      this.isReadOnly = true;
    }
    this.buildForm();
    this.getProvince();
    this.getBranch();
    this.userLogin = JSON.parse(sessionStorage.getItem("userLogin"));
  }

  buildForm(){
    if(this.item === null){
     this.atmsForm = this.fb.group({
       addr:['',[
         Validators.required,
         Validators.maxLength(100),
       ]],
       latitude:['',[
         Validators.required,
         Validators.maxLength(100),
       ]],
       longitude:['',[
         Validators.required,
         Validators.maxLength(100),
       ]],
       code:['',[
         Validators.required,
         Validators.maxLength(50),
       ]],
       branchId:['',[
        Validators.required,
      ]],
       provinceCode:['',[
         Validators.required
       ]],
       districtCode:['',[
         Validators.required
       ]],
       wardCode:['',[
         Validators.required
       ]],
     });
 }
 else{
   this.atmsForm = this.fb.group({
     addr:['',[
       Validators.required,
       Validators.maxLength(100),
     ]],
     latitude:['',[
       Validators.required,
       Validators.maxLength(100),
     ]],
     longitude:['',[
       Validators.required,
       Validators.maxLength(100),
     ]],
     status:['',[
       Validators.required,
     ]],
     code:['',[
       Validators.required,
       Validators.maxLength(50),
     ]],
     branchId:['',[
      Validators.required,
    ]],
     provinceCode:['',[
       Validators.required
     ]],
     districtCode:['',[
       Validators.required
     ]],
     wardCode:['',[
       Validators.required
     ]],
   });

   this.dataBinding();
 }
}

getProvince(){
  this.api.get(API_URL_CONSTANT.ADDR.ADDR_PROVINCE,{}).subscribe(data => {
    this.lstProvince = data;
  },error => {
    this.toast.showError("Lỗi","Không lấy được dữ liệu!");      
  });
}

getBranch(){
  this.api.get(API_URL_CONSTANT.BRANCH.GET_ALL,{}).subscribe(data => {
    this.lstBranch = data.list;
    this.loading = false;
  },error => {
    this.toast.showError("Lỗi","Không lấy được dữ liệu!");    
    this.loading = false;  
  });
}

getDistrict(){

  this.loading = true;
  let params = {
    provinceCode:this.atmsForm.controls.provinceCode.value
    //  provinceCode: 282
  };
  if(params.provinceCode === ''){
    this.lstDistrict = [];
    this.atmsForm.controls.districtCode.setValue('');
    this.lstWard = [];
    this.atmsForm.controls.wardCode.setValue('');
    this.loading = false;
  }
  else
  {
  this.lstDistrict = [];
  this.atmsForm.controls.districtCode.setValue('');
  this.api.get(API_URL_CONSTANT.ADDR.ADDR_DISTRICT,params).subscribe(data => {
    this.lstDistrict = data;
    this.loading = false;
  },error => {
    this.toast.showError("Lỗi","Không lấy được dữ liệu!");    
    this.loading = false;  
  });
}
}

getWard(){

  this.loading = true;
  let params = {
    districtCode:this.atmsForm.controls.districtCode.value
  }
  if(params.districtCode === ''){
    this.lstWard = [];
    this.atmsForm.controls.wardCode.setValue('');
    this.loading = false;
  }
  else{
  this.lstWard = [];
  this.atmsForm.controls.wardCode.setValue('');
  this.api.get(API_URL_CONSTANT.ADDR.ADDR_WARD,params).subscribe(data => {
    this.lstWard = data;
    this.loading = false;
  },error => {
    this.toast.showError("Lỗi","Không lấy được dữ liệu!");    
    this.loading = false;  
  });
}
}

saveOrUpdate(item:any){
  this.submitted = true;
  if (this.atmsForm.invalid) {
    this.toast.showInfo('Thông báo','Kiểm tra lại dữ liệu đầu vào');
    return;
  }
  this.loading = true;
  let params = {
    id:this.item != null ? this.item.id : null,
    code:this.atmsForm.controls.code.value,
    latitude: this.atmsForm.controls.latitude.value,
    longitude: this.atmsForm.controls.longitude.value,
    // status:this.item != null ? this.atmsForm.controls.status.value : 1,
    status:this.item != null ? this.atmsForm.controls.status.value : null,
    addrDetail:this.atmsForm.controls.addr.value,
    branchId:this.atmsForm.controls.branchId.value,
    addrId:this.atmsForm.controls.wardCode.value,
    deleted: this.item != null ? this.item.deleted : null,
    dateCreated: this.item != null ? this.item.dateCreated : new Date,
    userId: this.item != null ? this.item.userId : null,
  }
  this.api.post(API_URL_CONSTANT.ATMS.SAVE_OR_UPDATE,params,{}).subscribe(data => {
    if(data.id === null){
      this.toast.showInfo('Thông báo','Mã ATM <b>'+params.code+'</b> đã tồn tại trong hệ thống. Vui lòng nhập mã ATM khác.');
    }else{
      this.toast.showSuccess('Thông báo','Lưu dữ liệu thành công.');
      this.event.emit('OK');
      this.bsModalRef.hide();
    }
    this.loading = false;
  },error => {
    this.toast.showWarning('Thông báo','Hệ thống đang bận. Xin vui lòng thử lại sau.');
    this.loading = false;
  });
}

dataBinding(){
  this.atmsForm.controls.provinceCode.setValue(this.item.addr.provinceCode);
  this.getDistrict();
  this.atmsForm.controls.districtCode.setValue(this.item.addr.districtCode);
  this.getWard();
  this.atmsForm.controls.wardCode.setValue(this.item.addrId);
  this.atmsForm.controls.status.setValue(this.item.status);
  this.atmsForm.controls.code.setValue(this.item.code);
  this.atmsForm.controls.branchId.setValue(this.item.branch.id);
  this.atmsForm.controls.addr.setValue(this.item.addrDetail);
  this.atmsForm.controls.latitude.setValue(this.item.latitude);
  this.atmsForm.controls.longitude.setValue(this.item.longitude);
}

  close(){
    this.bsModalRef.hide();
  }

}
