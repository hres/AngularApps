import {Injectable} from '@angular/core';
import {Observable, combineLatest, map, shareReplay, tap} from 'rxjs';
import { DATA_PATH } from '../app.constants';
import { DataLoaderService, ICode, ICodeAria, ICodeDefinition, IKeyword, IParentChildren, SortOn, UtilsService } from '@hpfb/sdk/ui';

@Injectable()
export class FormDataLoaderService {

  private keywordsJsonPath = DATA_PATH + 'keywords.json';
  private countriesJsonPath = DATA_PATH + 'countries.json';
  private provincesJsonPath = DATA_PATH + 'provinces.json';
  private statesJsonPath = DATA_PATH + 'states.json';
  private dossierTypesJsonPath = DATA_PATH + 'dossierTypes.json';
  private raLeadsJsonPath = DATA_PATH + 'raLeads.json';
  private adminSubTypesJsonPath = DATA_PATH + 'adminSubTypes.json';

  cashedLanguages$:Observable<ICode[]>;
  cachedYesNo$:Observable<ICode[]>;
  cachedCountries$:Observable<ICode[]>;
  cachedProvinces$:Observable<ICode[]>;
  cachedStates$:Observable<ICode[]>;
  dossierTypes$: Observable<ICodeDefinition[]>;
  cachedAdminSubTypes$: Observable<ICode[]>;
  relationship$: Observable<any[]>;
  raLeads$: Observable<ICodeDefinition[]>;
  dossierTypeRaLeadsOptions$: Observable<IParentChildren[]>;
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

  getRaLeads(): Observable<ICodeDefinition[]> {
    // store the shared observable in a private property and reusing it in subsequent calls
    if (!this.raLeads$) {
      this.raLeads$ = this._dataService
        .getData<ICodeDefinition>(this.raLeadsJsonPath) 
        .pipe(
          // tap((_) => console.log('getTxDescriptions is executed')),
          shareReplay(1)
        );
    }
    return this.raLeads$;
  }

  getRelationship(): Observable<ICodeDefinition[]> {
    if (!this.relationship$) {
      this.relationship$ = this._dataService
        .getData<any>(DATA_PATH + 'dossierTypeRaLeads.json') 
        .pipe(
          // tap((_) => console.log('getTxDescriptions is executed')),
          shareReplay(1)
        );
    }
    return this.relationship$;
  }

  getDossierTypeAndRaLeads(): Observable<IParentChildren[]> {
    const dossierTypeAndRaLeads$ = this._dataService
      .getData<any>(DATA_PATH + 'dossierTypeRaLeads.json')
      .pipe(
        // tap((data) =>
        //   console.log(
        //     'getDossierTypeAndRaLeads ~ typeDescription: ',
        //     JSON.stringify(data)
        //   )
        // ),
        // catchError(this._dataService.handleError)
      );


    this.dossierTypeRaLeadsOptions$ = combineLatest([
      dossierTypeAndRaLeads$,
      this.getRaLeads(),
    ]).pipe(
      map(([arr1, arr2]) => {
        return arr1.map((item) => ({
          parentId: item.dossierTypeId,
          children: arr2.filter((x) => {
            return item.raLeadIds.includes(x.id);
          }),
        }));
      }),
      shareReplay(1)
    );

    return this.dossierTypeRaLeadsOptions$;
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

  getAdminSubTypes(): Observable<ICode[]> {
    this.cachedAdminSubTypes$ = this._dataService.getData<ICode>(this.adminSubTypesJsonPath)
    .pipe(
      shareReplay(1)
    );
    return this.cachedAdminSubTypes$;
  }
}