import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAtmsComponent } from './dialog-atms.component';

describe('DialogAtmsComponent', () => {
  let component: DialogAtmsComponent;
  let fixture: ComponentFixture<DialogAtmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAtmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAtmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
