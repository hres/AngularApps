import { TestBed } from '@angular/core/testing';

import { HcUseOnlyService } from './health-canada-only.service';

describe('HcUseOnlyService', () => {
  let service: HcUseOnlyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HcUseOnlyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
