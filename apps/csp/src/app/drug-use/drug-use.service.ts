import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IDrugUse, TransactionEnrol } from '../models/transaction';
import {
  ConverterService,
  ENGLISH,
  ICode,
  UtilsService,
} from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
@Injectable({
  providedIn: 'root',
})
export class DrugUseService {
  private drugUseList: ICode[] = [];
  private _currLanguage: string = ENGLISH;

  constructor(
    private _utilsService: UtilsService,
    private _converterService: ConverterService,
    private _globalService: GlobalService
  ) {
    this.drugUseList = this._globalService.drugUses;
    this._currLanguage = this._globalService.currLanguage;
  }

  public getDrugUseForm(fb: FormBuilder) {
    if (!fb) {
      return null;
    }
    const drugUseForm = fb.nonNullable.group({
      drugUse: new FormControl(null, Validators.required),
    });
    return drugUseForm;
  }

  public mapFormModelToDataModel(
    formValue: any,
    transactionEnrol: TransactionEnrol
  ) {
    transactionEnrol.application_info.drug_use = formValue['drugUse']
      ? this._converterService.findAndConverCodeToIdTextLabel(
          this.drugUseList,
          formValue['drugUse'],
          this._currLanguage
        ).__text
      : '';
  }

  public mapDataModelToFormModel(drugUseForm: string, formRecord: FormGroup) {
    formRecord.controls['drugUse'].setValue(this.findIdOfDrugUse(drugUseForm));
  }

  private findIdOfDrugUse(label: string): string {
    let id: string = null;
    if (this.drugUseList != null && this.drugUseList.length > 0) {
      for (var drugUseElement of this.drugUseList) {
        if (label === drugUseElement.en || label === drugUseElement.fr) {
          id = drugUseElement.id;
          break;
        }
      }
    }
    return id;
  }
}
