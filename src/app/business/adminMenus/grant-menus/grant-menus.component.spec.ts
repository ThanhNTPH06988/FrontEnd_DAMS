import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantMenusComponent } from './grant-menus.component';

describe('GrantMenusComponent', () => {
  let component: GrantMenusComponent;
  let fixture: ComponentFixture<GrantMenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrantMenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrantMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
