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

  public mapFormModelToOutputModel(formRecord: any, deviceModel) {
    deviceModel.device_name = formRecord.deviceName;
    deviceModel.device_Authorized = formRecord.deviceAuthorized;
    deviceModel.licence_number = formRecord.licenceNum
    deviceModel.device_application_submitted = formRecord.deviceApplicationSubmitted;
    deviceModel.device_application_number = formRecord.deviceApplicationNumber;
    deviceModel.device_explain = formRecord.deviceExplain;
  }

  public mapOutputModelToFormModel(deviceModel, formRecord: FormGroup) {
    formRecord.controls['deviceName'].setValue(deviceModel.device_name);
    formRecord.controls['deviceAuthorized'].setValue(deviceModel.device_Authorized);
    formRecord.controls['licenceNum'].setValue(deviceModel.licence_number);
    formRecord.controls['deviceApplicationSubmitted'].setValue(deviceModel.device_application_submitted);
    formRecord.controls['deviceApplicationNumber'].setValue(deviceModel.device_application_number);
    formRecord.controls['deviceExplain'].setValue(deviceModel.device_explain);
  }
}