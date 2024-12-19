import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionEnrol } from '../models/transaction';

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
      certification: new FormControl(null,Validators.required)

    })
    return certificationForm;
  }


  public mapFormModelToDataModel(formValue: any, transactionEnrol: TransactionEnrol) {

    transactionEnrol.certification = formValue['certification'];
    }

  public mapDataModelToFormModel(transactionEnrol: TransactionEnrol, formRecord: FormGroup) {

    formRecord.controls['certification'].setValue(transactionEnrol.certification);
   }
}
