import {Injectable} from '@angular/core';
import {Observable, map, shareReplay, tap} from 'rxjs';
import { DATA_PATH } from '../app.constants';
import { DataLoaderService } from '@hpfb/sdk/ui';
import { ICode, ICodeDefinition, IKeyword } from '@hpfb/sdk/ui/data-loader/data';

@Injectable()
export class FormDataLoaderService {

  private complianceJsonPath = DATA_PATH + 'compliance.json';
  private derivativeJsonPath = DATA_PATH + 'derivative.json';
  private deviceClassesJsonPath = DATA_PATH + 'deviceClasses.json';
  private deviceSpeciesJsonPath = DATA_PATH + 'deviceSpecies.json';
  private deviceTissueJsonPath = DATA_PATH + 'deviceTissue.json';
  private dinOrNpnJsonPath = DATA_PATH + 'dinOrNpn.json';
  private licenceAppTypeJsonPath = DATA_PATH + 'licenceAppType.json';
  private mdAuditProgramJsonPath = DATA_PATH + 'mdAuditProgram.json';
  private provisionMDRJsonPath = DATA_PATH + 'provisionMDR.json';
  private regActivityTypeJsonPath = DATA_PATH + 'regActivityType.json';


  cachedCompliance$:Observable<ICode[]>;
  cachedDerivative$:Observable<ICode[]>;
  cachedDeviceClasses$:Observable<ICode[]>;
  cachedDeviceSpecies$:Observable<ICode[]>;
  cachedDeviceTissues$:Observable<ICode[]>;
  cachedDinOrNpn$:Observable<ICode[]>;
  cachedLicenceAppType$:Observable<ICode[]>;
  cachedMdAuditProgram$:Observable<ICode[]>;
  cachedProvisionMDR$:Observable<ICode[]>;
  cachedRegActivityType$:Observable<ICode[]>;


  constructor(private _dataService: DataLoaderService) {}

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
    if (!this.cachedDerivative$) {
        this.cachedDerivative$ = this._dataService.getData<ICode>(this.derivativeJsonPath)
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
    if (!this.cachedDeviceSpecies$) {
        this.cachedDeviceSpecies$ = this._dataService.getData<ICode>(this.deviceSpeciesJsonPath)
          .pipe(
            // tap(()=>console.log('getDeviceClassesList() is called')),
            shareReplay(1)
          );
      } 
      return this.cachedDeviceSpecies$;
  }

  getDeviceTissueList(): Observable<ICode[]> {
    if (!this.cachedDeviceTissues$) {
        this.cachedDeviceTissues$ = this._dataService.getData<ICode>(this.deviceTissueJsonPath)
          .pipe(
            // tap(()=>console.log('getDeviceClassesList() is called')),
            shareReplay(1)
          );
      } 
      return this.cachedDeviceTissues$;
  }

  getDinOrNpnList(): Observable<ICode[]> {
    if (!this.cachedDinOrNpn$) {
        this.cachedDinOrNpn$ = this._dataService.getData<ICode>(this.dinOrNpnJsonPath)
          .pipe(
            // tap(()=>console.log('getDeviceClassesList() is called')),
            shareReplay(1)
          );
      } 
      return this.cachedDinOrNpn$;
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

  getProvisionMdrList(): Observable<ICode[]> {
    if (!this.cachedProvisionMDR$) {
        this.cachedProvisionMDR$ = this._dataService.getData<ICode>(this.provisionMDRJsonPath)
          .pipe(
            // tap(()=>console.log('getDeviceClassesList() is called')),
            shareReplay(1)
          );
      } 
      return this.cachedProvisionMDR$;
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

}