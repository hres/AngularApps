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
    hcUseModel.appReceived = formValue['appReceived'];
    hcUseModel.custNum = formValue['custNum'];
    hcUseModel.appNum = formValue['appNum'];
    hcUseModel.notes = formValue['notes'];
  }

  public mapDataModelToFormModel(hcUseModel: HcUse, formRecord: FormGroup) {
    formRecord.controls['appReceived'].setValue(hcUseModel.appReceived);
    formRecord.controls['custNum'].setValue(hcUseModel.custNum);
    formRecord.controls['appNum'].setValue(hcUseModel.appNum);
    formRecord.controls['notes'].setValue(hcUseModel.notes);
  }
}
