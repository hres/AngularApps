import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionEnrol } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class NewDrugSubmissionInformationService {

  constructor() { }

  public  getNewDrugSubmissionInforForm(fb: FormBuilder){

    if(!fb){
      return null;
    }

    const newDrugSubmissionInfoForm = fb.nonNullable.group({
     ndsNumber: new FormControl(null, Validators.required)
         });
     return newDrugSubmissionInfoForm

    }

    public mapFormModelToDataModel(formValue: any, transactionEnrol: TransactionEnrol) {

      transactionEnrol.ndsNumber = formValue['ndsNumber'];
      }

    public mapDataModelToFormModel(transactionEnrol: TransactionEnrol, formRecord: FormGroup) {

      formRecord.controls['ndsNumber'].setValue(transactionEnrol.ndsNumber);
     }



}
