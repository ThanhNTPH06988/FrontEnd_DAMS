import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogParamsComponent } from './dialog-params.component';

describe('DialogParamsComponent', () => {
  let component: DialogParamsComponent;
  let fixture: ComponentFixture<DialogParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
