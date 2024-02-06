import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ErrorSummaryComponent } from './error-summary/error-summary.component';

@Injectable()
export class ErrorNotificationService {

  // error summaries change notification for all records in a list(eg. contact records) 
  private errorSummarySubject = new BehaviorSubject<{ key: string, errSummaryMessage: ErrorSummaryComponent }[]>([]);
  errorSummaryChanged$ = this.errorSummarySubject.asObservable();

  updateErrorSummary(key: string, errorMessage: ErrorSummaryComponent) {
    const currentErrors = this.errorSummarySubject.value;
    
    // Check if the error key already exists
    const existingErrorIndex = currentErrors.findIndex(error => error.key === key);
    if (existingErrorIndex !== -1) {
      // If the error key exists, update the error errSummaryMessage
      currentErrors[existingErrorIndex].errSummaryMessage = errorMessage;
    } else {
      // If the error key does not exist, add the new error
      currentErrors.push({ key, errSummaryMessage: errorMessage });
    }
    
    // Update the errorSummarySubject with the modified array of errors
    this.errorSummarySubject.next(currentErrors);
  }

  removeErrorSummary(key: string) {
    const currentErrors = this.errorSummarySubject.value;
    // Filter out the entry with the specified key
    const updatedErrors = currentErrors.filter(error => error.key !== key);
    // Update the errorSummarySubject with the filtered array of errors
    this.errorSummarySubject.next(updatedErrors);
  }

  clearErrors() {
    this.errorSummarySubject.next([]);
  }
}
