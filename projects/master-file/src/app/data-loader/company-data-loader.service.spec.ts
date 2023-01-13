import { TestBed, inject } from '@angular/core/testing';

import { CompanyDataLoaderService } from './company-data-loader.service';

describe('CompanyDataLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyDataLoaderService]
    });
  });

  it('should be created', inject([CompanyDataLoaderService], (service: CompanyDataLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
