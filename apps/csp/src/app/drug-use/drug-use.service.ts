import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DrugUseService {

  constructor() {}

  public getDrugUseForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   const drugUseForm = fb.nonNullable.group({
     drugUse: new FormControl(null, Validators.required)
     });
    return drugUseForm;

  }
}
