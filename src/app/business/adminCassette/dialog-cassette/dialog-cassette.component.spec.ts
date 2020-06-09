import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCassetteComponent } from './dialog-cassette.component';

describe('DialogCassetteComponent', () => {
  let component: DialogCassetteComponent;
  let fixture: ComponentFixture<DialogCassetteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCassetteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCassetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
