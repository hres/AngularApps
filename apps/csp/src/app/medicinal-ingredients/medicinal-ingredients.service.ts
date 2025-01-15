import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionEnrol } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class MedicinalIngredientsService {

  constructor() { }

  public  getMedicinalIngredientsForm(fb: FormBuilder){

    if(!fb){
      return null;
    }

    const medicinalIngredientsForm  = fb.nonNullable.group({
      medicinalIngredients: new FormControl('',Validators.required),
      productName: new FormControl('',Validators.required)
    })
    return medicinalIngredientsForm;
  }


  public mapFormModelToDataModel(formValue: any, transactionEnrol: TransactionEnrol) {
    transactionEnrol.medicinalIngredients.medicinalIngredient = formValue['medicinalIngredients'];
    transactionEnrol.medicinalIngredients.productName = formValue['productName'];
    }

  public mapDataModelToFormModel(transactionEnrol: TransactionEnrol, formRecord: FormGroup) {
    formRecord.controls['medicinalIngredients'].setValue(transactionEnrol.medicinalIngredients.medicinalIngredient);
    formRecord.controls['productName'].setValue(transactionEnrol.medicinalIngredients.productName);
   }
}
