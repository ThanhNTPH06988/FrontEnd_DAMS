import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchStoragesComponent } from './search-storages.component';

describe('SearchStoragesComponent', () => {
  let component: SearchStoragesComponent;
  let fixture: ComponentFixture<SearchStoragesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchStoragesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchStoragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
