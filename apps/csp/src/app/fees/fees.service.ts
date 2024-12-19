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
      fee_amount: new FormControl(null, Validators.required),
      pay_method: new FormControl(null, Validators.required),

    })
    return feesForm;
  }


  public mapFormModelToDataModel(formValue: any, feeModel: FeeDetails) {
    feeModel.fee_amount = formValue['feeAmount'];
    feeModel.pay_method = formValue['payMethod'];
    }

  public mapDataModelToFormModel(feeModel: FeeDetails, formRecord: FormGroup) {
    formRecord.controls['fee_amount'].setValue(feeModel.fee_amount);
    formRecord.controls['fee_amount'].setValue(feeModel.fee_amount);
   }
}
