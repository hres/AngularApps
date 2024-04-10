import { Injectable, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '@hpfb/sdk/ui';

@Injectable()
export class DeviceService {
  errors = signal([]);

  public createDeviceFormGroup(fb: FormBuilder) : FormGroup | null {
    if (!fb) {
      return null;
    }

    return fb.group({
      id: -1,
      isNew: true,
      expandFlag: true,
      lastSavedState: null, // store the last saved state of the contactInfo for reverting function
      deviceInfo: fb.group({
        deviceName: [null, Validators.required],
        deviceAuthorized: [null, Validators.required],
        licenceNum: [null, [Validators.required, ValidationService.numeric6Validator]],
        deviceApplicationSubmitted: [null, Validators.required],
        //deviceApplicationNumber: [null, [Validators.required, ValidationService.appNumValidator ]],
        deviceApplicationNumber: [null, [Validators.required, ValidationService.numeric6Validator]],
        deviceExplain: [null, Validators.required]
      }, { updateOn: 'blur' }
      )
    });
  }
}