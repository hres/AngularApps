import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionEnrol } from '../models/transaction';


@Injectable({
  providedIn: 'root'
})
export class NoticeOfComplianceService {

  constructor( ) {}

  public static getNoticeOfComplianceForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   const noticeOfComplianceForm = fb.nonNullable.group({
     nocDate: new FormControl(null, Validators.required)
        });
    return noticeOfComplianceForm;

  }



  public mapFormModelToDataModel(formValue: any, transactionEnrol: TransactionEnrol) {

    transactionEnrol.nocDate = formValue['nocDate'];
    }

  public mapDataModelToFormModel(transactionEnrol: TransactionEnrol, formRecord: FormGroup) {

    formRecord.controls['nocDate'].setValue(transactionEnrol.nocDate);
   }


}
