import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[capitalize]'
})
export class CapitalizeDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('blur', ['$event']) onInputChange(event) {
    // const initalValue = this._el.nativeElement.value;
    // this._el.nativeElement.value = initalValue.toUpperCase();
    // if ( initalValue !== this._el.nativeElement.value) {
    //   event.stopPropagation();
    // }
    // this._el.nativeElement.value = this._el.nativeElement.value.toUpperCase();
  }

}
