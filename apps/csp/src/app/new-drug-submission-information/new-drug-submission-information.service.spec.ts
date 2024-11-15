import { TestBed } from '@angular/core/testing';

import { NewDrugSubmissionInformationService } from './new-drug-submission-information.service';

describe('NewDrugSubmissionInformationService', () => {
  let service: NewDrugSubmissionInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewDrugSubmissionInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
