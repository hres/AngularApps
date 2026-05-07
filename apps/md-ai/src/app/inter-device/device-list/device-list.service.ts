import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseListService } from '@hpfb/sdk/ui';


@Injectable()
export class DeviceListService extends BaseListService{
  // Implement calculateNextId if necessary
  
  public updateFormRecordListSeqNumber(formRecordList: FormArray){
    let seq = 0;
    formRecordList.controls.forEach( (element: FormGroup) => {
      // console.log(element);
      element.controls['seqNumber'].setValue(seq + 1);
      seq ++;
    });
  }

  updateUIDisplayValues(formRecordList: FormArray){
    this.updateFormRecordListSeqNumber(formRecordList);
  }

}