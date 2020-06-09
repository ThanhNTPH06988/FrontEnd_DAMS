import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateUltiService {

  constructor(private translate: TranslateService) { }

  // getLang(msgKey:string):string{
  //   return this.translate.instant('common.toast.notification');
  // }

  // getLangUseParam(msgKey:string,paramName:string,paramValue:string):string{
  //   return this.translate.instant(msgKey, { paramName: paramValue });
  // }

  // getLang(msgKey:string,rsLang:string):string{
    
  // }

  getTranslations(keys: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.translate.get(keys).subscribe(success => {
        resolve(success);
      });
    });
  }

  
}
