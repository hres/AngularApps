import { TestBed } from '@angular/core/testing';

import { MedicinalIngredientsService } from './medicinal-ingredients.service';

describe('MedicinalIngredientsService', () => {
  let service: MedicinalIngredientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicinalIngredientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
