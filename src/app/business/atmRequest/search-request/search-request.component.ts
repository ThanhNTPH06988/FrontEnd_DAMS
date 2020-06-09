import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { APP_CONSTANT } from 'src/app/common/constant/appConstant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { log } from 'util';
import { DetailRequestComponent } from '../detail-request/detail-request.component';
import { HistoryRequestComponent } from '../history-request/history-request.component';

@Component({
  selector: 'app-search-request',
  templateUrl: './search-request.component.html',
  styleUrls: ['./search-request.component.scss']
})
export class SearchRequestComponent implements OnInit {

  bsModalRef: BsModalRef;

  loading: boolean = false;

  totalRecord: number = 0;
  size: number = APP_CONSTANT.PAGINATION.SIZE5;
  page: number = 1;
  maxPageView: number = 5;

  searchForm: FormGroup;
  lstBranch: any = [];
  lstStatus: any = [];
  lstRecord: any = [];
  lstProvince: any =[];
  lstDistrict:any = [];

  // isDisabledCheck: boolean = false;

  constructor(
    private modalService: BsModalService,
    private api: ApiService,
    private toast: ToastUltiService,
    private fb: FormBuilder
  ) {
    api.get(API_URL_CONSTANT.REQUEST.GET_BRANCH, {}).subscribe(data => {
      this.lstBranch = data;
    }, error => {
      this.toast.showError("Lỗi", "Không lấy được danh sách chi nhánh.");
    })
  }

  ngOnInit() {
    this.lstStatus = [
      { id: 2, name: 'Từ chối' },
      { id: 1, name: 'Đã tiếp nhận' },
      { id: 0, name: 'Chờ tiếp nhận' }
    ];
    this.buildForm();
    this.searchData(null);
    this.getProvince();
  }
  getProvince() {
    this.lstProvince = [];
    this.api.get(API_URL_CONSTANT.ADDR.ADDR_PROVINCE, {}).subscribe(data => {
      this.lstProvince = data;
    }, error => {
      this.toast.showError("Lỗi", "Không lấy được dữ liệu.");
    });
  }
  getDistrict() {
    this.loading = true;

    //clear dist and war
    this.lstDistrict = [];
    this.searchForm.controls.districtCode.setValue('');

    let params = {
      provinceCode:this.searchForm.controls.provinceCode.value
    };
    this.api.get(API_URL_CONSTANT.ADDR.ADDR_DISTRICT, params).subscribe(data => {
      this.lstDistrict = data;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.toast.showError("Lỗi", "Không lấy được dữ liệu.");
    });
  }
  
 

  buildForm() {
    this.searchForm = this.fb.group({
      code: [''],
      branchId: [''],
      dateFrom: [''],
      dateTo: [''],
      statusId: [''],
      provinceCode:[''],
      districtCode:[''],
    })
  }

  searchData(event: any):void {
    if (event != null) {
      this.page = event.page;
    } else {
      this.page = 1;
    }
    this.loading = true;
    let searchDTO = {
      code: this.searchForm.controls.code.value,
      branchId: this.searchForm.controls.branchId.value,
      dateFrom: this.searchForm.controls.dateFrom.value != '' ? this.searchForm.controls.dateFrom.value : null,
      dateTo: this.searchForm.controls.dateTo.value != '' ? this.searchForm.controls.dateTo.value : null,
      statusId: this.searchForm.controls.statusId.value != '' ? this.searchForm.controls.statusId.value : null,
      provinceCode:this.searchForm.controls.provinceCode.value != '' ? this.searchForm.controls.provinceCode.value : null,
      districtCode: this.searchForm.controls.districtCode.value != '' ?this.searchForm.controls.districtCode.value : null,
      page: this.page - 1,
      size: this.size
    }

    let params = {
      searchDTO: JSON.stringify(searchDTO)
    }

    this.api.get(API_URL_CONSTANT.REQUEST.SEARCH, params).subscribe(data => {
      this.lstRecord = data.list;
      this.totalRecord = data.count;
      this.loading = false;
      console.log(data);
    }, error => {
      this.toast.showWarning("Thông báo", "Hệ thống đang bận. Vui lòng thực hiện lại sau.");
      this.loading = false;
    })
    
  }

  openViewDetail(item: any) {
    const initialState = {
      title: 'Xem chi tiết yêu cầu',
      item: item
    };
    this.bsModalRef = this.modalService.show(DetailRequestComponent, { initialState, class: 'modal-lg' });
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.searchData(null);
      }
    });
  }

  openHistory(item: any) {
    const initialState = {
      title: 'Lịch sử xử lý yêu cầu',
      item: item
    };
    this.bsModalRef = this.modalService.show(HistoryRequestComponent, { initialState, class: 'modal-lg' });
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.searchData(null);
      }
    });
  }

}
