import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchStaffsComponent } from './search-staffs.component';

describe('SearchStaffsComponent', () => {
  let component: SearchStaffsComponent;
  let fixture: ComponentFixture<SearchStaffsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchStaffsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchStaffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
