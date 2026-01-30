import {Injectable} from '@angular/core';
import {Observable, combineLatest, map, shareReplay, tap} from 'rxjs';
import { DATA_PATH } from '../app.constants';
import { DataLoaderService, ICode, ICodeAria, ICodeDefinition, IKeyword, IParentChildren, SortOn, UtilsService } from '@hpfb/sdk/ui';

@Injectable()
export class FormDataLoaderService {

  private keywordsJsonPath = DATA_PATH + 'keywords.json';
  private dossierTypesJsonPath = DATA_PATH + 'dossierTypes.json';
  private countriesJsonPath = DATA_PATH + 'countries.json';
  private subTypesJsonPath = DATA_PATH + 'subTypes.json';
  private drugUsedsJsonPath = DATA_PATH + 'drugUses.json';
  cachedYesNo$:Observable<ICode[]>;
  dossierTypes$: Observable<ICodeDefinition[]>;
  cachedCountries$:Observable<ICode[]>;
  subTypes$:Observable<ICode[]>;
  drugUse$: Observable<ICodeDefinition[]>;

  constructor(private _dataService: DataLoaderService, private _utilsService: UtilsService) {}

  getDossierTypes(): Observable<ICodeDefinition[]> {
    this.dossierTypes$ = this._dataService
      .getData<ICodeAria>(this.dossierTypesJsonPath)
      .pipe(
        //tap((_) => console.log('getDossierTypes is executed')),
        shareReplay(1)
      );
    return this.dossierTypes$;
  }

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

  getYesNoList(): Observable<ICode[]> {
    if (!this.cachedYesNo$) {
      this.cachedYesNo$ = this._dataService.getData<IKeyword>(this.keywordsJsonPath)
        .pipe(
          map(keywords => {
            return keywords.find(keyword => keyword.name === 'yesno')?.data || [];
          }),
          // tap(()=>console.log('getKeywordList() is called')),
          shareReplay(1)
        );
    }
    return this.cachedYesNo$;
  }


  getSubTypes(lang: string): Observable<ICode[]> {
    this.subTypes$ = this._dataService.getSortedDataAccents<ICode>(this.subTypesJsonPath, this._utilsService.getCompareFields(false, lang))
    .pipe(
      shareReplay(1)
    );
    return this.subTypes$;
  }

  getDrugUses(): Observable<ICodeDefinition[]> {
     return this.drugUse$ = this._dataService
      .getData<ICodeAria>(this.drugUsedsJsonPath)
      .pipe(
        shareReplay(1)
      );

    }
}
