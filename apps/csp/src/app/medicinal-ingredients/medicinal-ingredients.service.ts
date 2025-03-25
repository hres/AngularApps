import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IMedicalInformation, TransactionEnrol } from '../models/transaction';

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
    transactionEnrol.application_info.medicinal_ingredient = formValue['medicinalIngredients'];
    transactionEnrol.application_info.product_name = formValue['productName'];
    }

  public mapDataModelToFormModel(medicinalIngredients: string, product_name: string, formRecord: FormGroup) {
    formRecord.controls['medicinalIngredients'].setValue(medicinalIngredients);
    formRecord.controls['productName'].setValue(product_name);
   }
}
