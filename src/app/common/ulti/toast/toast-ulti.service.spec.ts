import { TestBed } from '@angular/core/testing';

import { ToastUltiService } from './toast-ulti.service';

describe('ToastUltiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToastUltiService = TestBed.get(ToastUltiService);
    expect(service).toBeTruthy();
  });
});
