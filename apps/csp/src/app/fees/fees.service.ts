import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FeeDetails } from '../models/transaction';
import { TransactionEnrol } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class FeesService {

  constructor() { }

  public  getFeesForm(fb: FormBuilder){

    if(!fb){
      return null;
    }

    const feesForm  = fb.nonNullable.group({
      feeAmount: new FormControl(null, Validators.required),
      payMethod: new FormControl(null, Validators.required),

    })
    return feesForm;
  }


  public mapFormModelToDataModel(formValue: any, feeModel: FeeDetails) {
    feeModel.feeAmount = formValue['feeAmount'];
    feeModel.payMethod = formValue['payMethod'];
    }

  public mapDataModelToFormModel(feeModel: FeeDetails, formRecord: FormGroup) {
    formRecord.controls['feeAmount'].setValue(feeModel.feeAmount);
    formRecord.controls['payMethod'].setValue(feeModel.payMethod);
   }
}
