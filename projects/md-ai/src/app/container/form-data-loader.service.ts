import {Injectable} from '@angular/core';
import {Observable, map, shareReplay, tap} from 'rxjs';
import { DATA_PATH } from '../app.constants';
import { DataLoaderService, UtilsService } from '@hpfb/sdk/ui';
import { ICode, ICodeDefinition, IKeyword, SortOn } from '@hpfb/sdk/ui/data-loader/data';
import { GlobalService } from '../global/global.service';

@Injectable()
export class FormDataLoaderService {

  private complianceJsonPath = DATA_PATH + 'compliance.json';
  private derivativeJsonPath = DATA_PATH + 'derivative.json';
  private deviceClassesJsonPath = DATA_PATH + 'deviceClasses.json';
  private deviceSpeciesJsonPath = DATA_PATH + 'deviceSpecies.json';
  private deviceTissueJsonPath = DATA_PATH + 'deviceTissue.json';
  private rawDrugTypeJsonPath = DATA_PATH + 'rawDrugType.json';
  private licenceAppTypeJsonPath = DATA_PATH + 'licenceAppType.json';
  private mdAuditProgramJsonPath = DATA_PATH + 'mdAuditProgram.json';
  private regActivityTypeJsonPath = DATA_PATH + 'regActivityType.json';
  private keywordsJsonPath = DATA_PATH + 'keywords.json';
  private diagnosisReasonJsonPath = DATA_PATH + 'priorityRev.json';
  private countryJsonPath = DATA_PATH + 'countries.json';

  cachedCompliance$:Observable<ICode[]>;
  cachedDerivative$:Observable<ICode[]>;
  cachedDeviceClasses$:Observable<ICode[]>;
  cachedDeviceSpecies$:Observable<ICode[]>;
  cachedDeviceTissues$:Observable<ICode[]>;
  cachedRawDrugType$:Observable<ICode[]>;
  cachedLicenceAppType$:Observable<ICode[]>;
  cachedMdAuditProgram$:Observable<ICode[]>;
  cachedRegActivityType$:Observable<ICode[]>;
  cachedKeywords$:Observable<ICode[]>;
  cachedDiagnosisReason$:Observable<ICode[]>;
  cachedCountries$: Observable<ICode[]>;


  constructor(private _dataService: DataLoaderService,
              private _globalService: GlobalService,
              private _utilsService: UtilsService) {}

  getYesNoList(): Observable<ICode[]> {
    if (!this.cachedKeywords$) {
      this.cachedKeywords$ = this._dataService.getData<IKeyword>(this.keywordsJsonPath)
        .pipe(
          map(keywords => {
            return keywords.find(keyword => keyword.name === 'yesno')?.data || [];
          }),
          // tap(()=>console.log('getKeywordList() is called')),
          shareReplay(1)
        );
    } 
    return this.cachedKeywords$;
  }

  getComplianceList(): Observable<ICode[]> {
    if (!this.cachedCompliance$) {
        this.cachedCompliance$ = this._dataService.getData<ICode>(this.complianceJsonPath)
          .pipe(
            // tap(()=>console.log('getDeviceClassesList() is called')),
            shareReplay(1)
          );
      } 
      return this.cachedCompliance$;
  }

  getDerivativeList(): Observable<ICode[]> {
    const compareField: SortOn = this.getCompareField();
    if (!this.cachedDerivative$) {
        this.cachedDerivative$ = this._dataService.getSortedDataAccents<ICode>(this.derivativeJsonPath, compareField)
          .pipe(
            // tap(()=>console.log('getDeviceClassesList() is called')),
            shareReplay(1)
          );
      } 
      return this.cachedDerivative$;
  }

  getDeviceClassesList(): Observable<ICode[]> {
    if (!this.cachedDeviceClasses$) {
      this.cachedDeviceClasses$ = this._dataService.getData<ICode>(this.deviceClassesJsonPath)
        .pipe(
          // tap(()=>console.log('getDeviceClassesList() is called')),
          shareReplay(1)
        );
    } 
    return this.cachedDeviceClasses$;
  }

