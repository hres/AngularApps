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
    certModel.firstName = formValue['firstName'];
    certModel.initials = formValue['initials'];
    certModel.lastName = formValue['lastName'];
    certModel.jobTitle = formValue['jobTitle'];
    certModel.date = formValue['date'];
  }

  public mapDataModelToFormModel(certModel: CertDetails, formRecord: FormGroup) {
    formRecord.controls['firstName'].setValue(certModel.firstName);
    formRecord.controls['initials'].setValue(certModel.initials);
    formRecord.controls['lastName'].setValue(certModel.lastName);
    formRecord.controls['jobTitle'].setValue(certModel.jobTitle);
    formRecord.controls['date'].setValue(certModel.date);
  }
}
