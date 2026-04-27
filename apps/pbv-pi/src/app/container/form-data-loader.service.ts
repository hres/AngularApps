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
  private scheduleClaimsJsonPath = DATA_PATH + 'scheduleClaims.json';
  private disinfectantTypeJsonPath = DATA_PATH + 'disinfectantTypes.json';
  private nanomaterialsJsonPath = DATA_PATH + 'nanomaterial.json';
  private operatorsJsonPath = DATA_PATH + 'operator.json';
  private perJsonPath = DATA_PATH + 'per.json';
  private rolesJsonPath = DATA_PATH + 'roles.json';
  private unitsJsonPath = DATA_PATH + 'units.json';
  private calculatedBaseJsonPath = DATA_PATH + 'calculatedBase.json';
  private unitMeasureJsonPath = DATA_PATH + 'unitMeasure.json';
  private unitPresentationJsonPath = DATA_PATH + 'unitPresentation.json';
  private dosageFormJsonPath = DATA_PATH + 'dosageForm.json';
  cachedYesNo$:Observable<ICode[]>;
  dossierTypes$: Observable<ICodeDefinition[]>;
  cachedCountries$:Observable<ICode[]>;
  subTypes$:Observable<ICode[]>;
  drugUse$: Observable<ICodeDefinition[]>;
  scheduleClaims$: Observable<ICodeDefinition[]>;
  disinfectantTypes$: Observable<ICodeDefinition[]>;
  nanomaterials$: Observable<ICode[]>;
  operators$: Observable<ICode[]>;
  per$: Observable<ICode[]>;
  roles$: Observable<ICode[]>;
  units$: Observable<ICode[]>;
  calculatedBase$: Observable<ICode[]>;
  unitMeasure$: Observable<ICode[]>;
  unitPresentation$: Observable<ICode[]>;
  dosageForm$: Observable<ICode[]>;

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

  getNanomaterials(): Observable<ICode[]> {
    return this.nanomaterials$ = this._dataService
      .getData<ICodeAria>(this.nanomaterialsJsonPath)
      .pipe(
        shareReplay(1)
      );

  }

  getOperators(): Observable<ICode[]> {
    return this.operators$ = this._dataService
      .getData<ICodeAria>(this.operatorsJsonPath)
      .pipe(
        shareReplay(1)
      );

  }

  
  getPer(): Observable<ICode[]> {
    return this.per$ = this._dataService
      .getData<ICodeAria>(this.perJsonPath)
      .pipe(
        shareReplay(1)
      );

  }

  getRoles(): Observable<ICode[]> {
    return this.roles$ = this._dataService
      .getData<ICodeAria>(this.rolesJsonPath)
      .pipe(
        shareReplay(1)
      );

  }

  getUnits(): Observable<ICode[]> {
    return this.units$ = this._dataService
      .getData<ICodeAria>(this.unitsJsonPath)
      .pipe(
        shareReplay(1)
      );

  }

  getCalculatedBase(): Observable<ICode[]> {
    return this.calculatedBase$ = this._dataService
      .getData<ICodeAria>(this.calculatedBaseJsonPath)
      .pipe(
        shareReplay(1)
      );

  }

  getUnitMeasure(): Observable<ICode[]> {
    return this.unitMeasure$ = this._dataService
      .getData<ICodeAria>(this.unitMeasureJsonPath)
      .pipe(
        shareReplay(1)
      );

  }

  getUnitPresentation(): Observable<ICode[]> {
    return this.unitPresentation$ = this._dataService
      .getData<ICodeAria>(this.unitPresentationJsonPath)
      .pipe(
        shareReplay(1)
      );

  }



  getScheduleClaims(): Observable<ICodeDefinition[]> {
    return this.scheduleClaims$ = this._dataService
     .getData<ICodeAria>(this.scheduleClaimsJsonPath)
     .pipe(
       shareReplay(1)
     );
   }

   getDisinfectantTypes(): Observable<ICodeDefinition[]> {
    return this.disinfectantTypes$ = this._dataService
     .getData<ICodeAria>(this.disinfectantTypeJsonPath)
     .pipe(
       shareReplay(1)
     );
   }

   getDosageForms(): Observable<ICode[]> {
    return this.dosageForm$ = this._dataService
     .getData<ICodeAria>(this.dosageFormJsonPath)
     .pipe(
       shareReplay(1)
     );
   }
}
