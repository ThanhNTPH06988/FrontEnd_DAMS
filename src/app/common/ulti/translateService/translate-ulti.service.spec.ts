import { TestBed } from '@angular/core/testing';

import { TranslateUltiService } from './translate-ulti.service';

describe('TranslateUltiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TranslateUltiService = TestBed.get(TranslateUltiService);
    expect(service).toBeTruthy();
  });
});
