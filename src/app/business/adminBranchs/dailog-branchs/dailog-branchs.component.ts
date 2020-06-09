import { Component, EventEmitter, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ApiService } from "src/app/common/api/api.service";
import { API_URL_CONSTANT } from "src/app/common/constant/apiUrlConstant";
import { ToastUltiService } from "src/app/common/ulti/toast/toast-ulti.service";
import * as _ from 'lodash';

@Component({
  selector: "app-dailog-branchs",
  templateUrl: "./dailog-branchs.component.html",
  styleUrls: ["./dailog-branchs.component.scss"]
})
export class DailogBranchsComponent implements OnInit {
  @Input() item: any;
  branchForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  lstProvince: any = [];
  lstDistrict: any = [];
  lstWard: any = [];
  branchItem: any;
  isExitCode: boolean = false;
  // lstBranch: any = [];
  // lstStaff: any = [];

  loading: boolean = false;
  submitted: boolean = false;
  constructor(
    public bsModalRef: BsModalRef,
    private api: ApiService,
    private toast: ToastUltiService,
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {
    // lay danh sach cac chi nhanh chua bi xoa
    // api.get(API_URL_CONSTANT.BRANCH.GET_ALL, {}).subscribe(data => {
    //   this.lstBranch = data.list;
    //   console.log(this.lstBranch);
    // }, error => {
    //   toast.showError('Lỗi', 'Không lấy được danh sách kho tiền.');
    // });
  }

  ngOnInit() {
    this.branchItem = this.item;
    this.buildForm();
    // binding data when edit branch
    if (this.branchItem != null) {
      this.bindingDataEdit();
    }
    this.getProvince();
    // this.getListStaff();
  }

  getProvince() {
    this.lstProvince = [];
    this.api.get(API_URL_CONSTANT.ADDR.ADDR_PROVINCE, {}).subscribe(
      data => {
        this.lstProvince = data;
      },
      error => {
        this.toast.showError("Lỗi", "Không lấy được dữ liệu.");
      }
    );
  }

  getDistrict() {
    this.loading = true;
    this.lstDistrict = [];
    this.lstWard = [];
    this.branchForm.controls.districtCode.setValue("");
    this.branchForm.controls.addrId.setValue("");

    let params = {
      provinceCode: this.branchForm.controls.provinceCode.value
    };
    this.api.get(API_URL_CONSTANT.ADDR.ADDR_DISTRICT, params).subscribe(
      data => {
        this.lstDistrict = data;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.toast.showError("Lỗi", "Không lấy được dữ liệu.");
      }
    );
  }

  getWard() {
    this.loading = true;
    this.lstWard = [];
    this.branchForm.controls.addrId.setValue("");
    let params = {
      districtCode: this.branchForm.controls.districtCode.value
    };
    this.api.get(API_URL_CONSTANT.ADDR.ADDR_WARD, params).subscribe(
      data => {
        this.lstWard = data;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.toast.showError("Lỗi", "Không lấy được dữ liệu.");
      }
    );
  }

  get f() {
    return this.branchForm.controls;
  }

  bindingDataEdit() {
    this.branchForm.controls.provinceCode.setValue(this.item.addr.provinceCode);
    this.getDistrict();
    this.branchForm.controls.districtCode.setValue(this.item.addr.districtCode);
    this.getWard();
    this.branchForm.controls.addrId.setValue(this.item.addrId);
    this.branchForm.controls.code.setValue(this.branchItem.code);
    this.branchForm.controls.name.setValue(this.branchItem.name);
    this.branchForm.controls.addrDetail.setValue(this.branchItem.addrDetail);
    // this.branchForm.controls.staffCode.setValue(this.branchItem.staffCode);
  }

  buildForm() {
    this.branchForm = this.fb.group({
      code: ["", [Validators.required, Validators.maxLength(50)]],
      name: ["", [Validators.required, Validators.maxLength(100)]],
      provinceCode: ["", [Validators.required]],
      districtCode: ["", [Validators.required]],
      addrId: ["", [Validators.required]],
      addrDetail: ["", [Validators.required, Validators.maxLength(100)]],
      // staffCode: ["", [Validators.required]]
    });
  }

  // existCode() {
  //   let flag = false;
  //   let codeTemp = this.branchForm.controls.code.value;
  //   let lstTemp = _.filter(this.lstBranch, (obj) => {
  //     return obj.code === codeTemp;
  //   })
  //   if (lstTemp.length > 0) {
  //     flag = true;
  //     this.isExitCode = true;
  //   } else {
  //     this.isExitCode = false;
  //   }
  //   return flag;
  // }

  // lưu thông tin chi nhánh
  save() {
    this.submitted = true;
    if (this.branchForm.invalid) {
      this.toast.showInfo("Thông báo", "Kiểm tra lại dữ liệu đầu vào");
      return;
    }

    this.loading = true;
    let branchInfo = {
      id: this.item != null ? this.item.id : null,
      code: this.branchForm.controls.code.value,
      name: this.branchForm.controls.name.value,
      addrDetail: this.branchForm.controls.addrDetail.value,
      addrId: this.branchForm.controls.addrId.value,
      status: this.item != null ? this.item.status : 1,
      userId: this.item != null ? this.item.userId : null,
      dateCreated: this.item != null ? this.item.dateCreated : new Date(),
      deleted: this.item != null ? this.item.deleted : 'N',
      latUpdate: this.item != null ? new Date() : null,
      userUpdateId: this.item != null ? this.item.userUpdateId : null,
      rank: this.item != null ? this.item.rank : null,
      parentId: this.item != null ? this.item.parentId : null,
      staffId: this.item != null ? this.item.staffId : null,
      // staffCode: this.branchForm.controls.staffCode.value,
      // lstStaff: this.lstStaff
    };

    let msgInfo =
      this.branchItem == null
        ? "Thêm mới thông tin chi nhánh <b>" +
          branchInfo.name +
          "</b> thành công."
        : "Sửa thông tin chi nhánh <b>" + branchInfo.name + "</b> thành công.";

    this.api
      .post(API_URL_CONSTANT.BRANCH.SAVE_OR_UPDATE, branchInfo, {})
      .subscribe(
        data => {
          if (data === null) {
            this.toast.showInfo(
              "Thông báo",
              "Mã chi nhánh đã tồn tại. Vui lòng nhập vào mã chi nhánh khác"
            );
            // this.existCode();
            this.isExitCode = true;
            this.loading = false;
            return;
          }

          this.toast.showSuccess("Thông báo", msgInfo);
          this.loading = false;
          this.event.emit("OK");
          this.bsModalRef.hide();
        },
        error => {
          this.toast.showError(
            "Lỗi",
            "Cập nhật thông tin chi nhánh không thành công"
          );
          this.loading = false;
        }
      );
  }

  // đóng popup
  close() {
    this.bsModalRef.hide();
  }

  // them sua thong tin nhan vien cua chi nhanh
  // addStaff(param: any, index: any) {
  //   const initialState = {
  //     parameter: 2019,
  //     title:
  //     param === null
  //         ? "Thêm thông tin nhân viên chi nhánh"
  //         : "Chỉnh sửa thông tin nhân viên chi nhánh",
  //     item: param,
  //     index: index
  //   };

  //   this.bsModalRef = this.modalService.show(AddStaffComponent, {
  //     initialState,
  //     class: "modal-lg"
  //   });
  //   this.bsModalRef.content.event.subscribe(result => {
  //     if (result !== null ) {
  //       if (index === undefined || index === null) {
  //         this.lstStaff.unshift(result);
  //       } else {
  //         this.lstStaff.splice(index, 1, result);
  //       }
  //     }
  //   });
  // }

  // lay danh sach nhan vien cua chi nhanh
  // getListStaff() {
  //   let params = {
  //     branchId: this.branchItem === null ? '' : this.branchItem.id
  //   };

  //   this.api
  //     .get(API_URL_CONSTANT.STAFF.GET_STAFF_BY_BRANCH_ID, params)
  //     .subscribe(
  //       data => {
  //         this.lstStaff = data;
  //       },
  //       error => {}
  //     );
  // }

  // xoa tam thoi danh sach nhan vien
  // deletedTemp(index: any) {
  //   this.lstStaff.splice(index, 1);
  // }
}
