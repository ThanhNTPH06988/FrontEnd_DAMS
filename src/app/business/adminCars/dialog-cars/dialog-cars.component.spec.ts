import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCarsComponent } from './dialog-cars.component';

describe('DialogCarsComponent', () => {
  let component: DialogCarsComponent;
  let fixture: ComponentFixture<DialogCarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
