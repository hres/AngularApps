import {Injectable} from '@angular/core';
import {Observable, combineLatest, map, shareReplay, tap} from 'rxjs';
import { DATA_PATH } from '../app.constants';
import { DataLoaderService, ICode, ICodeAria, ICodeDefinition, IKeyword, IParentChildren, SortOn, UtilsService } from '@hpfb/sdk/ui';

@Injectable()
export class FormDataLoaderService {

  private countriesJsonPath = DATA_PATH + 'countries.json';
  private enrolmentStatusesPath = DATA_PATH + 'enrolmentStatuses.json'
  
  cachedCountries$:Observable<ICode[]>;
  cachedEnrolmentStatuses$:Observable<ICode[]>;
  
  constructor(private _dataService: DataLoaderService, private _utilsService: UtilsService) {}

  getCountryList(lang: string): Observable<ICode[]> {
    if (!this.cachedCountries$) {
      this.cachedCountries$ = this._dataService.getSortedDataAccents<ICode>(this.countriesJsonPath, this._utilsService.getCompareFields(false, lang))
        .pipe(
          // tap(()=>console.log('getCountryList() is called')),
          shareReplay(1)
        );
    }
    return this.cachedCountries$;
  }

  getEnrolmentStatusesList(): Observable<ICode[]> {
    if (!this.cachedEnrolmentStatuses$) {
      this.cachedEnrolmentStatuses$ = this._dataService.getData<ICode>(this.enrolmentStatusesPath)
        .pipe(
          // tap(()=>console.log('getEnrollmentStatusesList() is called')),
          shareReplay(1)
        );
    } 
    return this.cachedEnrolmentStatuses$;
  }

  // getYesNoList(): Observable<ICode[]> {
  //   if (!this.cachedYesNo$) {
  //     this.cachedYesNo$ = this._dataService.getData<IKeyword>(this.keywordsJsonPath)
  //       .pipe(
  //         map(keywords => {
  //           return keywords.find(keyword => keyword.name === 'yesno')?.data || [];
  //         }),
  //         // tap(()=>console.log('getKeywordList() is called')),
  //         shareReplay(1)
  //       );
  //   }
  //   return this.cachedYesNo$;
  // }

}
