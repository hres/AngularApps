import { Injectable } from '@angular/core';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { DATA_PATH } from '../app.constants';
import {
  DataLoaderService,
  ICode,
  ICodeAria,
  IKeyword,
  UtilsService,
} from '@hpfb/sdk/ui';

@Injectable()
export class FormDataLoaderService {
  
  private countriesJsonPath = DATA_PATH + 'csp_eucountries.json';
  private provincesJsonPath = DATA_PATH + 'provinces.json';
  private statesJsonPath = DATA_PATH + 'states.json';
  private drugUseJsonPath = DATA_PATH + 'druguses.json';
  private timingOfApplicantPath = DATA_PATH + 'timingOfApplicant.json';
  private payMethodJsonPath = DATA_PATH + 'methodOfPayment.json';
  private keywordsJsonPath = DATA_PATH + 'keywords.json';
  private AttestationJsonPath = DATA_PATH + 'attestation.json';
  private AttestationForSubmissionJsonPath =
    DATA_PATH + 'attestationASSubmission.json';
  private countryMappingJsonPath = DATA_PATH + 'countryIdMapping.json';
  private allCountriesJsonPath = DATA_PATH + 'csp_all_countries.json';

  cachedLanguageList$: Observable<ICode[]>;
  cachedYesNo$: Observable<ICode[]>;
  cachedWhoResponsible$: Observable<ICode[]>;
  cachedCountries$: Observable<ICode[]>;
  cachedAllCountries$: Observable<ICode[]>;
  cachedProvinces$: Observable<ICode[]>;
  cachedStates$: Observable<ICode[]>;
  drugUseOptions$: Observable<ICode[]>;
  timingOfApplicantTypes$: Observable<ICodeAria[]>;
  payMethodOptions$: Observable<ICode[]>;
  attestationAsApplicantOptions$: Observable<ICode[]>;
  attestationAsSubmissionOptions$: Observable<ICode[]>;
  countryIdMapping$: Observable<any[]>;

  constructor(
    private _dataService: DataLoaderService,
    private _utilsService: UtilsService
  ) {}

  getCountryList(lang: string): Observable<ICode[]> {

    if (!this.cachedCountries$) {
      this.cachedCountries$ = this._dataService
        .getSortedDataAccents<ICode>(
          this.countriesJsonPath,
          this._utilsService.getCompareFields(false, lang)
        )
        .pipe(
           tap(()=>console.log('getCountryList() is called')),
          shareReplay(1)
        );
    }
    return this.cachedCountries$;
  }

  getAllCountryList(lang: string): Observable<ICode[]> {

    if (!this.cachedAllCountries$) {
      this.cachedAllCountries$ = this._dataService
        .getSortedDataAccents<ICode>(
          this.allCountriesJsonPath,
          this._utilsService.getCompareFields(false, lang)
        )
        .pipe(
           tap(()=>console.log('getAllCountryList() is called')),
          shareReplay(1)
        );
    }
    return this.cachedAllCountries$;
  }

  getProvinceList(lang: string): Observable<ICode[]> {
    if (!this.cachedProvinces$) {
      this.cachedProvinces$ = this._dataService
        .getSortedDataAccents<ICode>(
          this.provincesJsonPath,
          this._utilsService.getCompareFields(false, lang)
        )
        .pipe(
          // tap(()=>console.log('getProvinceList() is called')),
          shareReplay(1)
        );
    }
    return this.cachedProvinces$;
  }

  getStateList(lang: string): Observable<ICode[]> {
    if (!this.cachedStates$) {
      this.cachedStates$ = this._dataService
        .getSortedDataAccents<ICode>(
          this.statesJsonPath,
          this._utilsService.getCompareFields(false, lang)
        )
        .pipe(
          // tap(()=>console.log('getStateList() is called')),
          shareReplay(1)
        );
    }
    return this.cachedStates$;
  }

  getDrugUesOptions(lang: string): Observable<ICode[]> {
    this.drugUseOptions$ = this._dataService
      .getData<ICodeAria>(this.drugUseJsonPath)
      .pipe(shareReplay(1));
    return this.drugUseOptions$;
  }

  getTimingOfApplicantTypes(): Observable<ICodeAria[]> {
    this.timingOfApplicantTypes$ = this._dataService
      .getData<ICodeAria>(this.timingOfApplicantPath)
      .pipe(shareReplay(1));
    return this.timingOfApplicantTypes$;
  }

  getPayMethodOptions(lang: string): Observable<ICode[]> {
    this.payMethodOptions$ = this._dataService
      .getData<ICodeAria>(this.payMethodJsonPath)
      .pipe(shareReplay(1));
    return this.payMethodOptions$;
  }

  getLanguageList(): Observable<ICode[]> {
    if (!this.cachedLanguageList$) {
      this.cachedLanguageList$ = this._dataService
        .getData<IKeyword>(this.keywordsJsonPath)
        .pipe(
          map((keywords) => {
            return (
              keywords.find((keyword) => keyword.name === 'languages')?.data ||
              []
            );
          }),
          // tap(()=>console.log('getKeywordList() is called')),
          shareReplay(1)
        );
    }
    return this.cachedLanguageList$;
  }

  getAttestationAsApplicant(lang: string): Observable<ICode[]> {
    this.attestationAsApplicantOptions$ = this._dataService
      .getData<ICodeAria>(this.AttestationJsonPath)
      .pipe(shareReplay(1));
    return this.attestationAsApplicantOptions$;
  }

  getAttestationAsSubmission(lang: string): Observable<ICode[]> {
    this.attestationAsSubmissionOptions$ = this._dataService
      .getData<ICodeAria>(this.AttestationForSubmissionJsonPath)
      .pipe(shareReplay(1));
    return this.attestationAsSubmissionOptions$;
  }

  getCountryIdMapping(): Observable<any[]> {
    if (!this.countryIdMapping$) {
      this.countryIdMapping$ = this._dataService
        .getData<any>(this.countryMappingJsonPath)
        .pipe(shareReplay(1));
    }
    return this.countryIdMapping$;
  }
}
