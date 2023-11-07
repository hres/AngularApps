import { TestBed } from '@angular/core/testing';

import { CheckSumService } from './check-sum.service';

describe('CheckSumService', () => {
  let service: CheckSumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckSumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
