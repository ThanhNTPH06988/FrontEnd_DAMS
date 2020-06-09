import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailStoragesComponent } from './detail-storages.component';

describe('DetailStoragesComponent', () => {
  let component: DetailStoragesComponent;
  let fixture: ComponentFixture<DetailStoragesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailStoragesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailStoragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
