import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class RecordDiscardService {
  private discardConfirmedSubject = new Subject<number>();
  discardConfirmed$ = this.discardConfirmedSubject.asObservable();

  confirmDiscard(index: number) {
    this.discardConfirmedSubject.next(index);
  }



  //create different subjects for address and contact discard confirmation to avoid trigger different subscriber when using same subject as above. this is really biger potential issue in current code in many places. so we need to create different subjects for address and contact discard confirmation.

  private discardAddressConfirmedSubject = new Subject<number>();
  discardAddressConfirmed$ = this.discardAddressConfirmedSubject.asObservable();

  confirmDiscardAddress(index: number) {
    this.discardAddressConfirmedSubject.next(index);
  }

  private discardContactConfirmedSubject = new Subject<number>();
  discardContactConfirmed$ = this.discardContactConfirmedSubject.asObservable();

  confirmDiscardContact(index: number) {
    this.discardContactConfirmedSubject.next(index);
  }
}
