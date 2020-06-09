import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMenusComponent } from './search-menus.component';

describe('SearchMenusComponent', () => {
  let component: SearchMenusComponent;
  let fixture: ComponentFixture<SearchMenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchMenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
