import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ApiService } from 'src/app/common/api/api.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';

@Component({
  selector: 'app-detail-request',
  templateUrl: './detail-request.component.html',
  styleUrls: ['./detail-request.component.scss']
})
export class DetailRequestComponent implements OnInit {

  event: EventEmitter<any> = new EventEmitter();
  @Input() item: any;
  loading: boolean = false;
  detailItem: any;
  lstRecord: any = [];

  constructor(
    private bsModalRef: BsModalRef,
    private api: ApiService,
    private toast: ToastUltiService
  ) { }

  ngOnInit() {
    this.detailItem = this.item;
    this.getDetailAtm();
  }

  getDetailAtm() {
    debugger;
    let param = {
      branchCode : this.detailItem.branchCode
    }
    this.api.get(API_URL_CONSTANT.REQUEST.GET_ATM_BY_BRANCH_CODE, param).subscribe(data => {
      this.lstRecord = data;
      console.log(this.lstRecord);
    }, error => {
      this.toast.showError('Lỗi', 'Không lấy được danh sách ATM.');
      console.log(error);
    })
  }

  close(){
    this.bsModalRef.hide();
  }

}
