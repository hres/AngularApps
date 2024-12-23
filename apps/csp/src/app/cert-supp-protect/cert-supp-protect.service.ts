import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConverterService, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { Ectd } from '../models/transaction';
import { GlobalService } from '../global/global.service';

@Injectable()
export class CertSuppProtectService {

  constructor(private _globalService: GlobalService, private _converterService: ConverterService, private _utilsService: UtilsService) {}

  // showDateAndRequesterTxDescs: string[] = ['12','13', '14'];

  public static getRegularInfoForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   return fb.group({
     enrollVersion: [''],
     dateLastSaved: [''],
   });
  }

 getUpdateEnrolmentVersion(currentEnrolmentVersion: string) {
    let newEnrolmentVersion;
    if (!currentEnrolmentVersion) {
      newEnrolmentVersion = "0.1";
    } else {
        var parts = currentEnrolmentVersion.split('.');
        var dec = parseInt(parts[1]);
        newEnrolmentVersion = parts[0] + "." + (dec + 1);
    }
    return newEnrolmentVersion;
};

}
