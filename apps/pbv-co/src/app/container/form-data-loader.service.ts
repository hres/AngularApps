import {Injectable} from '@angular/core';
import {Observable, combineLatest, map, shareReplay, tap} from 'rxjs';
import { DATA_PATH } from '../app.constants';
import { DataLoaderService, ICode, ICodeDefinition, IKeyword, IParentChildren, SortOn, UtilsService } from '@hpfb/sdk/ui';

@Injectable()
export class FormDataLoaderService {

  private countriesJsonPath = DATA_PATH + 'countries.json';
  private enrolmentStatusesPath = DATA_PATH + 'enrolmentStatuses.json'
  private keywordsJsonPath = DATA_PATH + 'keywords.json';
  private companyRolesPath = DATA_PATH + 'companyRoles.json';
  private productLinePath = DATA_PATH + 'productLine.json';
  private provincesJsonPath = DATA_PATH + 'provinces.json';
  private statesJsonPath = DATA_PATH + 'states.json';
  private countryIdMappingJsonPath = DATA_PATH + 'countryIdMapping.json';
  
  cachedCountries$:Observable<ICode[]>;
  cachedEnrolmentStatuses$:Observable<ICode[]>;
  cachedLanguageList$:Observable<ICode[]>;
  cachedCompanyRolesList$:Observable<ICode[]>;
  cachedProductLineList$:Observable<ICode[]>;
  cachedProvincesList$:Observable<ICode[]>;
  cachedStatesList$:Observable<ICode[]>;
  countryIdMapping$: Observable<any[]>;
  
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

  getProvinceList(lang: string): Observable<ICode[]> {
    if (!this.cachedProvincesList$) {
      this.cachedProvincesList$ = this._dataService.getSortedDataAccents<ICode>(this.provincesJsonPath, this._utilsService.getCompareFields(false, lang))
        .pipe(
          // tap(()=>console.log('getProvinceList() is called')),
          shareReplay(1)
        );
    }
    return this.cachedProvincesList$;
  }

  getStateList(lang: string): Observable<ICode[]> {
    if (!this.cachedStatesList$) {
      this.cachedStatesList$ = this._dataService.getSortedDataAccents<ICode>(this.statesJsonPath, this._utilsService.getCompareFields(false, lang))
        .pipe(
          // tap(()=>console.log('getStateList() is called')),
          shareReplay(1)
        );
    }
    return this.cachedStatesList$;
  }

  //Temporary mapping for country code update from version 4.4.3 to 5.0.0, shall be removed in later releases
  getCountryIdMapping(): Observable<any[]> {
    if (!this.countryIdMapping$) {
      this.countryIdMapping$ = this._dataService
        .getData<any>(this.countryIdMappingJsonPath)
        .pipe(
          shareReplay(1)
        );
    }
    return this.countryIdMapping$;
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
