import { TestBed } from '@angular/core/testing';

import { SpeciesSubtypesRecordService } from './species-subtypes-record-service';

describe('SpeciesSubtypesRecordService', () => {
  let service: SpeciesSubtypesRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeciesSubtypesRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
