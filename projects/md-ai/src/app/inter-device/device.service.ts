import { Injectable, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '@hpfb/sdk/ui';

@Injectable()
export class DeviceService {

  deviceErrors = signal([]);
  
  // showDeviceErrorSummary = signal(false);
  showDeviceErrorSummaryOneRec = signal(false);

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
    const deviceInfo = formRecord.deviceInfo;

    deviceModel.id = formRecord.id;
    deviceModel.device_name = deviceInfo.deviceName;
    deviceModel.device_authorized = deviceInfo.deviceAuthorized;
    deviceModel.licence_number = deviceInfo.licenceNum
    deviceModel.device_application_submitted = deviceInfo.deviceApplicationSubmitted;
    deviceModel.device_application_number = deviceInfo.deviceApplicationNumber;
    deviceModel.device_explain = deviceInfo.deviceExplain;
  }

  public mapOutputModelToFormModel(deviceModel, formRecord: FormGroup) {
    formRecord.controls['deviceName'].setValue(deviceModel.device_name);
    formRecord.controls['deviceAuthorized'].setValue(deviceModel.device_authorized);
    formRecord.controls['licenceNum'].setValue(deviceModel.licence_number);
    formRecord.controls['deviceApplicationSubmitted'].setValue(deviceModel.device_application_submitted);
    formRecord.controls['deviceApplicationNumber'].setValue(deviceModel.device_application_number);
    formRecord.controls['deviceExplain'].setValue(deviceModel.device_explain);
  }

   /**
   * Using this method to set the errors of control values that were not touched to false.
   * This is because there are certain controls/inputs that only appear to user when they
   * select a specific value.
   * 
   * For ex: When selecting yes to if a device that has been authorized in Canada
   * -> YES: Licence Number appears, not app number & previously submitted & explanation inputs
   * -> App number, previously submitted and explanations become INVALID because they are required
   * when a user selects NO (for authorized in Canada)
   * @param formGroup 
   */
  public setDeviceDetailsErrorsToNull(formGroup) {
    // console.log("setting device details errors to null...", formGroup);
    Object.keys(formGroup.controls).forEach((key) => {
      formGroup.get(key).setErrors(null);
    });
  }
}