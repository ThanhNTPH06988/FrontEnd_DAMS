import { Injectable } from '@angular/core';
import { AuthenticationService } from 'src/app/auth/grant/authentication.service';
import { ApiService } from '../../api/api.service';
import { API_URL_CONSTANT } from '../../constant/apiUrlConstant';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class IContextService {

  userLogin:any;
  lstMenu:any = [];

  constructor(
    private auth : AuthenticationService,
    private api: ApiService
  ) { 
    this.userLogin = JSON.parse(sessionStorage.getItem("userLogin"));
    // this.getMenuBuRoles();
  }

  async getMenuBuRoles(){
    debugger;
    //get role for grant
    let params = {
      lstRoles: this.auth.getRoleForGrant()
    }
    this.api.get(API_URL_CONSTANT.MENU.FOR_ROLE,params).subscribe(data => {
      this.lstMenu = data;
    },error => {

    });
  }
}
