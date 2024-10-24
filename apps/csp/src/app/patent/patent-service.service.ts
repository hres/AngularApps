import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { identityRevealedValidator } from '../crossFieldValidator';

@Injectable({
  providedIn: 'root'
})
export class PatentService {

  constructor() {}

  public static getPatentInformationForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   const heroForm = fb.nonNullable.group({
     patentNumber: new FormControl(null, Validators.required),
     patentFillingDate: new FormControl(null, Validators.required),
     patentGrandDate: new FormControl(null, Validators.required),
     patendExpirationDate: new FormControl(null, Validators.required),
    },{ validators: identityRevealedValidator });
    return heroForm;

  }


}
