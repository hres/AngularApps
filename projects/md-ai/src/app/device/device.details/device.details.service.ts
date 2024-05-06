import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidationService } from '@hpfb/sdk/ui';

@Injectable()
export class DeviceDetailsService {

  constructor() {
  }

  /**
   * Gets the reactive forms Model for device details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      deviceName: [null, Validators.required],
      deviceAuthorized: [null, Validators.required],
      licenceNum: [null, [Validators.required, ValidationService.numeric6Validator]],
      deviceApplicationSubmitted: [null, Validators.required],
      //deviceApplicationNumber: [null, [Validators.required, ValidationService.appNumValidator ]],
      deviceApplicationNumber: [null, [Validators.required, ValidationService.numeric6Validator]],
      deviceExplain: [null, Validators.required]
    });
  }

  /**
   * Gets an empty
   *
   */
  public getEmptyModel() {

    return (
      {
        device_name: '',
        device_authorized: '',
        licence_number: '',
        device_application_submitted: '',
        device_application_number: '',
        device_explain: ''
      }
    );
  }

  public mapFormModelToDataModel(formRecord: FormGroup, deviceModel) {
    deviceModel.device_name = formRecord.controls['deviceName'].value;
    deviceModel.device_authorized = formRecord.controls['deviceAuthorized'].value;
    deviceModel.licence_number = formRecord.controls['licenceNum'].value;
    deviceModel.device_application_submitted = formRecord.controls['deviceApplicationSubmitted'].value;
    deviceModel.device_application_number = formRecord.controls['deviceApplicationNumber'].value;
    deviceModel.device_explain = formRecord.controls['deviceExplain'].value;
  }

  public mapDataModelToFormModel(deviceModel, formRecord: FormGroup) {
    formRecord.controls['deviceName'].setValue(deviceModel.device_name);
    formRecord.controls['deviceAuthorized'].setValue(deviceModel.device_authorized);
    formRecord.controls['licenceNum'].setValue(deviceModel.licence_number);
    formRecord.controls['deviceApplicationSubmitted'].setValue(deviceModel.device_application_submitted);
    formRecord.controls['deviceApplicationNumber'].setValue(deviceModel.device_application_number);
    formRecord.controls['deviceExplain'].setValue(deviceModel.device_explain);
  }
}
