import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class RecordDeleteService {
  private deleteConfirmedSubject = new Subject<number>();
  deleteConfirmed$ = this.deleteConfirmedSubject.asObservable();

  confirmDelete(index: number) {
    this.deleteConfirmedSubject.next(index);
  }
}
