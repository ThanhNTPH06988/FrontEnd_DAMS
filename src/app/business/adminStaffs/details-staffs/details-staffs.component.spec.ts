import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsStaffsComponent } from './details-staffs.component';

describe('DetailsStaffsComponent', () => {
  let component: DetailsStaffsComponent;
  let fixture: ComponentFixture<DetailsStaffsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsStaffsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsStaffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
