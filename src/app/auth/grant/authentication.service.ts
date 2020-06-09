import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/common/api/api.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import * as jwt_decode from 'jwt-decode';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private router: Router,
    private api: ApiService
  ) { }

  authenticate(token: string,username: string,password: string){
    let tk = JSON.parse(token);
    sessionStorage.setItem("access_token",tk.access_token);
    sessionStorage.setItem("token",token);

    //get info userlogin
    //call api
    // $.getJSON("https://api.ipify.org?format=json", function (data) {
    //     console.log(data.ip);
    //     console.log(data);
    // })
    let strParam = {
      username:username,
      password:password
    }

    this.api.get(API_URL_CONSTANT.USERS.INFO,strParam).subscribe(data => {
      sessionStorage.setItem("userLogin",JSON.stringify(data.data));
      this.router.navigate(['home/dashboard']);
    },error=>{
      
    })
  }

  isTokenExpired(token?: string): boolean {
    if(!token) token = this.getToken();
    if(!token) return true;

    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  getToken(): string {
    return sessionStorage.getItem("access_token");
  }

  getTokenExpirationDate(token: string): Date {
    
    let decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0); 
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  getRoleForGrant():[]{
    let token = sessionStorage.getItem("access_token");
    const decoded = jwt_decode(token);
    return decoded.authorities;
  }


}
