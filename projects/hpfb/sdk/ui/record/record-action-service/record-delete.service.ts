import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class RecordDeleteService {
  private deleteConfirmedSubject = new Subject<number>();
  deleteConfirmed$ = this.deleteConfirmedSubject.asObservable();

  confirmDelete(index: number) {
    this.deleteConfirmedSubject.next(index);
  }

  //create different subjects for address and contact deletion confirmation to avoid trigger different subscriber when using same subject as above. this is really biger potential issue in current code in many places. so we need to create different subjects for address and contact deletion confirmation.
  private deleteAddressConfirmedSubject = new Subject<number>();
  deleteAddressConfirmed$ = this.deleteAddressConfirmedSubject.asObservable();

  confirmDeleteAddress(index: number) {
    this.deleteAddressConfirmedSubject.next(index);
  }

  private deleteContactConfirmedSubject = new Subject<number>();
  deleteContactConfirmed$ = this.deleteContactConfirmedSubject.asObservable();

  confirmDeleteContact(index: number) {
    this.deleteContactConfirmedSubject.next(index);
  }
}
