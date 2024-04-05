import { Injectable, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class MaterialService {
  errors = signal([]);

  public createMaterialFormGroup(fb: FormBuilder) : FormGroup | null {
    if (!fb) {
      return null;
    }

    return fb.group({
      id: -1,
      isNew: true,
      expandFlag: true,
      lastSavedState: null, // store the last saved state of the contactInfo for reverting function
      materialInfo: fb.group({
        materialName: ['', Validators.required],
        deviceName: ['', Validators.required],
        originCountry: [null, []],
        specFamily: [null, Validators.required],
        tissueType: [null, []],
        tissueTypeOtherDetails: ['', []],
        derivative: [null, []],
        derivativeOtherDetails: ['', []],
      }, { updateOn: 'blur' }
      )
    });
  }
}