import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[splitter]'
})
export class StringSplitterDirective {

  constructor(private _el: ElementRef) {
    // debugger;
    // let strValue = this._el.nativeElement.value;
    // if(strValue === undefined || strValue === "")
    //   return;
    // if(strValue.length === 40){
    //   this._el.nativeElement.value.length = strValue.substring(0,40) + '....';
    // }
  }
  

}
