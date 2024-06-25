import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidationService } from '@hpfb/sdk/ui';
import { Certification } from '../models/transaction';


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

  public mapFormModelToDataModel(formValue: any, certificationModel: Certification) {
    certificationModel.certify_accurate_complete = formValue['certifyAccurateComplete'];
    certificationModel.full_name = formValue['fullName'];
    certificationModel.submit_date = formValue['submitDate'];
    certificationModel.consent_privacy = formValue['consentPrivacy'];
  }

  public mapDataModelToFormModel(certificationModel: Certification, formRecord: FormGroup) {
    formRecord.controls['certifyAccurateComplete'].setValue(certificationModel.certify_accurate_complete);
    formRecord.controls['fullName'].setValue(certificationModel.full_name);
    formRecord.controls['submitDate'].setValue(certificationModel.submit_date);
    formRecord.controls['consentPrivacy'].setValue(certificationModel.consent_privacy);
  }

}
