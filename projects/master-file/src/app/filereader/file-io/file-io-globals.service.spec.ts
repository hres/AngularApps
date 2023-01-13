import { TestBed, inject } from '@angular/core/testing';

import { FileIoGlobalsService } from './file-io-globals.service';

describe('FileIoGlobalsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileIoGlobalsService]
    });
  });

  it('should be created', inject([FileIoGlobalsService], (service: FileIoGlobalsService) => {
    expect(service).toBeTruthy();
  }));
});
