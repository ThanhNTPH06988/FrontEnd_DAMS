import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  title: string;
  message:string;
  event: EventEmitter<any>=new EventEmitter();

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
  }

  onConfirm(): void {
    this.event.emit('OK');
    this.bsModalRef.hide();
  }

  onCancel(): void {
    this.bsModalRef.hide();
  }

  onClose():void{
    this.bsModalRef.hide();
  }
 
}
