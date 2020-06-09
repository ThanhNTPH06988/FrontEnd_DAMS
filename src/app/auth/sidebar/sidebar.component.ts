import { Component, OnInit } from '@angular/core';
import { IContextService } from 'src/app/common/ulti/iContext/icontext.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { AuthenticationService } from '../grant/authentication.service';
import { ApiService } from 'src/app/common/api/api.service';
import { Router } from '@angular/router';
declare var $: any;


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  lstMenu:any = [];
  loading:boolean = false;

  constructor(
    private iContext : IContextService,
    private auth : AuthenticationService,
    private api: ApiService,
    private router : Router
  ) { }

  ngOnInit() {    
    this.getMenuBuRoles();
  }


  async expanMenu(menuIndex:number,menuObj:any){

    let menu = $("#menu-"+menuIndex);
    if(menu.hasClass("active")){
      $("#menu-"+menuIndex).removeClass("active");
      if(menuObj.isSubmenu === 1)
        $("#submenu-"+menuIndex).removeClass("in");
    }else{
      $("#menu-"+menuIndex).addClass("active");
      if(menuObj.isSubmenu === 1)
        $("#submenu-"+menuIndex).addClass("in");
    }

    if(menuObj.isSubmenu === 0){
      this.router.navigate([menuObj.urlPath]);
    }
    
  }

  async getMenuBuRoles(){
    this.loading = true;
    let params = {
      lstRoles: this.auth.getRoleForGrant()
    }
    this.api.get(API_URL_CONSTANT.MENU.FOR_ROLE,params).subscribe(data => {
      this.lstMenu = data;
      this.loading = false;
    },error => {
      this.loading = false;
    });
  }

}
