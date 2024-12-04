import { TestBed } from '@angular/core/testing';

import { TimeOfApplicationService } from './time-of-application.service';

describe('TimeOfApplicationService', () => {
  let service: TimeOfApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeOfApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
