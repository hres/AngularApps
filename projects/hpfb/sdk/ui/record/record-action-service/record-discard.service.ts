import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class RecordDiscardService {
  private discardConfirmedSubject = new Subject<number>();
  discardConfirmed$ = this.discardConfirmedSubject.asObservable();

  confirmDiscard(index: number) {
    this.discardConfirmedSubject.next(index);
  }
}
