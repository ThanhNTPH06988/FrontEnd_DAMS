import { Component, OnInit, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { IContextService } from 'src/app/common/ulti/iContext/icontext.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { APP_CONSTANT } from 'src/app/common/constant/appConstant';
import { ValidateFileService } from 'src/app/common/ulti/file/validate-file.service';

@Component({
  selector: 'app-dialog-cars',
  templateUrl: './dialog-cars.component.html',
  styleUrls: ['./dialog-cars.component.scss']
})
export class DialogCarsComponent implements OnInit {

  title:string;
  item:any;
  isExitCode:boolean = false;
  userLogin: any;

  // close dialog
  event: EventEmitter<any>=new EventEmitter();

  clearAvatar:boolean = false;

  public onClose: Subject<boolean>;
  loading:boolean = false;
  submitted:boolean = false;

  lstBranch:any=[];
  lstCarType:any=[];
  lstTicket:any=[];
  lstStatus:any = [];
  carForm:FormGroup;
  maxDate: Date;
  isRegistryDateValid: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private api : ApiService,
    private toast : ToastUltiService,
    private fb: FormBuilder,
    private iContext : IContextService,
    private validFile : ValidateFileService,
  ) {
    this.onClose = new Subject();
  }

  ngOnInit() {
    this.maxDate = new Date();
    this.userLogin = JSON.parse(sessionStorage.getItem("userLogin"));
    this.lstStatus = [
      {id:1,name:'Trống'},
      {id:2,name:'Đã có lộ trình'},
      {id:3,name:'Đã được duyệt'},
      {id:4,name:'Đã xếp tiền'},
      {id:5,name:'Đang di chuyển'},
      {id:6,name:'Về kho'},
      {id:7,name:'Nhập tiền vào kho'},
      {id:8,name:'Hết hạn đăng kiểm'}
    ];

    this.buildForm();

    this.getCarType();
    this.getCarBranch();
    this.getTicket();

    if(this.item != null){
      this.bindDataForView();
    }
  }

  get f(){return this.carForm.controls}

  bindDataForView():void{
    
    this.carForm.controls.code.setValue(this.item.code);
    this.carForm.controls.name.setValue(this.item.name);
    this.carForm.controls.licenseNumber.setValue(this.item.licenseNumber);
    this.carForm.controls.branchId.setValue(this.item.branchId);
    this.carForm.controls.ticketId.setValue(this.item.ticketId);
    this.carForm.controls.carTypeId.setValue(this.item.carTypeId);
    this.carForm.controls.color.setValue(this.item.color);
    this.carForm.controls.yearOfManufacture.setValue(this.item.yearOfManufacture);
    this.carForm.controls.countryOfManufacture.setValue(this.item.countryOfManufacture);
    this.carForm.controls.registryDate.setValue(new Date(this.item.registryDate));
    this.carForm.controls.registryDateValid.setValue(new Date(this.item.registryDateValid));
    this.carForm.controls.firstRegisDate.setValue(new Date(this.item.firstRegisDate));
    this.carForm.controls.lifetimeLimit.setValue(this.item.lifetimeLimit);
    this.carForm.controls.weightTotal.setValue(this.item.weightTotal);
    this.carForm.controls.weightGoods.setValue(this.item.weightGoods);
    //images car
    if(this.item.avatarGuiId != null && this.item.avatarName != null){
      this.clearAvatar = true;
      this.carForm.controls.avatarUrl.setValue(this.item.avatarGuiId);
      this.carForm.controls.avatarName.setValue(this.item.avatarName);
    }
  }

  buildForm(){
      this.carForm = this.fb.group({
        code:['',[
          Validators.required
        ]],
        name:['',[
          Validators.required
        ]],
        licenseNumber:['',[
          Validators.required,
          Validators.pattern('[a-zA-Z0-9- ]*')
        ]],
        branchId:['',[
          Validators.required
        ]],
        ticketId:['',[
          Validators.required
        ]],
        carTypeId:['',[
          Validators.required
        ]],
        color:['',[
          Validators.required
        ]],
        yearOfManufacture:['',[
          Validators.required,
          Validators.maxLength(4),
        ]],
        countryOfManufacture:['',[
          Validators.required
        ]],
        registryDate:['',[
          Validators.required
        ]],
        registryDateValid:['',[
          Validators.required
        ]],
        firstRegisDate:['',[
          Validators.required
        ]],
        lifetimeLimit:['',[
          Validators.required
        ]],
        weightTotal:['',[
          Validators.required
        ]],
        weightGoods:['',[
          Validators.required
        ]],
        avatarUrl:[''],
        avatarName:['']
      })
  }

  getCarType():void{
    this.loading =false;
    
    this.api.get(API_URL_CONSTANT.CARS.GET_CARSTYPE, {}).subscribe(data => {
      this.lstCarType = data;
    },error =>{
      this.loading = false;
    });
  }

  getCarBranch():void{
    this.loading =false;
    
    this.api.get(API_URL_CONSTANT.CARS.GET_BRANCH, {}).subscribe(data => {
    this.lstBranch = data;
    },error =>{
      this.loading = false;
    });
  }

  getTicket():void{
    this.loading = false;

    this.api.get(API_URL_CONSTANT.CARS.GET_TICKET,{}).subscribe(data => {
      this.lstTicket = data;

      this.loading = false;
    },error =>{
      this.loading = false;
    });
  }

  saveOrUpdate(){
    this.submitted = true;
    if (this.carForm.invalid || this.validRegistryDate()) {
      this.toast.showInfo('Thông báo','Kiểm tra lại dữ liệu đầu vào');
      return;
    }

    this.loading = true;
    let cars = {
      id: this.item != null ? this.item.id : null,
      code:this.carForm.controls.code.value,
      name:this.carForm.controls.name.value,
      licenseNumber: this.carForm.controls.licenseNumber.value,
      branchId:this.carForm.controls.branchId.value,
      ticketId:this.carForm.controls.ticketId.value,
      carTypeId:this.carForm.controls.carTypeId.value,
      color:this.carForm.controls.color.value,
      yearOfManufacture:this.carForm.controls.yearOfManufacture.value,
      countryOfManufacture:this.carForm.controls.countryOfManufacture.value,
      registryDate:this.carForm.controls.registryDate.value,
      registryDateValid:this.carForm.controls.registryDateValid.value,
      firstRegisDate:this.carForm.controls.firstRegisDate.value,
      lifetimeLimit:this.carForm.controls.lifetimeLimit.value,
      weightTotal:this.carForm.controls.weightTotal.value,
      weightGoods:this.carForm.controls.weightGoods.value,
      avatarGuiId:this.carForm.controls.avatarUrl.value,
      avatarName:this.carForm.controls.avatarName.value
    }

    let msgInfo = this.item == null ? 'Thêm mới thông tin xe vận chuyển <b>' + cars.name + '</b> thành công.' : 'Cập nhật thông tin xe vận chuyển <b>' + cars.name + '</b> thành công.';

    this.api.post(API_URL_CONSTANT.CARS.SAVE_OR_UPDATE, cars, {}).subscribe(data => {
      this.isExitCode = false;
      this.loading = false;
      if(data === null){
        this.toast.showSuccess('Thông báo','Số hiệu xe đã tồn tại. Vui lòng nhập vào số hiệu xe khác.');
        this.isExitCode = true;
        return;
      }
      this.toast.showSuccess('Thông báo', msgInfo);
      this.onClose.next(true);
      this.bsModalRef.hide();
    },error => {
      console.log(error);
      this.toast.showError('Lỗi', 'Cập nhật thông tin xe vận chuyển không thành công');
      this.loading = false;
    });
  }

  downloadAvatar():void{
    let urlDownload = API_URL_CONSTANT.API_ROOT+API_URL_CONSTANT.API_FILE.DOWNLOD+this.carForm.controls.avatarUrl.value;
    window.open(urlDownload);
  }

  //tamdt write upload avatar
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
      this.carForm.controls.avatarUrl.setValue(data.fileDownloadUri);
      this.carForm.controls.avatarName.setValue(data.fileName);
      this.toast.showSuccess('Thông báo','Tải ảnh lên thành công');
      event.target.value = '';
      this.loading = false;
    }, error => {
      this.toast.showError('Lỗi','Có lỗi phát sinh, vui lòng thao tác lại!');
      this.loading = false;
    });
  }

  deletedAvatar():void{
    this.loading = true;

    this.api.post(API_URL_CONSTANT.API_FILE.DELETED,{},{fileGuiId:this.carForm.controls.avatarUrl.value}).subscribe(data => {
      this.clearAvatar = false;
      this.carForm.controls.avatarUrl.setValue(null);
      this.carForm.controls.avatarName.setValue(null);
      this.toast.showSuccess('Thông báo','Xóa ảnh thành công');
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

  validRegistryDate() {

    debugger;
    let registryDateValid = this.carForm.controls.registryDateValid.value;
    let registryDate = this.carForm.controls.registryDate.value;

    if (registryDateValid.getTime() < registryDate.getTime()) {
      this.isRegistryDateValid = true;
      return true;
    } else {
      this.isRegistryDateValid = false;
      return false;
    }
  }
}
