import { TestBed, inject } from '@angular/core/testing';

import { AddressListService } from './address-list.service';

describe('AddressListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddressListService]
    });
  });

  it('should be created', inject([AddressListService], (service: AddressListService) => {
    expect(service).toBeTruthy();
  }));
});
