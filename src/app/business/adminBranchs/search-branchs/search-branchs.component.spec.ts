import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBranchsComponent } from './search-branchs.component';

describe('SearchBranchsComponent', () => {
  let component: SearchBranchsComponent;
  let fixture: ComponentFixture<SearchBranchsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBranchsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBranchsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
