import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConverterService, ENGLISH, UtilsService } from '@hpfb/sdk/ui';
import { Ectd, TransactionEnrol } from '../models/transaction';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class AttestationService {

  private _currLanguage: string = ENGLISH;

  constructor( private _utilsService: UtilsService,private _converterService: ConverterService) { }



  getAttestationForm(fb: FormBuilder) {
    if (!fb) {
      return null;
   }
   const AttestationForm = fb.nonNullable.group({
     attestationAsApplicant: new FormControl(null, Validators.required),
     attestationAsSubmission: new FormControl(null, Validators.required),
     marketing_application_date: new FormControl(''),
     marketing_country: new FormControl('')
     });
    return AttestationForm;
  }

  public mapFormModelToDataModel(formValue: any, transactionEnrol: TransactionEnrol, lang, countries) {
    transactionEnrol.application_info.applicant_statement = formValue['attestationAsApplicant'];
    transactionEnrol.timely_submission_info.timely_submission_statement = formValue['attestationAsSubmission'];
    transactionEnrol.timely_submission_info.marketing_country = formValue['marketing_country']? this._converterService.findAndConverCodeToIdTextLabel(countries, formValue['marketing_country'], lang): null;
    transactionEnrol.timely_submission_info.marketing_application_date = formValue['marketing_application_date'];
   }

  public mapDataModelToFormModel(transactionEnrol: TransactionEnrol, formRecord: FormGroup) {
    formRecord.controls['attestationAsApplicant'].setValue(transactionEnrol.application_info.applicant_statement);
    formRecord.controls['attestationAsSubmission'].setValue(transactionEnrol.timely_submission_info.timely_submission_statement );
    formRecord.controls['marketing_country'].setValue(transactionEnrol.timely_submission_info.marketing_country);
    formRecord.controls['marketing_application_date'].setValue(transactionEnrol.timely_submission_info.marketing_application_date);
   }
}
