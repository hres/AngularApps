import {Injectable} from '@angular/core';
import {Observable, combineLatest, map, shareReplay, tap} from 'rxjs';
import { DATA_PATH } from '../app.constants';
import { DataLoaderService, ICode, ICodeAria, ICodeDefinition, IKeyword, IParentChildren, SortOn, UtilsService } from '@hpfb/sdk/ui';

@Injectable()
export class FormDataLoaderService {

  // private keywordsJsonPath = DATA_PATH + 'keywords.json';
  private countriesJsonPath = DATA_PATH + 'countries.json';
  private provincesJsonPath = DATA_PATH + 'provinces.json';
  private statesJsonPath = DATA_PATH + 'states.json';
  private dossierTypesJsonPath = DATA_PATH + 'dossierTypes.json';
  private drugUseJsonPath = DATA_PATH + 'druguses.json';
  private timingOfApplicantPath = DATA_PATH + 'timingOfApplicant.json'
  private keywordsJsonPath = DATA_PATH + 'keywords.json';

  cachedLanguageList$:Observable<ICode[]>;
  cachedYesNo$:Observable<ICode[]>;
  cachedWhoResponsible$:Observable<ICode[]>;
  cachedCountries$:Observable<ICode[]>;
  cachedProvinces$:Observable<ICode[]>;
  cachedStates$:Observable<ICode[]>;
  dossierTypes$: Observable<ICodeDefinition[]>;
  drugUseOptions$: Observable<ICode[]>;
  timingOfApplicantTypes$: Observable<ICodeAria[]>;
  // mfUseOptions$: Observable<ICode[]>;
  // txDescs$: Observable<ICodeDefinition[]>;
  // mfTypeTxDescOptions$: Observable<IParentChildren[]>;
  // mfRevisedTypeTxDescOptions$: Observable<IParentChildren[]>;

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

  getProvinceList(lang: string): Observable<ICode[]> {
    if (!this.cachedProvinces$) {
      this.cachedProvinces$ = this._dataService.getSortedDataAccents<ICode>(this.provincesJsonPath, this._utilsService.getCompareFields(false, lang))
        .pipe(
          // tap(()=>console.log('getProvinceList() is called')),
          shareReplay(1)
        );
    }
    return this.cachedProvinces$;
  }

  getStateList(lang: string): Observable<ICode[]> {
    if (!this.cachedStates$) {
      this.cachedStates$ = this._dataService.getSortedDataAccents<ICode>(this.statesJsonPath, this._utilsService.getCompareFields(false, lang))
        .pipe(
          // tap(()=>console.log('getStateList() is called')),
          shareReplay(1)
        );
    }
    return this.cachedStates$;
  }

  getDossierTypes(): Observable<ICodeDefinition[]> {
    this.dossierTypes$ = this._dataService
      .getData<ICodeAria>(this.dossierTypesJsonPath)
      .pipe(
        //tap((_) => console.log('getMasterFileTypeOptions is executed')),
        shareReplay(1)
      );
    return this.dossierTypes$;
  }

  getDrugUesOptions(lang: string): Observable<ICode[]> {


    this.drugUseOptions$ = this._dataService
      .getData<ICodeAria>(this.drugUseJsonPath)
      .pipe(
        //tap((_) => console.log('getMasterFileTypeOptions is executed')),
        shareReplay(1)
      );
    return this.drugUseOptions$;
  }

  getTimingOfApplicantTypes(): Observable<ICodeAria[]> {
    this.timingOfApplicantTypes$ = this._dataService
      .getData<ICodeAria>(this.timingOfApplicantPath)
      .pipe(
        //tap((_) => console.log('getMasterFileTypeOptions is executed')),
        shareReplay(1)
      );
    return this.timingOfApplicantTypes$;
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

}
