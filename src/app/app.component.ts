import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { viLocale } from 'ngx-bootstrap/locale';
import { BsDatepickerModule,BsDatepickerConfig} from 'ngx-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bankfunds';

  constructor(
    private translate: TranslateService,
    localeService: BsLocaleService
  ) {
    translate.setDefaultLang('vi');

    //datetime picker
    defineLocale('vi', viLocale);
    localeService.use('vi');
  }

}

export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    dateInputFormat: 'DD/MM/YYYY',
    isAnimated:true,
    showWeekNumbers: false
  });
}
