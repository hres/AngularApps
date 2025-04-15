import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ENGLISH, UtilsService } from '@hpfb/sdk/ui';
import { Ectd, TransactionEnrol } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class TimingOfApplicationService {
  getTimingOfApplicationForm(fb: FormBuilder) {
    if (!fb) {
      return null;
    }
    const timingOfApplicationForm = fb.nonNullable.group({
      timingOfApplicant: new FormControl(null, Validators.required),
    });
    return timingOfApplicationForm;
  }

  public mapFormModelToDataModel(
    formValue: any,
    transactionEnrol: TransactionEnrol
  ) {
    transactionEnrol.application_info.time_application =
      formValue['timingOfApplicant'];
  }

  public mapDataModelToFormModel(
    timingOfApplicant: string,
    formRecord: FormGroup
  ) {
    formRecord.controls['timingOfApplicant'].setValue(timingOfApplicant);
  }
}
