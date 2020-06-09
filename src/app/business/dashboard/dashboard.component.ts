import { Component, OnInit } from '@angular/core';
import { IContextService } from 'src/app/common/ulti/iContext/icontext.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private iContext : IContextService
  ) { }

  ngOnInit() {
    console.log(this.iContext.userLogin);
  }

}
