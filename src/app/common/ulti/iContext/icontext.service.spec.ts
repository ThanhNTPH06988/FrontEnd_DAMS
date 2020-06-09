import { TestBed } from '@angular/core/testing';

import { IContextService } from './icontext.service';

describe('IContextService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IContextService = TestBed.get(IContextService);
    expect(service).toBeTruthy();
  });
});
