import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule, PaginationModule, ModalModule, TooltipModule, PopoverModule  } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';

//trim
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

// toast
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// Import ngx-barcode module
// import { NgxBarcodeModule } from 'ngx-barcode';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './business/dashboard/dashboard.component';
import { NavComponent } from './auth/nav/nav.component';
import { SidebarComponent } from './auth/sidebar/sidebar.component';
import { FooterComponent } from './auth/footer/footer.component';
import { SearchMenusComponent } from './business/adminMenus/search-menus/search-menus.component';
import { GrantMenusComponent } from './business/adminMenus/grant-menus/grant-menus.component';
import { SearchUsersComponent } from './business/adminUsers/search-users/search-users.component';
import { DialogUsersComponent } from './business/adminUsers/dialog-users/dialog-users.component';
import { ConfirmDialogComponent } from './common/ulti/gui/confirm-dialog/confirm-dialog.component';
import { SearchStaffsComponent } from './business/adminStaffs/search-staffs/search-staffs.component';
import { SearchAtmsComponent } from './business/adminAtms/search-atms/search-atms.component';
import { DialogAtmsComponent } from './business/adminAtms/dialog-atms/dialog-atms.component';
import { DialogStaffsComponent } from './business/adminStaffs/dialog-staffs/dialog-staffs.component';
import { DialogCarsComponent } from './business/adminCars/dialog-cars/dialog-cars.component';
import { SearchCarsComponent } from './business/adminCars/search-cars/search-cars.component';
import { SearchStoragesComponent } from './business/adminStorages/search-storages/search-storages.component';
import { DetailStoragesComponent } from './business/adminStorages/detail-storages/detail-storages.component';
import { OnlyNumberDirective } from './common/ulti/directive/onlyNumber/only-number.directive';
import { UpperDirective } from './common/ulti/directive/stringUppercase/upper.directive';
import { CapitalizeDirective } from './common/ulti/directive/stringCapitalize/capitalize.directive';
import { SearchRequestComponent } from './business/atmRequest/search-request/search-request.component';
import { DetailRequestComponent } from './business/atmRequest/detail-request/detail-request.component';
import { HistoryRequestComponent } from './business/atmRequest/history-request/history-request.component';
import { SearchParamsComponent } from './business/adminParam/search-params/search-params.component';
import { DialogParamsComponent } from './business/adminParam/dialog-params/dialog-params.component';
import { SearchBranchsComponent } from './business/adminBranchs/search-branchs/search-branchs.component';
import { SearchCassetteComponent } from './business/adminCassette/search-cassette/search-cassette.component';
import { DialogCassetteComponent } from './business/adminCassette/dialog-cassette/dialog-cassette.component';
import { SearchManagerComponent } from './business/managerRequest/search-manager/search-manager.component';
import { DailogBranchsComponent } from './business/adminBranchs/dailog-branchs/dailog-branchs.component';
import { StringSplitterDirective } from './common/ulti/directive/splitter/string-splitter.directive';
import { AddStaffComponent } from './business/adminBranchs/add-staff/add-staff.component';
import { DetailsStaffsComponent } from './business/adminStaffs/details-staffs/details-staffs.component';
import { SelectManagerComponent } from './business/adminBranchs/select-manager/select-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthComponent,
    DashboardComponent,
    NavComponent,
    SidebarComponent,
    FooterComponent,
    SearchMenusComponent,
    GrantMenusComponent,
    SearchUsersComponent,
    DialogUsersComponent,
    ConfirmDialogComponent,
    ConfirmDialogComponent,
    SearchStaffsComponent,
    DialogStaffsComponent,
    SearchStoragesComponent,
    DetailStoragesComponent,
    SearchAtmsComponent,
    DialogAtmsComponent,
    DialogCarsComponent,
    SearchCarsComponent,
    OnlyNumberDirective,
    UpperDirective,
    CapitalizeDirective,
    SearchRequestComponent,
    DetailRequestComponent,
    HistoryRequestComponent,
    SearchParamsComponent,
    DialogParamsComponent,
    SearchBranchsComponent,
    DailogBranchsComponent,
    SearchCassetteComponent,
    DialogCassetteComponent,
    SearchManagerComponent,
    StringSplitterDirective,
    AddStaffComponent,
    DetailsStaffsComponent,
    SelectManagerComponent
 ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // NgxBarcodeModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    NgxTrimDirectiveModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  entryComponents: [
    GrantMenusComponent,
    DialogUsersComponent,
    ConfirmDialogComponent,
    DetailStoragesComponent,
    DialogStaffsComponent,
    DialogAtmsComponent,
    DialogParamsComponent,
    DialogCarsComponent,
    DetailRequestComponent,
    HistoryRequestComponent,
    DailogBranchsComponent,
    DialogCassetteComponent,
    AddStaffComponent,
    DetailsStaffsComponent,
    SelectManagerComponent
  ]
})
export class AppModule { }

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
