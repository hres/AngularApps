import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, mergeMap, of, throwError, toArray } from 'rxjs';
import { GlobalsService } from '../globals/globals.service';
import { SortOn } from './data';

@Injectable()
export class DataService {
  constructor(private http: HttpClient) {}

  public getData<T>(filename: string): Observable<T[]> {
    return this.http.get<any>(GlobalsService.DATA_PATH + filename);
  }

  public getSortedData<T>(filename: string, compareField: SortOn): Observable<T[]> {
    const sortByPriority = (a, b) => {
      const valA = a.sortPriority == null ? -1 : a.sortPriority;
      const valB = b.sortPriority == null ? -1 : b.sortPriority;
      return valA < valB ? -1 : valA > valB ? 1 : 0;
    };

    const sortById = (a, b) => {
      const valA = +a.id;   // convert id from string to number
      const valB = +b.id;
      return valA < valB ? -1 : valA > valB ? 1 : 0;
    };

    const compareFn = compareField === SortOn.PRIORITY? sortByPriority : sortById;

    return this.getData<T>(filename).pipe(
      map(data => data.sort(compareFn))
    );
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
