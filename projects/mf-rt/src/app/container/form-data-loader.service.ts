import {Injectable} from '@angular/core';
import {Observable, shareReplay} from 'rxjs';
import { DATA_PATH } from '../app.constants';
import { ICode } from '@hpfb/sdk/ui/data-loader/data';
import { DataLoaderService } from '@hpfb/sdk/ui';

@Injectable()
export class FormDataLoaderService {

  private countriesJsonPath = DATA_PATH + 'countries.json';
  
  cachedCountries$:Observable<ICode[]>;

  constructor(private _dataService: DataLoaderService) {}

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
   
}