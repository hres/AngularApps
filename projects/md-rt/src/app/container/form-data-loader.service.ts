import {Injectable} from '@angular/core';
import {Observable, map, shareReplay, tap} from 'rxjs';
import { DATA_PATH } from '../app.constants';
import { DataLoaderService } from '@hpfb/sdk/ui';
import { ICode, ICodeDefinition, IKeyword } from '@hpfb/sdk/ui/data-loader/data';

@Injectable()
export class FormDataLoaderService {

  private deviceClassesJsonPath = DATA_PATH + 'deviceClasses.json';
  private regulatoryActivityTypesJsonPath = DATA_PATH + 'regulatoryActivityTypes.json';
  private transDescsJsonPath = DATA_PATH + 'transactionDescriptions.json';
  private raTypeTxDescJsonPath = DATA_PATH + 'raTypeTxDescription.json';
  private amendReasonsJsonPath = DATA_PATH + 'amendReasons.json';
  private amendReasonRelationshipJsonPath = DATA_PATH + 'raTypeDeviceClassAmendReason.json';
  
  cachedDeviceClasses$:Observable<ICode[]>;
  cachedRegulatoryActivityTypes$:Observable<ICode[]>;
  cachedTransDescs$:Observable<ICode[]>;
  cachedRaTypeTxDesc$: Observable<any[]>;
  cachedAmendReasons$:Observable<ICode[]>;
  cachedAmendReasonRelationship$:Observable<ICode[]>;

  constructor(private _dataService: DataLoaderService) {}

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
  
  getRegulatoryActivityTypesList(): Observable<ICode[]> {
    if (!this.cachedRegulatoryActivityTypes$) {
      this.cachedRegulatoryActivityTypes$ = this._dataService.getData<ICode>(this.regulatoryActivityTypesJsonPath)
        .pipe(
          // tap(()=>console.log('getRegulatoryActivityTypesList() is called')),
          shareReplay(1)
        );
    } 
    return this.cachedRegulatoryActivityTypes$;
  }

  getTransactionDescriptionList(): Observable<ICode[]> {
    if (!this.cachedTransDescs$) {
      this.cachedTransDescs$ = this._dataService.getData<ICode>(this.transDescsJsonPath)
        .pipe(
          shareReplay(1)
        );
    } 
    return this.cachedTransDescs$;
  }

  getActivityTypeAndTransactionDescription(): Observable<any[]> {
    if (!this.cachedRaTypeTxDesc$) {
      this.cachedRaTypeTxDesc$ = this._dataService.getData<ICode>(this.raTypeTxDescJsonPath)
        .pipe(
          shareReplay(1)
        );
    } 
    return this.cachedRaTypeTxDesc$;
  }

  getAmendReasonList(): Observable<ICode[]> {
    if (!this.cachedAmendReasons$) {
      this.cachedAmendReasons$ = this._dataService.getData<ICode>(this.amendReasonsJsonPath)
        .pipe(
          shareReplay(1)
        );
    } 
    return this.cachedAmendReasons$;
  }

  getAmendReasonRelationship(): Observable<ICode[]> {
    if (!this.cachedAmendReasonRelationship$) {
      this.cachedAmendReasonRelationship$ = this._dataService.getData<ICode>(this.amendReasonRelationshipJsonPath)
        .pipe(
          shareReplay(1)
        );
    } 
    return this.cachedAmendReasonRelationship$;
  }

   
}
