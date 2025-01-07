import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { identityRevealedValidator } from '../crossFieldValidator';
import { IPatent } from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { ValidationService } from '@hpfb/sdk/ui';

@Injectable({
  providedIn: 'root'
})
export class PatentService {

  constructor( private _globalService: GlobalService ) {}

  public static getPatentInformationForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   const patentForm = fb.nonNullable.group({
     patentNumber: new FormControl( '', [Validators.required, Validators.minLength(7)]),
     patentFillingDate: new FormControl(null, Validators.required),
     patentGrandDate: new FormControl(null, Validators.required),
     patendExpirationDate: new FormControl(null, Validators.required),
    },{ validators: identityRevealedValidator });
    return patentForm;

  }



  public mapFormModelToDataModel(formValue: any, patentModel: IPatent) {

    patentModel.patentNumber = formValue['patentNumber'];
    patentModel.patentFillingDate = formValue['patentFillingDate'];
    patentModel.patentGrandDate = formValue['patentGrandDate'];
    patentModel.patendExpirationDate = formValue['patendExpirationDate'];
  }

  public mapDataModelToFormModel(patentModel: IPatent, formRecord: FormGroup) {

    formRecord.controls['patentNumber'].setValue(patentModel.patentNumber);
    formRecord.controls['patentFillingDate'].setValue(patentModel.patentFillingDate);
    formRecord.controls['patentGrandDate'].setValue(patentModel.patentGrandDate);
    formRecord.controls['patendExpirationDate'].setValue(patentModel.patendExpirationDate);
   }


}
