import { Component, EventEmitter, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap";
import { ApiService } from "src/app/common/api/api.service";
import { API_URL_CONSTANT } from "src/app/common/constant/apiUrlConstant";
import { ToastUltiService } from "src/app/common/ulti/toast/toast-ulti.service";
import { APP_CONSTANT } from "src/app/common/constant/appConstant";

@Component({
  selector: "app-select-manager",
  templateUrl: "./select-manager.component.html",
  styleUrls: ["./select-manager.component.scss"]
})
export class SelectManagerComponent implements OnInit {
  @Input() item: any;
  event: EventEmitter<any> = new EventEmitter();
  loading: boolean = false;
  branchItem: any;

  lstStaff: any = [];

  searchForm: FormGroup;
  totalRecord: number = 0;
  size: number = APP_CONSTANT.PAGINATION.SIZE3;
  page: number = 1;
  maxPageView: number = APP_CONSTANT.PAGINATION.SIZE3;

  resultForm: FormGroup;
  submitted: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private api: ApiService,
    private toast: ToastUltiService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.branchItem = this.item;
    this.buildForm();
    this.searchStaff(null);
  }

  get f() {
    return this.resultForm.controls;
  }

  buildForm() {
    this.searchForm = this.fb.group({
      code: [""],
      name: [""],
      idcard: [""]
    });
    this.resultForm = this.fb.group({
      staffCode: ["", [Validators.required]]
    });
  }

  bindingData() {
    this.resultForm.controls.staffCode.setValue(this.branchItem.staffCode);
  }

  // lay danh sach nhan vien cua chi nhanh
  searchStaff(event: any) {
    this.loading = true;
    if (event != null) this.page = event.page;
    else this.page = 1;

    let searchDTO = {
      branchId: this.branchItem.id,
      code: this.searchForm.controls.code.value,
      name: this.searchForm.controls.name.value,
      idcard: this.searchForm.controls.idcard.value,
      positionId: null,
      status: 1,
      page: this.page - 1,
      size: this.size
    };

    let params = {
      searchDTO: JSON.stringify(searchDTO)
    };

    this.api.get(API_URL_CONSTANT.STAFF.SEARCH, params).subscribe(
      data => {
        this.lstStaff = data.list;
        this.totalRecord = data.count;
        // binding data selected
        if (this.branchItem.staffId != null) {
          this.bindingData();
        }
        this.loading = false;
      },
      error => {
        this.toast.showError("Lỗi", "Không lấy được dữ liệu nhân viên");
        this.loading = false;
      }
    );
  }

  // lưu cán bộ chi nhánh
  save() {
    debugger;
    this.submitted = true;
    if (this.resultForm.invalid) {
      this.toast.showInfo("Thông báo", "Vui lòng chọn cán bộ.");
      // alert("Vui lòng chọn cán bộ.");
      return;
    }

    this.loading = true;
    let updateStaffId = {
      staffCode: this.resultForm.controls.staffCode.value,
      branchId: this.branchItem.id
    };

    let message =
      this.branchItem.staffId == null
        ? "Thêm mới cán bộ phụ trách cho chi nhánh <b>" +
          this.branchItem.name +
          "</b> thành công."
        : "Cập nhật cán bộ phụ trách cho chi nhánh <b>" +
          this.branchItem.name +
          "</b> thành công.";

    this.api
      .post(API_URL_CONSTANT.BRANCH.UPDATE_STAFF_ID, {}, updateStaffId)
      .subscribe(
        data => {
          this.toast.showSuccess("Thông báo", message);
          this.loading = false;
          this.event.emit("OK");
          this.bsModalRef.hide();
        },
        error => {
          this.toast.showError(
            "Lỗi",
            "Cập nhật cán bộ phụ trách chi nhánh không thành công."
          );
          this.loading = false;
        }
      );
  }

  // đóng popup
  close() {
    this.bsModalRef.hide();
  }
}
