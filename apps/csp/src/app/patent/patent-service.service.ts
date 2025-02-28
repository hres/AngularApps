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
    });
    return patentForm;

  }



  public mapFormModelToDataModel(formValue: any, patentModel: IPatent) {

    patentModel.patent_number = formValue['patentNumber'];
    patentModel.filing_date = formValue['patentFillingDate'];
    patentModel.granted_date = formValue['patentGrandDate'];
    patentModel.expiry_date = formValue['patendExpirationDate'];
  }

  public mapDataModelToFormModel(patentModel: IPatent, formRecord: FormGroup) {

    formRecord.controls['patentNumber'].setValue(patentModel.patent_number);
    formRecord.controls['patentFillingDate'].setValue(patentModel.filing_date);
    formRecord.controls['patentGrandDate'].setValue(patentModel.granted_date);
    formRecord.controls['patendExpirationDate'].setValue(patentModel.expiry_date);
   }


}
