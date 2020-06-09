import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCassetteComponent } from './search-cassette.component';

describe('SearchCassetteComponent', () => {
  let component: SearchCassetteComponent;
  let fixture: ComponentFixture<SearchCassetteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCassetteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCassetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
