import { TestBed } from '@angular/core/testing';

import { PbvService } from './pbv.service';

describe('PbvService', () => {
  let service: PbvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PbvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
