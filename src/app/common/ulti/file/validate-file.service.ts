import { Injectable } from '@angular/core';
import { ToastUltiService } from '../toast/toast-ulti.service';

@Injectable({
  providedIn: 'root'
})
export class ValidateFileService {

  constructor(
    private toast : ToastUltiService
  ) { }

  validateFileExtensions(fileFormat:any,fileName: string) {
	//filename.split('.').pop();
	//filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
	let fileExtention = (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName)[0] : undefined;	
    let isvalid = fileFormat.includes(fileExtention);
    if (!isvalid) {
      let msg:string = 'File '+fileName+' không đúng định dạng. Vui lòng chỉ chọn các file có định dạng sau.\n <b>'+fileFormat.toString()+'</b>';
      this.toast.showWarning('Thông báo',msg);
      return false;
    }
    return true;
  }
}
