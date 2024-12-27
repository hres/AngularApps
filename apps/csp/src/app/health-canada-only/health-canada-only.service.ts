import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HcUse } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class HcUseOnlyService {

  constructor() { }

  public  getHcUseOnlyForm(fb: FormBuilder){

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

  public mapFormModelToDataModel(formValue: any, hcUse: HcUse) {
    hcUse.appReceived = formValue['appReceived'];
    hcUse.custNum = formValue['custNum'];
    hcUse.appNum = formValue['appNum'];
    hcUse.notes = formValue['notes'];
  }

  public mapDataModelToFormModel(hcUse: HcUse, formRecord: FormGroup) {
    formRecord.controls['appReceived'].setValue(hcUse.appReceived);
    formRecord.controls['custNum'].setValue(hcUse.custNum);
    formRecord.controls['appNum'].setValue(hcUse.appNum);
    formRecord.controls['notes'].setValue(hcUse.notes);
  }
}
