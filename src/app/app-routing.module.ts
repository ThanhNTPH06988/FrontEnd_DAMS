import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGaurdService } from './auth/grant/auth-gaurd.service';
import { SearchMenusComponent } from './business/adminMenus/search-menus/search-menus.component';
import { SearchUsersComponent } from './business/adminUsers/search-users/search-users.component';
import { DashboardComponent } from './business/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SearchStaffsComponent } from './business/adminStaffs/search-staffs/search-staffs.component';
import { SearchStoragesComponent } from './business/adminStorages/search-storages/search-storages.component';
import { SearchAtmsComponent } from './business/adminAtms/search-atms/search-atms.component';
import { SearchCarsComponent } from './business/adminCars/search-cars/search-cars.component';
import { SearchRequestComponent } from './business/atmRequest/search-request/search-request.component';
import { SearchParamsComponent } from './business/adminParam/search-params/search-params.component';
import { SearchBranchsComponent } from './business/adminBranchs/search-branchs/search-branchs.component';
import { SearchCassetteComponent } from './business/adminCassette/search-cassette/search-cassette.component';
import { SearchManagerComponent } from './business/managerRequest/search-manager/search-manager.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'home', component: AuthComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGaurdService] },
      { path: 'users', component: SearchUsersComponent, canActivate: [AuthGaurdService] },
      { path: 'menus', component: SearchMenusComponent, canActivate: [AuthGaurdService] },
      { path: 'storages', component: SearchStoragesComponent, canActivate: [AuthGaurdService] },
      { path: 'staffs', component: SearchStaffsComponent, canActivate: [AuthGaurdService] },
      { path: 'atms', component: SearchAtmsComponent, canActivate: [AuthGaurdService] },
      { path: 'request', component: SearchRequestComponent, canActivate: [AuthGaurdService] },
      { path: 'params', component: SearchParamsComponent, canActivate: [AuthGaurdService] },
      { path: 'cars', component: SearchCarsComponent,canActivate: [AuthGaurdService] },
      { path: 'branchs', component: SearchBranchsComponent,canActivate: [AuthGaurdService] },
      { path: 'casstte', component: SearchCassetteComponent,canActivate: [AuthGaurdService]},
      { path: 'qlyctq', component: SearchManagerComponent, canActivate: [AuthGaurdService]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
