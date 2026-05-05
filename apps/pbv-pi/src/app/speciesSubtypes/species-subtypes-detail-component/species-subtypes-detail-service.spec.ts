import { TestBed } from '@angular/core/testing';

import { SpeciesSubtypesDetailsService } from './species-subtypes-detail-service';

describe('SpeciesSubtypesDetailService', () => {
  let service: SpeciesSubtypesDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeciesSubtypesDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
