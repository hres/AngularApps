import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CertDetails } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {

  constructor() { }

  public  getCertificationForm(fb: FormBuilder){

    if(!fb){
      return null;
    }

    const certificationForm  = fb.nonNullable.group({
      firstName: new FormControl(null,Validators.required),
      initials: new FormControl(null),
      lastName: new FormControl(null,Validators.required),
      jobTitle: new FormControl(null,Validators.required),
      date: new FormControl(null,Validators.required)

    })
    return certificationForm;
  }


  public mapFormModelToDataModel(formValue: any, certModel: CertDetails) {
    certModel.given_name = formValue['firstName'];
    certModel.initials = formValue['initials'];
    certModel.surname = formValue['lastName'];
    certModel.job_title = formValue['jobTitle'];
    certModel.date_signed = formValue['date'];
  }

  public mapDataModelToFormModel(certModel: CertDetails, formRecord: FormGroup) {
    formRecord.controls['firstName'].setValue(certModel.given_name);
    formRecord.controls['initials'].setValue(certModel.initials);
    formRecord.controls['lastName'].setValue(certModel.surname);
    formRecord.controls['jobTitle'].setValue(certModel.job_title);
    formRecord.controls['date'].setValue(certModel.date_signed);
  }
}
