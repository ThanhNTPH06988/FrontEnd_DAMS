import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService implements CanActivate{

  constructor(
    private router : Router,
    private authService: AuthenticationService
  ) { }


  canActivate() {
    if (!this.authService.isTokenExpired()) {
      return true;
    }

    debugger;
    //close popup
    $('.modal-dialog').modal('hide');

    this.router.navigate(['/login']);
    return false;

  }

}
