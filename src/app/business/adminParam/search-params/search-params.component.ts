import { Component, OnInit } from '@angular/core';
import { APP_CONSTANT } from 'src/app/common/constant/appConstant';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/common/api/api.service';
import { ToastUltiService } from 'src/app/common/ulti/toast/toast-ulti.service';

@Component({
  selector: 'app-search-params',
  templateUrl: './search-params.component.html',
  styleUrls: ['./search-params.component.scss']
})
export class SearchParamsComponent implements OnInit {

  loading:boolean = false;

  totalRecord:number = 0;
  size:number = APP_CONSTANT.PAGINATION.SIZE;
  page:number = 1;
  maxPageView:number = 5;
  lstRecord:any = [];
  
  searchForm:FormGroup;

  constructor(
    private api : ApiService,
    private toast : ToastUltiService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(){
    this.searchForm = this.fb.group({
      paramCode:[''],
      paramType:['']
    })
  }

}
