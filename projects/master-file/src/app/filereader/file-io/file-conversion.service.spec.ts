import { TestBed, inject } from '@angular/core/testing';

import { FileConversionService } from './file-conversion.service';

describe('FileConversionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileConversionService]
    });
  });

  it('should be created', inject([FileConversionService], (service: FileConversionService) => {
    expect(service).toBeTruthy();
  }));
});
