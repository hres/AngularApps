import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { identityRevealedValidator } from '../crossFieldValidator';
import { IApplicant } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {

  constructor() {}

  public static getApplicantInformationForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   const applicantForm = fb.nonNullable.group({
     applicantName: new FormControl(null, Validators.required),
     craBusinessNumber: new FormControl(null),
     cspNumber: new FormControl(null, Validators.required),
     agentName: new FormControl(null),
     
    },);
    return applicantForm;
  }



  public mapFormModelToDataModel(formValue: any, applicantModel: IApplicant) {


    applicantModel.applicantName = formValue['applicantName'];
    applicantModel.craBusinessNumber = formValue['craBusinessNumber'];
    applicantModel.cspNumber = formValue['cspNumber'];
    applicantModel.agentName = formValue['agentName'];
  }

  public mapDataModelToFormModel(applicantModel: IApplicant, formRecord: FormGroup) {

    formRecord.controls['applicantName'].setValue(applicantModel.applicantName);
    formRecord.controls['craBusinessNumber'].setValue(applicantModel.craBusinessNumber);
    formRecord.controls['cspNumber'].setValue(applicantModel.cspNumber);
    formRecord.controls['agentName'].setValue(applicantModel.agentName);
   }


}
