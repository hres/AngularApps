import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConverterService, ENGLISH, ICode, ValidationService} from '@hpfb/sdk/ui';
import { FeeDetails } from '../models/transaction';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class FeesService {

  private methodList: ICode[] = [];
  private _currLanguage: string = ENGLISH;

  constructor( private _converterService: ConverterService, private _globalService: GlobalService) {
    this.methodList = this._globalService.payMethod;
    this._currLanguage = this._globalService.currLanguage;
  }

  public  getFeesForm(fb: FormBuilder){

    if(!fb){
      return null;
    }

    const feesForm  = fb.nonNullable.group({
      feeAmount: new FormControl(null, [Validators.required, ValidationService.limitValidation]),
      payMethod: new FormControl("", Validators.required),

    })
    return feesForm;
  }


  public mapFormModelToDataModel(formValue: any, feeModel: FeeDetails) {
    feeModel.advanced_payment_fee = formValue['feeAmount'];
    feeModel.advanced_payment_type = formValue['payMethod']? this._converterService.findAndConverCodeToIdTextLabel(this.methodList, formValue['payMethod'], this._currLanguage).__text : "";
   }

  public mapDataModelToFormModel(feeModel: FeeDetails, formRecord: FormGroup) {
    formRecord.controls['feeAmount'].setValue(feeModel.advanced_payment_fee);
    formRecord.controls['payMethod'].setValue(this.findIdOfPaymentMethod(feeModel.advanced_payment_type));
   }


   private findIdOfPaymentMethod(label: string): string {
    let id: string = null;
    if (this.methodList != null && this.methodList.length > 0) {
      for (var paymentElement of this.methodList) {
        if (label === paymentElement.en || label === paymentElement.fr || label ===  paymentElement.id) {
          id = paymentElement.id;
          break;
        }
      }
    }
    return id;
  }
}
