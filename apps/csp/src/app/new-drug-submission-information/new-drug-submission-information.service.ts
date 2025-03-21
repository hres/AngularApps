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
     ndsNumber: new FormControl(null, [Validators.required, Validators.minLength(6)])
         });
     return newDrugSubmissionInfoForm

    }

    public mapFormModelToDataModel(formValue: any, transactionEnrol: TransactionEnrol) {

      transactionEnrol.application_info.control_number = formValue['ndsNumber'];
      }

    public mapDataModelToFormModel(controlNumber: string, formRecord: FormGroup) {
      formRecord.controls['ndsNumber'].setValue(controlNumber);
     }



}
