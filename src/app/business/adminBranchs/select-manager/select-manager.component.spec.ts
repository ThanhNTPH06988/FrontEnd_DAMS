import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectManagerComponent } from './select-manager.component';

describe('SelectManagerComponent', () => {
  let component: SelectManagerComponent;
  let fixture: ComponentFixture<SelectManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
