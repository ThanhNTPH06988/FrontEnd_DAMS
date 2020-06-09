import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { IContextService } from 'src/app/common/ulti/iContext/icontext.service';
import { ApiService } from 'src/app/common/api/api.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';

@Component({
  selector: 'app-history-request',
  templateUrl: './history-request.component.html',
  styleUrls: ['./history-request.component.scss']
})
export class HistoryRequestComponent implements OnInit {

  @Input() item: any;
  lstRecordHis: any = [];
  lstRecord: any = [];
  event: EventEmitter<any> = new EventEmitter();
  historyItem: any;
  loading: boolean = false;
  

  constructor(
    private bsModalRef: BsModalRef,
    private api: ApiService,
    private toast: ToastUltiService
  ) { }

  ngOnInit() {
    this.historyItem = this.item;
    this.getHistoryRequest();
    this.getDetailAtm();
    
  }
  getDetailAtm() {
    debugger;
    let param = {
      branchCode : this.historyItem.branchCode
    }
    this.api.get(API_URL_CONSTANT.REQUEST.GET_ATM_BY_BRANCH_CODE, param).subscribe(data => {
      this.lstRecord = data;
      
    }, error => {
      this.toast.showError('Lỗi', 'Không lấy được danh sách ATM.');
      console.log(error);
    })
  }

  getHistoryRequest(){
    debugger;
    this.loading = true;
    let param = {
      requestId: this.historyItem.id
    }

    this.api.get(API_URL_CONSTANT.HIS_REQUEST.GET_HIS, param).subscribe(data => {
      this.lstRecordHis = data;
      console.log(this.lstRecordHis);
      this.loading = false;
    }, error => {
      this.toast.showError('Lỗi', 'Không lấy được dữ liệu lịch sử xử lý yêu cầu.');
      this.loading = false;
    })
  }

  close() {
    this.bsModalRef.hide();
  }

}
