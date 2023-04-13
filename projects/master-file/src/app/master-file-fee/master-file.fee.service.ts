import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Injectable()
export class MasterFileFeeService {

  constructor() {
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
      accountNumber: '',
      businessNumber: ''
    });
  }

  /**
   * Gets an empty data model
   *
   */
  public getEmptyModel() {

    return (
      {
        are_there_access_letters: '',
        number_of_access_letters: '',
        who_responsible_fee: '',
        account_number: '',
        cra_business_number: ''
      }
    );
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, mfFeeModel) {
    mfFeeModel.are_there_access_letters = formRecord.controls['areAccessLetters'].value;
    mfFeeModel.number_of_access_letters = formRecord.controls['numOfAccessLetter'].value;
    mfFeeModel.who_responsible_fee = formRecord.controls['whoResponsible'].value;
    mfFeeModel.account_number = formRecord.controls['accountNumber'].value;
    mfFeeModel.cra_business_number = formRecord.controls['businessNumber'].value;
  }

  public static mapDataModelToFormModel(mfFeeModel, formRecord: FormGroup) {
    formRecord.controls['areAccessLetters'].setValue(mfFeeModel.are_there_access_letters);
    formRecord.controls['numOfAccessLetter'].setValue(mfFeeModel.number_of_access_letters);
    formRecord.controls['whoResponsible'].setValue(mfFeeModel.who_responsible_fee);
    formRecord.controls['accountNumber'].setValue(mfFeeModel.account_number);
    formRecord.controls['businessNumber'].setValue(mfFeeModel.cra_business_number);
  }

}
