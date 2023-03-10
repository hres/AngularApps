import { TestBed } from '@angular/core/testing';

import { RegulatoryInformationService } from './regulatory-information.service';

describe('RegulatoryInformationService', () => {
  let service: RegulatoryInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegulatoryInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
