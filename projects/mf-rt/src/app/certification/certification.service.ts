import {Injectable} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { TransactionEnrol } from '../models/transaction';


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

  public mapFormModelToDataModel(formValue: any, transactionEnrol: TransactionEnrol) {
    transactionEnrol.certify_accurate_complete = formValue['certifyAccurateComplete'];
    transactionEnrol.full_name = formValue['fullName'];
    transactionEnrol.submit_date = formValue['submitDate'];
    transactionEnrol.consent_privacy = formValue['consentPrivacy'];
  }
}
