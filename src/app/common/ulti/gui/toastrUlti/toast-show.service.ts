import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastUltiService } from '../../toast/toast-ulti.service';

@Injectable({
  providedIn: 'root'
})
export class ToastShowService {

  constructor(
    private translate: TranslateService,
    private toast: ToastUltiService
  ) { }

  callApiError(){
    let title:string;
    let msg:string;
    // this.toast.showWarning();
  }

  validInput():void{
    this.toast.showInfo('Thông báo','Vui lòng kiểm tra lại dữ liệu đầu vào');
  }

}
