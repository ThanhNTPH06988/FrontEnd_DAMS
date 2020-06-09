import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { APP_CONSTANT } from 'src/app/common/constant/appConstant';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  private userLogin:any;
  private avatarUrl:string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.userLogin = JSON.parse(sessionStorage.getItem("userLogin"));
    let urlAvatar = this.userLogin.avatarGuiId != null ? this.userLogin.avatarGuiId : APP_CONSTANT.DEFAULT.AVATAR
    this.avatarUrl = API_URL_CONSTANT.API_ROOT + API_URL_CONSTANT.API_FILE.DOWNLOD+urlAvatar;
  }

  logout():void{
    if(typeof(Storage) !== "undefined"){
      sessionStorage.clear();

      this.router.navigate(['login']);
    }else{
      //trinh duyet cu ban qua cu. hay nang cao trinh duyet ngay!
    }
  }
  
}
