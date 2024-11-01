import { TestBed } from '@angular/core/testing';

import { PatentServiceService } from './patent-service.service';

describe('PatentServiceService', () => {
  let service: PatentServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatentServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
