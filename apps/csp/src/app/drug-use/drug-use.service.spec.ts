import { TestBed } from '@angular/core/testing';

import { DrugUseService } from './drug-use.service';

describe('DrugUseService', () => {
  let service: DrugUseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrugUseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
