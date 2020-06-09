import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { APP_CONSTANT } from 'src/app/common/constant/appConstant';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { ConfirmDialogComponent } from 'src/app/common/ulti/gui/confirm-dialog/confirm-dialog.component';
import { DialogCarsComponent } from '../dialog-cars/dialog-cars.component';

@Component({
  selector: 'app-search-cars',
  templateUrl: './search-cars.component.html',
  styleUrls: ['./search-cars.component.scss']
})
export class SearchCarsComponent implements OnInit {

  bsModalRef: BsModalRef;
  loading:boolean=false;
  totalRecord:number = 0;
  size:number = APP_CONSTANT.PAGINATION.SIZE;
  page:number = 1;
  maxPageView:number = 5;

  lstCarType:any = [];
  lstBrand:any = [];
  lstTicket:any = [];
  lstStatus:any = [];
  searchForm:FormGroup;
  lstRecord:any = [];

  constructor(
    private modalService: BsModalService,
    private api : ApiService,
    private toast : ToastUltiService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getCarType();
    // this.getCarBrand();
    this.getTicket();

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
    this.search(null);
  }

  getCarType():void{
    this.loading = false;

    this.api.get(API_URL_CONSTANT.CARS.GET_CARSTYPE,{}).subscribe(data => {
      this.lstCarType = data;

      this.loading = false;
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

  buildForm(){
    this.searchForm = this.fb.group({
      code:[''],
      name:[''],
      licenseNumber:[''],
      ticketId:[''],
      carTypeId:[''],
      status:[''],
    })
  }

  search(event: any):void{
    
    this.loading = true;

    if(event != null)
      this.page = event.page;
    else
      this.page = 1;

    var searchDTO = {
      code:this.searchForm.controls.code.value,
      name:this.searchForm.controls.name.value,
      licenseNumber:this.searchForm.controls.licenseNumber.value,
      carTypeId:this.searchForm.controls.carTypeId.value != '' ? this.searchForm.controls.carTypeId.value : null,
      status:this.searchForm.controls.status.value != '' ? this.searchForm.controls.status.value : null,
      ticketId:this.searchForm.controls.ticketId.value != '' ? this.searchForm.controls.ticketId.value : null,
      page:this.page-1,
      size:this.size
    }

    let params = {
      searchDTO: JSON.stringify(searchDTO)
    }

    this.api.get(API_URL_CONSTANT.CARS.SEARCH,params).subscribe(data =>{
      this.lstRecord = data.list;
      this.totalRecord = data.count;
      this.loading = false;
    },error =>{
      this.loading = false;
    });
  }

  openDialog(item:any):void{

    const initialState = {
      title: item != null ? 'CẬP NHẬT THÔNG TIN XE TIẾP QUỸ<b>'+item.name+'</b>' : 'THÊM MỚI THÔNG TIN XE',
      item:item
    };
    this.bsModalRef = this.modalService.show(DialogCarsComponent, {initialState,class: 'modal-lg'});
    this.bsModalRef.content.onClose.subscribe(result => {
      this.search(null);
    });
  }

  confirmDeletedCars(item:any):void{
    //open confirm dialog
    const initialState = {
      title: 'XÁC NHẬN XÓA',
      message:'Bạn có chắc chắn muốn xóa xe vận chuyển biển kiểm soát <span class=\'lbl-bold\'>'+item.licenseNumber+'</span> không?'
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, {initialState});
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.deleted(item.id,item.code);
      }
    });
  }

  deleted(id:number,code:string):void{
    this.loading = true;
    this.api.post(API_URL_CONSTANT.CARS.DELETED,{},{id:id}).subscribe(data=>{
      this.toast.showSuccess('Thông báo','Xóa thành công xe <b>'+code+'</b> khỏi CSDL của hệ thống.');
      this.search(null);
    },error=>{
      this.toast.showWarning('Thông báo','Hệ thống đang bận. Xin vui lòng thử lại sau.');
      this.loading = false;
    });
  }

}