  getDeviceSpeciesList(): Observable<ICode[]> {
    const compareField: SortOn = this.getCompareField();
    if (!this.cachedDeviceSpecies$) {
        this.cachedDeviceSpecies$ = this._dataService.getSortedDataAccents<ICode>(this.deviceSpeciesJsonPath, compareField)
          .pipe(
            // tap(()=>console.log('getDeviceClassesList() is called')),
            shareReplay(1)
          );
      } 
      return this.cachedDeviceSpecies$;
  }

  getDeviceTissueList(): Observable<ICode[]> {
    const compareField: SortOn = this.getCompareField();
    if (!this.cachedDeviceTissues$) {
        this.cachedDeviceTissues$ = this._dataService.getSortedDataAccents<ICode>(this.deviceTissueJsonPath, compareField)
          .pipe(
            // tap(()=>console.log('getDeviceClassesList() is called')),
            shareReplay(1)
          );
      } 
      return this.cachedDeviceTissues$;
  }

  getRawDrugType(): Observable<ICode[]> {
    if (!this.cachedRawDrugType$) {
        this.cachedRawDrugType$ = this._dataService.getData<ICode>(this.rawDrugTypeJsonPath)
          .pipe(
            // tap(()=>console.log('getDeviceClassesList() is called')),
            shareReplay(1)
          );
      } 
      return this.cachedRawDrugType$;
  }

  getLicenceAppTypeList(): Observable<ICode[]> {
    if (!this.cachedLicenceAppType$) {
        this.cachedLicenceAppType$ = this._dataService.getData<ICode>(this.licenceAppTypeJsonPath)
          .pipe(
            // tap(()=>console.log('getDeviceClassesList() is called')),
            shareReplay(1)
          );
      } 
      return this.cachedLicenceAppType$;
  }

  getMdAuditProgramList(): Observable<ICode[]> {
    if (!this.cachedMdAuditProgram$) {
        this.cachedMdAuditProgram$ = this._dataService.getData<ICode>(this.mdAuditProgramJsonPath)
          .pipe(
            // tap(()=>console.log('getDeviceClassesList() is called')),
            shareReplay(1)
          );
      } 
      return this.cachedMdAuditProgram$;
  }

  getRegActivityTypeList(): Observable<ICode[]> {
    if (!this.cachedRegActivityType$) {
        this.cachedRegActivityType$ = this._dataService.getData<ICode>(this.regActivityTypeJsonPath)
          .pipe(
            // tap(()=>console.log('getDeviceClassesList() is called')),
            shareReplay(1)
          );
      } 
      return this.cachedRegActivityType$;
  }

  getDiagnosisReasonList(): Observable<ICode[]> {
    if (!this.cachedDiagnosisReason$) {
        this.cachedDiagnosisReason$ = this._dataService.getData<ICode>(this.diagnosisReasonJsonPath)
          .pipe(
            // tap(()=>console.log('getDeviceClassesList() is called')),
            shareReplay(1)
          );
      } 
      return this.cachedDiagnosisReason$;
  }

  getCountriesList(): Observable<ICode[]> {
    const compareField: SortOn = this.getCompareField();
    if (!this.cachedCountries$) {
        this.cachedCountries$ = this._dataService.getSortedDataAccents<ICode>(this.countryJsonPath, compareField)
          .pipe(
            // tap(()=>console.log('getDeviceClassesList() is called')),
            shareReplay(1)
          );
      } 
      return this.cachedCountries$;
  }

  // REPMDFORM-284, Alphabetize RA and Transaction Description drop-downs
  getCompareField():SortOn{
    const lang = this._globalService.getCurrLanguage();
    return this._utilsService.isFrench(lang) ? SortOn.FRENCH: SortOn.ENGLISH;
  }

}