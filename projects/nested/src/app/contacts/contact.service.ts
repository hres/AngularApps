import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../../../dist/hpfb/sdk/ui';
import { ContactStatus } from '@hpfb/sdk/ui';

@Injectable()
export class ContactService {

  public createContactFormGroup(fb: FormBuilder, isInternal: boolean) : FormGroup | null {
    if (!fb) {
      return null;
    }

    return fb.group({
      id: -1,
      isNew: true,
      expandFlag: true,
      contactInfo: fb.group({
        status: [ContactStatus.New],
        fullName: ['', Validators.required],
        jobTitle: ['', Validators.required],
        lastSavedState: null // store the last saved state of the contactInfo for reverting function
      }, { updateOn: 'blur' })
    });
  }
}
