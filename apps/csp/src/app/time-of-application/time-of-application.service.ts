import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ENGLISH, UtilsService } from '@hpfb/sdk/ui';
import { Ectd, TransactionEnrol } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TimeOfApplicationService {

  private _currLanguage: string = ENGLISH;

  constructor( private _utilsService: UtilsService) { }



  getTimeOfApplicationForm(fb: FormBuilder) {
    if (!fb) {
      return null;
   }
   const timeOfApplicationForm = fb.nonNullable.group({
     timmingOfApplicant: new FormControl(null, Validators.required)
     });
    return timeOfApplicationForm;
  }

  public mapFormModelToDataModel(formValue: any, transactionEnrol: TransactionEnrol) {

    transactionEnrol.timmingOfApplicant = formValue['timmingOfApplicant'];
    }

  public mapDataModelToFormModel(transactionEnrol: TransactionEnrol, formRecord: FormGroup) {

    formRecord.controls['timmingOfApplicant'].setValue(transactionEnrol.timmingOfApplicant);
   }
}
