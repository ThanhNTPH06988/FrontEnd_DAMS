import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStaffsComponent } from './dialog-staffs.component';

describe('DialogStaffsComponent', () => {
  let component: DialogStaffsComponent;
  let fixture: ComponentFixture<DialogStaffsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogStaffsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogStaffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
