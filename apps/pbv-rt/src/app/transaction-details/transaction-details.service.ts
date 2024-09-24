import { Injectable } from '@angular/core';
import { UtilsService, ConverterService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable()
export class TransactionDetailsService {

  constructor(private _utilsService: UtilsService, private _converterService: ConverterService, private _globalService: GlobalService) {
  }

  public getTransctionDetailsForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   return fb.group({
    controlNumber: [
      null,
      [Validators.required],
    ]
   });
  }
}
