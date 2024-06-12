import {Injectable} from '@angular/core';
import {Observable, combineLatest, map, shareReplay, tap} from 'rxjs';
import { DATA_PATH } from '../app.constants';
import { ICode, ICodeAria, ICodeDefinition, IKeyword, IParentChildren, SortOn } from '@hpfb/sdk/ui/data-loader/data';
import { DataLoaderService } from '@hpfb/sdk/ui';

@Injectable()
export class FormDataLoaderService {

  private keywordsJsonPath = DATA_PATH + 'keywords.json';
  private countriesJsonPath = DATA_PATH + 'countries.json';
  private mfTypesJsonPath = DATA_PATH + 'mfTypes.json';
  private txDescriptionsJsonPath = DATA_PATH + 'txDescriptions.json';
  private mfUsesJsonPath = DATA_PATH + 'mfUses.json';
  
  cachedKeywords$:Observable<ICode[]>;
  cachedCountries$:Observable<ICode[]>;
  mfTypeOptions$: Observable<ICodeAria[]>;
  mfUseOptions$: Observable<ICode[]>;
  txDescs$: Observable<ICodeDefinition[]>;
  mfTypeTxDescOptions$: Observable<IParentChildren[]>;
  mfRevisedTypeTxDescOptions$: Observable<IParentChildren[]>;

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

  getCountriesList(): Observable<ICode[]> {
    if (!this.cachedCountries$) {
      this.cachedCountries$ = this._dataService.getData<ICode>(this.countriesJsonPath)
        .pipe(
          // tap(()=>console.log('getDeviceClassesList() is called')),
          shareReplay(1)
        );
    } 
    return this.cachedCountries$;
  }

  getMasterFileTypes(): Observable<ICodeAria[]> {
    this.mfTypeOptions$ = this._dataService
      .getData<ICodeAria>(this.mfTypesJsonPath)
      .pipe(
        //tap((_) => console.log('getMasterFileTypeOptions is executed')),
        shareReplay(1)
      );
    return this.mfTypeOptions$;
  }

  getTxDescriptions(): Observable<ICodeDefinition[]> {
    // store the shared observable in a private property and reusing it in subsequent calls
    if (!this.txDescs$) {
      this.txDescs$ = this._dataService
        .getSortedData<ICodeDefinition>(this.txDescriptionsJsonPath, SortOn.PRIORITY) 
        .pipe(
          // tap((_) => console.log('getTxDescriptions is executed')),
          shareReplay(1)
        );
    }
    return this.txDescs$;
  }
   
  getMasterFileTypeAndTransactionDescription(): Observable<IParentChildren[]> {
    const mfTypeAndTransactionDescription$ = this._dataService
      .getData<any>(DATA_PATH + 'mfTypeTxDescription.json')
      .pipe(
        // tap((data) =>
        //   console.log(
        //     'getMasterFileTypeAndTransactionDescription ~ typeDescription: ',
        //     JSON.stringify(data)
        //   )
        // ),
        // catchError(this._dataService.handleError)
      );


    this.mfTypeTxDescOptions$ = combineLatest([
      mfTypeAndTransactionDescription$,
      this.getTxDescriptions(),
    ]).pipe(
      map(([arr1, arr2]) => {
        return arr1.map((item) => ({
          parentId: item.mfId,
          children: arr2.filter((x) => {
            return item.descIds.includes(x.id);
          }),
        }));
      }),
      shareReplay(1)
    );

    return this.mfTypeTxDescOptions$;
  }


  getMasterFileRevisedTypeAndTransactionDescription(): Observable<IParentChildren[]> {
    const mfRevisedTypeAndTransactionDescription$ = this._dataService
      .getData<any>(DATA_PATH + 'mfRevisedTypeTxDescription.json')

    this.mfRevisedTypeTxDescOptions$ = combineLatest([
      mfRevisedTypeAndTransactionDescription$,
      this.getTxDescriptions(),
    ]).pipe(
      map(([arr1, arr2]) => {
        return arr1.map((item) => ({
          parentId: item.mfId,
          children: arr2.filter((x) => {
            return item.descIds.includes(x.id);
          }),
        }));
      }),
      shareReplay(1)
    );

    return this.mfRevisedTypeTxDescOptions$;
  }

  getMasterFileUses(): Observable<ICode[]> {
    this.mfUseOptions$ = this._dataService.getData<ICode>(this.mfUsesJsonPath).pipe(
      //tap((_) => console.log('getMasterFileUses is executed')),
      shareReplay(1)
    );
    return this.mfUseOptions$;
  }  

}