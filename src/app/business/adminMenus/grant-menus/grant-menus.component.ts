import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';
import { API_URL_CONSTANT } from 'src/app/common/constant/apiUrlConstant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { IContextService } from 'src/app/common/ulti/iContext/icontext.service';

@Component({
  selector: 'app-grant-menus',
  templateUrl: './grant-menus.component.html',
  styleUrls: ['./grant-menus.component.scss']
})
export class GrantMenusComponent implements OnInit {

  //params
  title: string;
  item: any;
  isSubmenuParent: boolean;
  parent: any;

  //close dialog
  event: EventEmitter<any> = new EventEmitter();

  isReadOnly: boolean = false;

  loading: boolean = false;
  submitted: boolean = false;

  lstMenusLevel: any = [];
  lstParentMenu: any = [];
  menuForm: FormGroup;

  lstRoleGrant: any = [];
  lstRoleNoGrant: any = [];

  chkAllNoGrant: boolean = false;
  chkAllGrant: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private api: ApiService,
    private toast: ToastUltiService,
    private fb: FormBuilder,
    private iContext: IContextService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getRoleGrant();

    if (this.item != null) {
      this.isReadOnly = true;
      this.bindDataForView();
    }
    if (this.parent != null && this.isSubmenuParent) {
      this.menuForm.controls.menuParent.setValue(this.parent.name);
    }
  }

  get f() { return this.menuForm.controls }

  bindDataForView(): void {
    this.menuForm.controls.code.setValue(this.item.code);
    this.menuForm.controls.name.setValue(this.item.name);
    this.menuForm.controls.icon.setValue(this.item.icon);
    this.menuForm.controls.path.setValue(this.item.urlPath);
    this.menuForm.controls.orderView.setValue(this.item.orderIndex);
    this.menuForm.controls.submenu.setValue(this.item.isSubmenu.toString());
  }

  buildForm(): void {
    this.menuForm = this.fb.group({
      code: ['', [
        Validators.required
      ]],
      name: ['', [
        Validators.required
      ]],
      icon: ['', [
        Validators.required
      ]],
      path: ['', [
        Validators.required
      ]],
      orderView: ['', [
        Validators.required
      ]],
      submenu: ['0'],
      menuParent: ['']
    })
  }

  getRoleGrant(): void {
    this.loading = true;
    let param = {
      menuId: this.item != null ? this.item.id : 0
    }
    this.api.get(API_URL_CONSTANT.MENU.GET_ROLE_FOR_MENU, param).subscribe(data => {
      debugger;
      let rs = JSON.parse(JSON.stringify(data.data));
      this.lstRoleGrant = rs.lstGrant != null ? rs.lstGrant : [];
      this.lstRoleNoGrant = rs.lstNoGrant != null ? rs.lstNoGrant : [];
      this.loading = false;
    }, error => {
      this.toast.showWarning('Thông báo', 'Hệ thống đang bận. Xin vui lòng thửu lại sau.');
      this.loading = false;
    })
  }

  checkGrantItem(type: number): void {
    if (type === 0) {
      let lstChoieNoGrant = _.filter(this.lstRoleNoGrant, (obj) => {
        return obj.choice;
      });
      if (lstChoieNoGrant.length === this.lstRoleNoGrant.length) {
        this.chkAllNoGrant = true;
      } else {
        this.chkAllNoGrant = false;
      }
    } else {
      let lstChoieGrant = _.filter(this.lstRoleGrant, (obj) => {
        return obj.choice;
      });
      if (lstChoieGrant.length === this.lstRoleGrant.length) {
        this.chkAllGrant = true;
      } else {
        this.chkAllGrant = false;
      }
    }
  }

  checkGrant(type: number): void {
    debugger;
    if (type === 0) {
      _.map(this.lstRoleNoGrant, (obj) => {
        obj.choice = this.chkAllNoGrant;
        return obj;
      });
    } else {
      _.map(this.lstRoleGrant, (obj) => {
        obj.choice = this.chkAllGrant;
        return obj;
      });
    }
  }
  moveRight(): void {
    let lstChoice = _.filter(this.lstRoleNoGrant, (obj) => {
      return obj.choice;
    });

    if (lstChoice.length === 0) {
      this.toast.showInfo('Thông báo', 'Chọn ít nhất 1 quyền để gán cho menu');
      return;
    }
    //xoa khoi danh sach chua duoc phan quyen
    this.lstRoleNoGrant = _.reject(this.lstRoleNoGrant, (obj) => {
      return obj.choice;
    });

    //chuyen sang lst phan quyen
    _.map(lstChoice, (obj) => {
      obj.choice = false;
      return obj;
    });
    this.lstRoleGrant = _.concat(this.lstRoleGrant, lstChoice);

    if (this.chkAllNoGrant)
      this.chkAllNoGrant = !this.chkAllNoGrant;
  }
  moveLeft(): void {
    let lstChoice = _.filter(this.lstRoleGrant, (obj) => {
      return obj.choice;
    });

    if (lstChoice.length === 0) {
      this.toast.showInfo('Thông báo', 'Chọn ít nhất 1 quyền để bỏ gán cho menu');
      return;
    }

    //xoa khoi danh sach chua duoc phan quyen
    this.lstRoleGrant = _.reject(this.lstRoleGrant, (obj) => {
      return obj.choice;
    });

    //chuyen sang lst phan quyen
    _.map(lstChoice, (obj) => {
      obj.choice = false;
      return obj;
    });
    this.lstRoleNoGrant = _.concat(this.lstRoleNoGrant, lstChoice);

    if (this.chkAllGrant)
      this.chkAllGrant = !this.chkAllGrant;
  }

  saveOrUpdate(): void {
    this.submitted = true;
    if (this.menuForm.invalid) {
      this.toast.showInfo('Thông báo', 'Kiểm tra lại dữ liệu đầu vào');
      return;
    }

    this.loading = true;
    let menus = {
      id: this.item != null ? this.item.id : null,
      code: this.menuForm.controls.code.value,
      name: this.menuForm.controls.name.value,
      icon: this.menuForm.controls.icon.value,
      urlPath: this.menuForm.controls.path.value,
      parentId: this.parent != null ? this.parent.id : null,
      userId: this.iContext.userLogin.id,
      orderIndex: this.menuForm.controls.orderView.value,
      isSubmenu: this.menuForm.controls.submenu.value,
      dateCreated:this.item != null ? this.item.dateCreated : null,
      status:this.item != null ? this.item.status : null,
      deleted:this.item != null ? this.item.deleted : null,
      menuLevel:this.item != null ? this.item.menuLevel : null,
      lstRoles: this.lstRoleGrant
    }

    debugger;

    this.api.post(API_URL_CONSTANT.MENU.SAVE_OR_UPDATE, menus, {}).subscribe(data => {
      this.toast.showSuccess('Thông báo', 'Lưu dữ liệu thành công.');
      this.loading = false;
      this.event.emit('OK');
      this.bsModalRef.hide();
    }, error => {
      this.toast.showWarning('Thông báo', 'Hệ thống đang bận. Xin vui lòng thửu lại sau.');
      this.loading = false;
    });

  }

  close() {
    this.bsModalRef.hide();
  }

}
