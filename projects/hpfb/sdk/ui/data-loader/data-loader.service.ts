import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap, throwError} from 'rxjs';
import { ICode, SortOn } from './data'; 
import { OTHER_EN, OTHER_FR } from '../common.constants';

@Injectable({
  providedIn: 'root'
})
export class DataLoaderService {
  constructor(private http: HttpClient) {}

  // public getData<T>(filename: string): Observable<T[]> {
  //   return this.http.get<any>(GlobalsService.DATA_PATH + filename);
  // }
  public getData<T>(endpoint: string): Observable<T[]> {
    return this.http.get<any>(endpoint).pipe();
  }

  public getSortedData<T extends ICode>(endpoint: string, compareField: SortOn): Observable<T[]> {
    const compareFn = this.getCompareFunction(compareField);

    return this.getData<T>(endpoint).pipe(
      map(data => data.sort(compareFn))
    );
  }

  public getSortedDataAccents<T extends ICode>(endpoint: string, compareField: SortOn): Observable<T[]> {
    const compareFn = this.getCompareFunctionOther(compareField);

    return this.getData<T>(endpoint).pipe(
      map(data => data.sort(compareFn))
    );
  }

  private getCompareFunction(compareField: SortOn) {
    return (a: ICode, b: ICode) => {
      const valA = this.getFieldValue(a, compareField);
      const valB = this.getFieldValue(b, compareField);
      return valA < valB ? -1 : valA > valB ? 1 : 0;
    };
  }

  private getCompareFunctionOther(compareField: SortOn) {
    return (a: ICode, b: ICode) => {
      const valA = this.getFieldValue(a, compareField);
      const valB = this.getFieldValue(b, compareField);

      // Place last if value is "Other"/"Autre"
      if (valA === OTHER_EN || valA === OTHER_FR) return 1;
      if (valB === OTHER_EN || valB === OTHER_FR) return -1;
      
      return valA.toString().localeCompare(valB.toString());
    };
  }

  private getFieldValue(obj: ICode, field: SortOn): string | number {
    if (field === SortOn.PRIORITY && obj.sortPriority !== undefined) {
      return obj.sortPriority;
    }
    return obj[field];
  }

  public handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }
}
