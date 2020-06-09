import { TestBed } from '@angular/core/testing';

import { ToastShowService } from './toast-show.service';

describe('ToastShowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToastShowService = TestBed.get(ToastShowService);
    expect(service).toBeTruthy();
  });
});
