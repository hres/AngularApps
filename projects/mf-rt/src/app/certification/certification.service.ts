import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidationService } from '@hpfb/sdk/ui';


@Injectable()
export class CertificationService {

  constructor() {
  }

  /**
   * Gets the reactive forms Model for address details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
        certifyAccurateComplete: [false, Validators.requiredTrue],
        fullName: [null, Validators.required],
        submitDate: [null, Validators.required],
        consentPrivacy: [false, Validators.requiredTrue]
    });
  }

  public mapFormModelToDataModel(formRecord: FormGroup, certificationModel) {
    certificationModel.certifyAccurateComplete = formRecord.controls['certifyAccurateComplete'].value;
    certificationModel.fullName = formRecord.controls['fullName'].value;
    certificationModel.submitDate = formRecord.controls['submitDate'].value;
    certificationModel.consentPrivacy = formRecord.controls['consentPrivacy'].value;
  }

  public mapDataModelToFormModel(certificationModel, formRecord: FormGroup) {
    formRecord.controls['certifyAccurateComplete'].setValue(certificationModel.certifyAccurateComplete);
    formRecord.controls['fullName'].setValue(certificationModel.fullName);
    formRecord.controls['submitDate'].setValue(certificationModel.submitDate);
    formRecord.controls['consentPrivacy'].setValue(certificationModel.consentPrivacy);
  }

}
