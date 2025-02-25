import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HcUse } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class HcUseOnlyService {

  constructor() { }

  public getHcUseOnlyForm(fb: FormBuilder){

    if(!fb){
      return null;
    }

    const hcUseOnlyForm  = fb.nonNullable.group({
      appReceived: new FormControl(null),
      custNum: new FormControl(null),
      appNum: new FormControl(null),
      notes: new FormControl(null)
    })
    return hcUseOnlyForm;
  }

  public mapFormModelToDataModel(formValue: any, hcUseModel: HcUse) {
    hcUseModel.date_received = formValue['appReceived'];
    hcUseModel.company_id = formValue['custNum'];
    hcUseModel.application_id = formValue['appNum'];
    hcUseModel.hc_notes = formValue['notes'];
  }

  public mapDataModelToFormModel(hcUseModel: HcUse, formRecord: FormGroup) {
    formRecord.controls['appReceived'].setValue(hcUseModel.date_received);
    formRecord.controls['custNum'].setValue(hcUseModel.company_id);
    formRecord.controls['appNum'].setValue(hcUseModel.application_id);
    formRecord.controls['notes'].setValue(hcUseModel.hc_notes);
  }
}
