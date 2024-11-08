import { TestBed } from '@angular/core/testing';

import { NoticeOfComplianceService } from './notice-of-compliance.service';

describe('NoticeOfComplianceService', () => {
  let service: NoticeOfComplianceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoticeOfComplianceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
