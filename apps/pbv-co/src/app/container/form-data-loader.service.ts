import {Injectable} from '@angular/core';
import {Observable, combineLatest, map, shareReplay, tap} from 'rxjs';
import { DATA_PATH } from '../app.constants';
import { DataLoaderService, ICode, ICodeAria, ICodeDefinition, IKeyword, IParentChildren, SortOn, UtilsService } from '@hpfb/sdk/ui';

@Injectable()
export class FormDataLoaderService {

  private countriesJsonPath = DATA_PATH + 'countries.json';
  private enrolmentStatusesPath = DATA_PATH + 'enrolmentStatuses.json'
  private keywordsJsonPath = DATA_PATH + 'keywords.json';
  private companyRolesPath = DATA_PATH + 'companyRoles.json';
  private productLinePath = DATA_PATH + 'productLine.json';
  
  cachedCountries$:Observable<ICode[]>;
  cachedEnrolmentStatuses$:Observable<ICode[]>;
  cachedLanguageList$:Observable<ICode[]>;
  cachedCompanyRolesList$:Observable<ICode[]>;
  cachedProductLineList$:Observable<ICode[]>;
  // cachedProductLineList$:Observable<ICodeAria[]>;
  
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

  getLanguageList(): Observable<ICode[]> {
    if (!this.cachedLanguageList$) {
      this.cachedLanguageList$ = this._dataService.getData<IKeyword>(this.keywordsJsonPath)
        .pipe(
          map(keywords => {
            return keywords.find(keyword => keyword.name === 'languages')?.data || [];
          }),
          // tap(()=>console.log('getKeywordList() is called')),
          shareReplay(1)
        );
    }
    return this.cachedLanguageList$;
  }

  getCompanyRolesList(): Observable<ICode[]> {
    if (!this.cachedCompanyRolesList$) {
      this.cachedCompanyRolesList$ = this._dataService.getData<ICode>(this.companyRolesPath)
        .pipe(
          // tap(()=>console.log('getEnrollmentStatusesList() is called')),
          shareReplay(1)
        );
    } 
    return this.cachedCompanyRolesList$;
  }

  getProductLineList(): Observable<ICode[]> {
    if (!this.cachedProductLineList$) {
      this.cachedProductLineList$ = this._dataService.getData<ICode>(this.productLinePath)
        .pipe(
          // tap(()=>console.log('getEnrollmentStatusesList() is called')),
          shareReplay(1)
        );
    } 
    return this.cachedProductLineList$;
  }

  // getProductLineList(): Observable<ICodeAria[]> {
  //   this.cachedProductLineList$ = this._dataService
  //     .getData<ICodeAria>(this.productLinePath)
  //     .pipe(
  //       //tap((_) => console.log('getMasterFileTypeOptions is executed')),
  //       shareReplay(1)
  //     );
  //   return this.cachedProductLineList$;
  // }


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
