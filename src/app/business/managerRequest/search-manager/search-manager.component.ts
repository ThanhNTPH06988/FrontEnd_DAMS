import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BsModalService } from "ngx-bootstrap";
import { ApiService } from "src/app/common/api/api.service";
import { API_URL_CONSTANT } from "src/app/common/constant/apiUrlConstant";
import { APP_CONSTANT } from "src/app/common/constant/appConstant";
import { ToastUltiService } from "src/app/common/ulti/toast/toast-ulti.service";

@Component({
  selector: "app-search-manager",
  templateUrl: "./search-manager.component.html",
  styleUrls: ["./search-manager.component.scss"]
})
export class SearchManagerComponent implements OnInit {
  loading: boolean = false;
  totalRecord: number = 0;
  size: number = APP_CONSTANT.PAGINATION.SIZE5;
  page: number = 1;
  maxPageView: number = 5;

  searchForm: FormGroup;
  lstBranch: any = [];
  lstAddress: any = [];
  lstStatus: any = [];
  lstRecord: any = [];

  constructor(
    private modalService: BsModalService,
    private api: ApiService,
    private toast: ToastUltiService,
    private fb: FormBuilder
  ) {
    api.get(API_URL_CONSTANT.REQUEST.GET_BRANCH, {}).subscribe(
      data => {
        this.lstBranch = data;
      },
      error => {
        this.toast.showError("Lỗi", "Không lấy được danh sách chi nhánh.");
      }
    );
  }

  ngOnInit() {
    this.lstStatus = [
      { id: 0, name: 'Mới tạo' },
      { id: 1, name: 'Chờ nhân sự xác nhận tham gia' },
      { id: 2, name: 'Sẵn sàng tiếp quỹ' },
      { id: 3, name: 'Trong quá trình tiếp quỹ' },
      { id: 4, name: 'Hoàn thành tiếp quỹ' }
    ];
    this.buildForm();
    this.searchData(null);
    this.getProvince();
  }

  buildForm() {
    this.searchForm = this.fb.group({
      codeRoad: [''],
      codeRequest: [''],
      branch: [''],
      address: [''],
      dateFrom: [''],
      dateTo: [''],
      statusId: ['']
    });
  }

  getProvince() {
    this.lstAddress = [];
    this.api.get(API_URL_CONSTANT.ADDR.ADDR_PROVINCE, {}).subscribe(data => {
      this.lstAddress = data;
    }, error => {
      this.toast.showError("Lỗi", "Không lấy được dữ liệu tỉnh thành.");
    });
  }

  searchData(event: any) : void {
    if (event != null) {
      this.page = event.page;
    } else {
      this.page = 1;
    }
    this.loading = true;

    let searchDTO = {
      codeRoad: this.searchForm.controls.codeRoad.value,
      codeRequest: this.searchForm.controls.codeRequest.value,
      branch: this.searchForm.controls.branch.value != '' ? this.searchForm.controls.branch.value : null,
      address: this.searchForm.controls.address.value != '' ? this.searchForm.controls.address.value : null,
      dateFrom: this.searchForm.controls.dateFrom.value != '' ? this.searchForm.controls.dateFrom.value : null,
      dateTo: this.searchForm.controls.dateTo.value != '' ? this.searchForm.controls.dateTo.value : null,
      statusId: this.searchForm.controls.statusId.value != '' ? this.searchForm.controls.statusId.value : null,
      page: this.page - 1,
      size: this.size
    }

    let params = {
      searchDTO: JSON.stringify(searchDTO)
    }

    this.api.get(API_URL_CONSTANT.MANAGER_REQUEST.SEARCH, params).subscribe(data => {
      this.lstRecord = data.list;
      this.totalRecord = data.count;
      this.loading = false;
    }, error => {
      this.toast.showWarning("Thông báo", "Hệ thống đang bận. Vui lòng thực hiện lại sau.");
      this.loading = false;
    })
  }
}
