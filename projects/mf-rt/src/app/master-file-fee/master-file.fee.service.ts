import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ConverterService, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { FeeDetails } from '../models/transaction';
import { GlobalService } from '../global/global.service';


@Injectable()
export class MasterFileFeeService {

  constructor(private _globalService: GlobalService, private _converterService: ConverterService, private _utilsService: UtilsService) {
  }

  /**
   * Gets the reactive forms Model for address details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      areAccessLetters: [null, Validators.required],
      numOfAccessLetter: [null, [Validators.required]],
      whoResponsible: [null, [Validators.required]],
      accountNumber: ['', [Validators.minLength(5)]],
      businessNumber: ['', [Validators.minLength(9)]],
    });
  }
  
  public mapFormModelToDataModel(formValue: any, mfFeeModel: FeeDetails) {
    const lang = this._globalService.currLanguage;

    mfFeeModel.are_there_access_letters = formValue['areAccessLetters'];
    mfFeeModel.number_of_access_letters = formValue['numOfAccessLetter'];
    mfFeeModel.who_responsible_fee = formValue['whoResponsible'];
    mfFeeModel.account_number = formValue['accountNumber'];
    mfFeeModel.cra_business_number = formValue['businessNumber'];
  }

  public mapDataModelToFormModel(mfFeeModel: FeeDetails, formRecord: FormGroup) {
    formRecord.controls['areAccessLetters'].setValue(mfFeeModel.are_there_access_letters);
    formRecord.controls['numOfAccessLetter'].setValue(mfFeeModel.number_of_access_letters);
    formRecord.controls['whoResponsible'].setValue(mfFeeModel.who_responsible_fee);
    formRecord.controls['accountNumber'].setValue(mfFeeModel.account_number);
    formRecord.controls['businessNumber'].setValue(mfFeeModel.cra_business_number);
  }

}
