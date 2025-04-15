import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConverterService, ENGLISH, ICode, UtilsService } from '@hpfb/sdk/ui';
import { Ectd, IAttestationInfomation, TransactionEnrol } from '../models/transaction';
import { AttestationTypeForSubmission } from './AttestationEnum';

@Injectable({
  providedIn: 'root'
})
export class AttestationService {

  constructor( private _converterService: ConverterService) { }

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

  public mapDataModelToFormModel(attestationModel: IAttestationInfomation, formRecord: FormGroup, countryOptions: ICode[] ) {
    formRecord.controls['attestationAsApplicant'].setValue(attestationModel.attestationAsApplicant);
    formRecord.controls['attestationAsSubmission'].setValue(attestationModel.attestationAsSubmission.timely_submission_statement);
    if(AttestationTypeForSubmission.grandEn == attestationModel.attestationAsSubmission.timely_submission_statement || AttestationTypeForSubmission.grandEn == attestationModel.attestationAsSubmission.timely_submission_statement){
    formRecord.controls['marketing_country'].setValue(this.findIdOfDrugUse(attestationModel.attestationAsSubmission.marketing_country._label_en, countryOptions));
    formRecord.controls['marketing_application_date'].setValue(attestationModel.attestationAsSubmission.marketing_application_date);
    }
   }

   private findIdOfDrugUse(label: string,  countryOptions: ICode[] ): string {
    let id: string = null;
    if (countryOptions != null && countryOptions.length > 0) {
      for (let country of countryOptions) {
        if (label === country.en || label === country.fr) {
          id = country.id;
          break;
        }
      }
    }
    return id;
  }
}
