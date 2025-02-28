import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ENGLISH, UtilsService } from '@hpfb/sdk/ui';
import { Ectd, TransactionEnrol } from '../models/transaction';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class AttestationService {

  private _currLanguage: string = ENGLISH;

  constructor( private _utilsService: UtilsService) { }



  getAttestationForm(fb: FormBuilder) {
    if (!fb) {
      return null;
   }
   const AttestationForm = fb.nonNullable.group({
     attestationAsApplicant: new FormControl(null, Validators.required)
     });
    return AttestationForm;
  }

  public mapFormModelToDataModel(formValue: any, transactionEnrol: TransactionEnrol) {

    transactionEnrol.application_info.attestation_applicant = formValue['attestationAsApplicant'];
    }

  public mapDataModelToFormModel(transactionEnrol: TransactionEnrol, formRecord: FormGroup) {

    formRecord.controls['attestationAsApplicant'].setValue(transactionEnrol.application_info.attestation_applicant);
   }
}
