import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../common/api/api.service';
import { HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/grant/authentication.service';
import { ToastUltiService } from '../common/ulti/toast/toast-ulti.service';
import { ToastShowService } from '../common/ulti/gui/toastrUlti/toast-show.service';
import { API_URL_CONSTANT } from '../common/constant/apiUrlConstant';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userForm: FormGroup;
  forgotPassForm: FormGroup;
  submitted:boolean = false;
  subForgot:boolean = false;

  loading:boolean = false;

  constructor(
    private router: Router,
    private apiService : ApiService,
    private fb: FormBuilder,
    private authService:AuthenticationService,
    private toast : ToastUltiService,
    private toastValid: ToastShowService,
    private translate: TranslateService
  ) {
    if (!this.authService.isTokenExpired()) {
      this.router.navigate(['home/dashboard']);
      return;
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.fb.group({
      'username': ['', [
          Validators.required
        ]
      ],
      'password': ['', [
          Validators.required
        ]
      ],
    });

    this.forgotPassForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
    ],
    });
  }

  get f(){return this.userForm.controls}
  get fg(){return this.forgotPassForm.controls}

  login(){

    
    this.submitted = true;
    if (this.userForm.invalid) {
      this.toastValid.validInput();
      return;
    }

    this.loading = true;
    let username = this.userForm.controls.username.value;
    let password = this.userForm.controls.password.value;

    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', 'password');

      this.apiService.login(body.toString()).subscribe(data => {
        this.authService.authenticate(JSON.stringify(data),username,password);
        this.loading = false;
      },error => {
        this.toast.showInfo('Thông báo','Tên đăng nhập hoặc mật khẩu không hợp lệ. Vui lòng kiểm tra lại thông tin đăng nhập');
        this.loading = false;
      });

  }

  sendForgotPass():void{
    this.subForgot = true;
    if (this.forgotPassForm.invalid) {
      this.toastValid.validInput();
      return;
    }
    this.loading = true;
    let email = this.forgotPassForm.controls.email.value;

    this.apiService.post(API_URL_CONSTANT.USERS.FOR_GOT_PASS,{},{email:email}).subscribe(data => {

    },error => {
      
    });

    
  }

  forgotPass():void{
    $("#loginform").slideUp();
    $("#recoverform").fadeIn();
  }

  backLogin():void{
    $("#loginform").fadeIn();
    $("#recoverform").slideUp();
  }

}
