import { TestBed, inject } from '@angular/core/testing';

import { CompanyAddressRecordService } from './company-address-record.service';

describe('CompanyAddressRecordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyAddressRecordService]
    });
  });

  it('should be created', inject([CompanyAddressRecordService], (service: CompanyAddressRecordService) => {
    expect(service).toBeTruthy();
  }));
});
