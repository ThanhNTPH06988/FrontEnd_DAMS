import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAtmsComponent } from './search-atms.component';

describe('SearchAtmsComponent', () => {
  let component: SearchAtmsComponent;
  let fixture: ComponentFixture<SearchAtmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAtmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAtmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
