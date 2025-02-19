import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConverterService, ENGLISH, ICode} from '@hpfb/sdk/ui';
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
      feeAmount: new FormControl(null, Validators.required),
      payMethod: new FormControl(null, Validators.required),

    })
    return feesForm;
  }


  public mapFormModelToDataModel(formValue: any, feeModel: FeeDetails) {
    feeModel.feeAmount = formValue['feeAmount'];
    // feeModel.payMethod = formValue['payMethod'];
    feeModel.payMethod = formValue['payMethod']? this._converterService.findAndConverCodeToIdTextLabel(this.methodList, formValue['payMethod'], this._currLanguage).__text : "";
   }

  public mapDataModelToFormModel(feeModel: FeeDetails, formRecord: FormGroup) {
    formRecord.controls['feeAmount'].setValue(feeModel.feeAmount);
    formRecord.controls['payMethod'].setValue(feeModel.payMethod);
   }
}
