import { Component, OnInit, EventEmitter } from '@angular/core';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { IContextService } from 'src/app/common/ulti/iContext/icontext.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-dialog-cassette',
  templateUrl: './dialog-cassette.component.html',
  styleUrls: ['./dialog-cassette.component.scss']
})
export class DialogCassetteComponent implements OnInit {
  //params
  title:string;
  item:any;
  userLogin: any;
  //close dialog
  event: EventEmitter<any>=new EventEmitter();

  casstteType:any = {
    value:null,
    size:null
  }

  loading:boolean = false;
  submitted:boolean = false;
  isReadOnly:boolean = false;

  casstteForm:FormGroup;

  lstStatus:any = [];
  lstBranch:any [];
  lstType:any = [];
  lstStorage:any = [];
  lstCass:any = [];

  cassChoice:any = {
    value:'',
    size:'',
  };

  constructor(
    public bsModalRef: BsModalRef,
    private api : ApiService,
    private toast : ToastUltiService,
    private fb: FormBuilder,
    private iContext : IContextService
  ) { }

  ngOnInit() {
    this.lstStatus = [
      {id:0,name:'Không hoạt động'},
      {id:1,name:'Hoạt động'}
    ];
    if (this.item != null) {
      this.isReadOnly = true;
    }
    this.buildForm();
    this.getBranch();
    this.getAllType();
    this.getAllStorage();
    this.userLogin = JSON.parse(sessionStorage.getItem("userLogin"));
  }

  onChangeType():void{
    let cassType = _.filter(this.lstType,(obj)=>{
      return obj.id === this.casstteForm.controls.typeId.value;
    })[0];

  
    this.casstteType.value = cassType.value + ' vnđ';
    this.casstteType.size = cassType.casstteSize + ' mm';
  }

  get f(){return this.casstteForm.controls}

  buildForm(){
    if(this.item === null){
     this.casstteForm = this.fb.group({
       typeId:['',[
         Validators.required,
       ]],
       storageId:['',[
         Validators.required,
       ]],
       code:['',[
         Validators.required,
         Validators.maxLength(5),
       ]],
       stt:['',[
        Validators.required,
        Validators.maxLength(3),
      ]],
       branchId:['',[
        Validators.required,
      ]],
      maxBill:['',[
        Validators.required,
        Validators.maxLength(10),
      ]],
     });
 }
 else{
   this.casstteForm = this.fb.group({
    typeId:['',[
      Validators.required,
    ]],
    storageId:['',[
      Validators.required,
    ]],
    code:['',[
      Validators.required,
      Validators.maxLength(5),
    ]],
    stt:['',[
     Validators.required,
     Validators.maxLength(3),
   ]],
    branchId:['',[
     Validators.required,
   ]],
   maxBill:['',[
     Validators.required,
     Validators.maxLength(10),
   ]],
     status:['',[
       Validators.required,
     ]]
   });

   this.dataBinding();
 }
}

getBranch(){
  this.api.get(API_URL_CONSTANT.BRANCH.GET_ALL,{}).subscribe(data => {
    this.lstBranch = data;
    this.loading = false;
  },error => {
    this.toast.showError("Lỗi","Không lấy được dữ liệu!");    
    this.loading = false;  
  });
}

getAllType(){
  this.api.get(API_URL_CONSTANT.CASSTTE_TYPE.ALL,{}).subscribe(data => {
    this.lstType = data;
    this.loading = false;
  },error => {
    this.toast.showError("Lỗi","Không lấy được dữ liệu!");    
    this.loading = false;  
  });
}

getAllStorage(){
  this.api.get(API_URL_CONSTANT.STORAGES.GET_ALL,{}).subscribe(data => {
    this.lstStorage = data;
    this.loading = false;
  },error => {
    this.toast.showError("Lỗi","Không lấy được dữ liệu!");    
    this.loading = false;  
  });
}

saveOrUpdate(item:any){
  this.submitted = true;
  if (this.casstteForm.invalid) {
    this.toast.showInfo('Thông báo','Kiểm tra lại dữ liệu đầu vào');
    return;
  }
  this.loading = true;
  let params = {
    id:this.item != null ? this.item.id : null,
    code:this.casstteForm.controls.code.value,
    branchId: this.casstteForm.controls.branchId.value,
    casstteTypeId: this.casstteForm.controls.typeId.value,
    // status:this.item != null ? this.casstteForm.controls.status.value : 1,
    status:this.item != null ? this.casstteForm.controls.status.value : null,
    storageId:this.casstteForm.controls.storageId.value,
    value:1111,
    maxBill:this.casstteForm.controls.maxBill.value,
    deleted: this.item != null ? this.item.deleted : null,
    dateCreated: this.item != null ? this.item.dateCreated : null,
    userId: this.item != null ? this.item.userId : null,
    latUpdate:this.item != null ? new Date : null,
    userUpdateId: this.item != null ? this.userLogin.id : null,
  }
  this.api.post(API_URL_CONSTANT.CASSTTE.SAVE_OR_UPDATE,params,{}).subscribe(data => {
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
  this.casstteForm.controls.status.setValue(this.item.status);
  this.casstteForm.controls.code.setValue(this.item.code);
  this.casstteForm.controls.branchId.setValue(this.item.branch.id);
  this.casstteForm.controls.typeId.setValue(this.item.casstteTypeId);
  this.casstteForm.controls.storageId.setValue(this.item.storageId);
  this.casstteForm.controls.maxBill.setValue(this.item.maxBill);
  this.casstteType.value = this.item.type.value + ' vnđ';
    this.casstteType.size = this.item.type.casstteSize + ' mm';
  // this.onChangeType();
}

  close(){
    this.bsModalRef.hide();
  }

}
