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

      medicinalIngredients: new FormControl(null,Validators.required)

    })
    return medicinalIngredientsForm;
  }


  public mapFormModelToDataModel(formValue: any, transactionEnrol: TransactionEnrol) {

    transactionEnrol.medicinalIngredients = formValue['medicinalIngredients'];
    }

  public mapDataModelToFormModel(transactionEnrol: TransactionEnrol, formRecord: FormGroup) {

    formRecord.controls['medicinalIngredients'].setValue(transactionEnrol.medicinalIngredients);
   }
}
