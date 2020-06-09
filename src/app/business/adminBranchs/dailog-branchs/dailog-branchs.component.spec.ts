import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailogBranchsComponent } from './dailog-branchs.component';

describe('DailogBranchsComponent', () => {
  let component: DailogBranchsComponent;
  let fixture: ComponentFixture<DailogBranchsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailogBranchsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailogBranchsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
