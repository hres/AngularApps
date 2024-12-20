import { TestBed } from '@angular/core/testing';

import { AppSignalService } from './app-signal.service';

describe('AppSignalService', () => {
  let service: AppSignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppSignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
