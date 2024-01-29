import {Injectable} from '@angular/core';
import {Observable, map, shareReplay, tap} from 'rxjs';
import { DATA_PATH } from '../app.constants';
import { ICode, ICodeDefinition, IKeyword } from '@hpfb/sdk/ui/data-loader/data';
import { DataLoaderService } from '@hpfb/sdk/ui';

@Injectable()
export class FormDataLoaderService {

  private keywordsJsonPath = DATA_PATH + 'keywords.json';
  private deviceClassesJsonPath = DATA_PATH + 'deviceClasses.json';
  private regulatoryActivityTypesJsonPath = DATA_PATH + 'regulatoryActivityTypes.json';
  private transDescsJsonPath = DATA_PATH + 'transactionDescriptions.json';
  private raTypeTxDescJsonPath = DATA_PATH + 'raTypeTxDescription.json';
  private amendReasonsJsonPath = DATA_PATH + 'amendReasons.json';
  private amendReasonRelationshipJsonPath = DATA_PATH + 'raTypeDeviceClassAmendReason.json';
  
  cachedKeywords$:Observable<ICode[]>;
  cachedDeviceClasses$:Observable<ICode[]>;
  cachedRegulatoryActivityTypes$:Observable<ICode[]>;
  cachedTransDescs$:Observable<ICode[]>;
  cachedRaTypeTxDesc$: Observable<any[]>;
  cachedAmendReasons$:Observable<ICode[]>;
  cachedAmendReasonRelationship$:Observable<ICode[]>;

  constructor(private _dataService: DataLoaderService) {}

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
