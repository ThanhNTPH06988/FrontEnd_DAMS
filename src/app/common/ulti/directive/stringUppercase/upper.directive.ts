import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[upper]'
})
export class UpperDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    // const initalValue = this._el.nativeElement.value;
    // this._el.nativeElement.value = initalValue.toUpperCase();
    // if ( initalValue !== this._el.nativeElement.value) {
    //   event.stopPropagation();
    // }
    this._el.nativeElement.value = this._el.nativeElement.value.toUpperCase();
  }

}
