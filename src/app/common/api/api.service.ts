import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { API_URL_CONSTANT } from '../constant/apiUrlConstant';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  errorMessage(err : any){
    
  }

  isTokenExpired():boolean{
    let token = sessionStorage.getItem("access_token");
    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);
    if (decoded.exp === undefined) return null;

    const date = new Date(0); 
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  login(loginPayload:any){
    const headers = {
      'Authorization': 'Basic ' + btoa('client_id:client_secret'),
      'Content-type': 'application/x-www-form-urlencoded'
    }
    return this.http.post(API_URL_CONSTANT.API_ROOT + 'oauth/token', loginPayload, {headers});
  }

  get(strUrl:string,param:any):Observable<any>{
    let headers = new HttpHeaders({
      'Authorization':'Bearer '+sessionStorage.getItem("access_token"),
      'Accept':'application/json',
      'Content-Type':'application/json'
    });
    
    if (!this.isTokenExpired()) {
      return this.http.get(API_URL_CONSTANT.API_ROOT+strUrl,{headers:headers,params:param,responseType: 'json'});
    }else{
      // this.toast.showError('Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại','');
      this.router.navigate(['/login']);
    }
  }

  post(strUrl:string,paramBody:any,param:any):Observable<any>{
    let headers = new HttpHeaders({
      'Authorization':'Bearer '+sessionStorage.getItem("access_token"),
      'Accept':'application/json',
      'Content-Type':'application/json'
    });

    if (!this.isTokenExpired()) {
      return this.http.post(API_URL_CONSTANT.API_ROOT+strUrl,paramBody,{headers:headers,params:param,responseType: 'json'});
    }else{
      // this.toast.showError('Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại','');
      this.router.navigate(['/login']);
    }    
  }

  delete(strUrl: string): Observable<any> {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    if (!this.isTokenExpired()) {
      return this.http.delete(API_URL_CONSTANT.API_ROOT + strUrl, {headers});
    } else {
      // this.toast.showError('Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại','');
      this.router.navigate(['/login']);
    }
  }

  put(strUrl: string): Observable<any> {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    if (!this.isTokenExpired()) {
      return this.http.put(API_URL_CONSTANT.API_ROOT + strUrl, null, { headers });
    } else {
      // this.toast.showError('Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại','');
      this.router.navigate(['/login']);
    }
  }

  uploadFile(files:any) : Observable<any>{
    if (!this.isTokenExpired()) {
      return this.http.post(API_URL_CONSTANT.API_ROOT+API_URL_CONSTANT.API_FILE.UPLOADS,files);
    }else{
      // this.toast.showError('Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại','');
      this.router.navigate(['/login']);
    }
  }

  uploadOneFile(file:any) : Observable<any>{
    if (!this.isTokenExpired()) {
      return this.http.post(API_URL_CONSTANT.API_ROOT+API_URL_CONSTANT.API_FILE.UPLOAD, file);
    }else{
      // this.toast.showError('Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại','');
      this.router.navigate(['/login']);
    }
  }

  postFile(url:string,files:any) : Observable<any>{
    if (!this.isTokenExpired()) {
      return this.http.post(API_URL_CONSTANT.API_ROOT+url,files);
    }else{
      // this.toast.showError('Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại','');
      this.router.navigate(['/login']);
    }
  }

}
