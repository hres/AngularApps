import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConverterService, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { ICspInfomation, TransactionEnrol } from '../models/transaction';
import { DatePipe } from '@angular/common';

@Injectable()
export class CertSuppProtectService {

  constructor(private _globalService: GlobalService, private _converterService: ConverterService, private _utilsService: UtilsService,  private _fb: FormBuilder,  private datepipe: DatePipe) {}

  // showDateAndRequesterTxDescs: string[] = ['12','13', '14'];

  public  getRegularInfoForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   return fb.group({
     enrollVersion: ['0.0'],
     dateLastSaved: [this.datepipe.transform(new Date( new Date(Date.now())), 'yyyy-MM-dd')],
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


  public mapFormModelToDataModel(transactionEnrol: TransactionEnrol,  cspiModel: ICspInfomation, certSuppProtectForm: FormGroup  ) {
     transactionEnrol.enrolment_version =this.getUpdateEnrolmentVersion(cspiModel.enrollVersion);
     transactionEnrol.date_saved = certSuppProtectForm.value['dateLastSaved'];
     cspiModel.dateLastSaved = transactionEnrol.date_saved;
     cspiModel.enrollVersion = transactionEnrol.enrolment_version;
     certSuppProtectForm.patchValue({dateLastSaved:    cspiModel.dateLastSaved});
     certSuppProtectForm.patchValue({enrollVersion: transactionEnrol.enrolment_version});
  }

  public mapDataModelToFormModel(cerSuppProtectModel: ICspInfomation, formRecord: FormGroup) {
    formRecord.controls['enrollVersion'].setValue(cerSuppProtectModel.enrollVersion);
    formRecord.controls['dateLastSaved'].setValue(cerSuppProtectModel.dateLastSaved);
  }

}
