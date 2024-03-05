import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class GeneralInfoService {

  public createGeneralInfoFormGroup(fb: FormBuilder) : FormGroup | null {
    if (!fb) {
      return null;
    }

    return fb.group({
      companyName: [null, Validators.required],
    });
  }
}