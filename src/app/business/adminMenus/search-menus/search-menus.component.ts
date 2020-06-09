import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { getDatepickerConfig } from 'src/app/app.component';
import { GrantMenusComponent } from '../grant-menus/grant-menus.component';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { FormGroup, FormBuilder } from '@angular/forms';
import { APP_CONSTANT } from 'src/app/common/constant/appConstant';
import { ConfirmDialogComponent } from 'src/app/common/ulti/gui/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateUltiService } from 'src/app/common/ulti/translateService/translate-ulti.service';

@Component({
  selector: 'app-search-menus',
  templateUrl: './search-menus.component.html',
  styleUrls: ['./search-menus.component.scss'],
  providers: [{ provide: BsDatepickerConfig, useFactory: getDatepickerConfig }]
})
export class SearchMenusComponent implements OnInit {

  bsModalRef: BsModalRef;

  loading:boolean=false;

  totalRecord:number = 0;
  size:number = APP_CONSTANT.PAGINATION.SIZE;
  page:number = 1;
  maxPageView:number = 5;

  lstStatus:any = [];
  lstLevel:any = [];

  searchForm:FormGroup;
  lstRecord:any = [];

  constructor(
    private modalService: BsModalService,
    private api : ApiService,
    private toast : ToastUltiService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    // this.translate.get(['common.toast.notification', 'common.toast.sysBusy'])
    // .subscribe(translations => {
    //   console.log(translations['common.toast.notification']);
    //   console.log(translations['common.toast.sysBusy']);
    // });
    // console.log(this.trans.getTranslations('common.toast.notification'));
    // console.log(this.translate.get('common.toast.notification'));
    // this.translate.get('common.toast.notification').subscribe(res => {
    //   console.log(res);
    // });

    this.lstStatus = [
      {id:0,name:'Không hoạt động'},
      {id:1,name:'Hoạt động'}
    ];
    this.lstLevel = [
      {id:1,name:'Level 1'},
      {id:2,name:'Level 2'}
    ];
    this.buildForm();
    this.search(null);
  }

  buildForm(){
    this.searchForm = this.fb.group({
      code:[null],
      name:[null],
      status:[''],
      dateCreatedTo:[null],
      dateCreatedFrom:[null],
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
      menuLevel:1,
      status:this.searchForm.controls.status.value != '' ? this.searchForm.controls.status.value : null,
      dateCreatedTo:this.searchForm.controls.dateCreatedTo.value,
      dateCreatedFrom:this.searchForm.controls.dateCreatedFrom.value,
      page:this.page-1,
      size:this.size
    }
    
    let params = {
      searchDTO: JSON.stringify(searchDTO)
    }

    this.api.get(API_URL_CONSTANT.MENU.SEARCH,params).subscribe(data =>{
      
      this.lstRecord = data.list;
      this.totalRecord = data.count;
      this.loading = false;
    },error =>{
      this.loading = false;
    });
  }

  searchSubmenu(parent:any,event: any):void{
    debugger;

    this.loading = true;
    
    parent.submenu = {
      page:1,
      size:APP_CONSTANT.PAGINATION.SIZE,
      maxPageView:3,
      totalRecord:0,
      lstMenus:[]
    }

    if(event != null)
      parent.submenu.page = event.page;
    else
      parent.submenu.page = 1;

    var params = {
      menuId:parent.id,
      page:parent.submenu.page-1,
      size:parent.submenu.size
    }

    this.api.get(API_URL_CONSTANT.MENU.SEARCH_SUBMENU,params).subscribe(data =>{
      parent.submenu.lstMenus = data.list;
      parent.submenu.totalRecord = data.count;
      this.loading = false;
    },error =>{
      this.loading = false;
    });

  }

  openSubmenu(item:any):void{
    //get lst submenu
    item.tblSub = !item.tblSub;
    this.searchSubmenu(item,null);
  }

  openDialog(item:any,parent:any,isSubmenu:boolean):void{

    let dialogTitile:string;
    if(!isSubmenu){
      dialogTitile = item === null ? 'Thêm mới thông tin menu' : 'Cập nhập thông tin cho menu <b>'+item.name+'</b>'
    }else{
      dialogTitile = item === null ? 'Thêm mới thông tin submenu cho menu cha <b>'+parent.name+'</b>' : 'Cập nhập thông tin cho submenu <b>'+item.name+'</b> của menu cha <b>'+parent.name+'</b>'
    }

    const initialState = {
      title: dialogTitile,
      item:item,
      isSubmenuParent:isSubmenu,
      parent:parent
    };
    this.bsModalRef = this.modalService.show(GrantMenusComponent, {initialState,class: 'modal-lg'});
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.search(null);
      }
    });
  }

  confirmDeleted(item:any):void{
    //open confirm dialog
    const initialState = {
      title: 'Xác nhận xóa',
      message:'Bạn có chắc chắn muốn xóa bản ghi <b>'+item.name+'</b> khỏi CSDL của hệ thống?'
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, {initialState});
    this.bsModalRef.content.event.subscribe(result => {
      debugger;
      if (result == 'OK') {
        this.deleted(item.id,item.name);
      }
    });
  }

  deleted(menuId:number,menuName:string):void{
    this.loading = true;
    this.api.post(API_URL_CONSTANT.MENU.DELETED,{},{menuId:menuId}).subscribe(data=>{
      this.toast.showSuccess('Thông báo','Xóa thành công menu <b>'+menuName+'</b> khỏi CSDL của hệ thống.');
      this.search(null);
    },error=>{
      this.toast.showWarning('Thông báo','Hệ thống đang bận. Xin vui lòng thửu lại sau.');
      this.loading = false;
    });
  }

}
