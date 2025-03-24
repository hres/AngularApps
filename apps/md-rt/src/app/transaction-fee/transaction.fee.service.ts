import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { TransFees } from '../models/Enrollment';
import { ValidationService } from '@hpfb/sdk/ui';

@Injectable()
export class TransactionFeeService {

  constructor() {
  }

  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      hasFees: [null, Validators.required],
      billCompanyId: [null, [Validators.required, ValidationService.numeric6Validator]],
      billContactId: [null, [Validators.required, ValidationService.numeric5Validator]]
    });
  }

  // formValue: TransactionFeeComponent transDetaitransFeeFormlsForm FormGroup value, to get a specific control's value, use the FormControl's name, eg: hasFees
  public mapFeeFormToDataModel(formValue, transFeeModel: TransFees) {
    transFeeModel.has_fees = formValue.hasFees;
    transFeeModel.billing_company_id = formValue.billCompanyId;
    transFeeModel.billing_contact_id = formValue.billContactId;
  }

  public mapDataModelToFeeForm(transFeeModel: TransFees, formRecord: FormGroup) {
    formRecord.controls['hasFees'].setValue(transFeeModel.has_fees);
    formRecord.controls['billCompanyId'].setValue(transFeeModel.billing_company_id);
    formRecord.controls['billContactId'].setValue(transFeeModel.billing_contact_id);
  }

}