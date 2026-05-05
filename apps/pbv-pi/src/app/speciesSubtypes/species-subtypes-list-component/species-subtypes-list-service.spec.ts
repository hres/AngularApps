import { TestBed } from '@angular/core/testing';

import { SpeciesSubtypesListService } from './species-subtypes-list-service';

describe('SpeciesSubtypesListService', () => {
  let service: SpeciesSubtypesListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeciesSubtypesListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
