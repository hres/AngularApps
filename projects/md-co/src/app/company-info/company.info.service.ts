import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NEW } from '../app.constants';
import { CheckboxOption, ConverterService, ICode, IIdTextLabel, NO, UtilsService, ValidationService, YES } from '@hpfb/sdk/ui';
import { GeneralInformation } from '../models/Enrollment';

@Injectable()
export class CompanyInfoService {

  constructor(private _fb: FormBuilder, private _converterService: ConverterService, private _utilsService: UtilsService) {}

  /**
   * Gets the reactive forms Model for generalInfo details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  getReactiveModel(): FormGroup{
    return this._fb.group({
      firstname: [''],
      formStatus: NEW,
      lastSavedDate: '',
      companyId: ['', [Validators.required, ValidationService.companyIdValidator]],
      amendReasons: new FormArray([]),
      otherDetails: ['', [Validators.required]],
      areLicensesTransfered: ['', [Validators.required]]
    });
  }

  mapFormModelToDataModel(formRecord: FormGroup, generalInfoModel: GeneralInformation, slctdAmendReasonCodes: string[], amendReasonCodeList: ICode[], lang: string) {
    generalInfoModel.status = formRecord.controls['formStatus'].value;
    generalInfoModel.last_saved_date = formRecord.controls['lastSavedDate'].value;
    if (formRecord.controls['companyId'].value) {
      generalInfoModel.company_id = 'K' + formRecord.controls['companyId'].value;
    }

    const selectedAmendReasons: IIdTextLabel[] = this._converterService.findAndConverCodesToIdTextLabels(amendReasonCodeList, slctdAmendReasonCodes, lang); 
    generalInfoModel.amend_reasons = selectedAmendReasons;

    generalInfoModel.amend_reason_other_details = formRecord.controls['otherDetails'].value;
    generalInfoModel.are_licenses_transfered = formRecord.controls['areLicensesTransfered'].value;
  }

  mapDataModelToFormModel(generalInfoModel : GeneralInformation, formRecord: FormGroup, amendReasonOptionList: CheckboxOption[]) {
    formRecord.controls['formStatus'].setValue(generalInfoModel.status);
    formRecord.controls['lastSavedDate'].setValue(generalInfoModel.last_saved_date);
    if (generalInfoModel.company_id) {
      formRecord.controls['companyId'].setValue(generalInfoModel.company_id.slice(1));
    }

    const loadedAmendReasonCodes: string[] | undefined = this._utilsService.getIdsFromIdTextLabels(generalInfoModel.amend_reasons);
    if (loadedAmendReasonCodes.length > 0) {
      const amendReasonFormArray = this.getAmendReasonCheckboxFormArray(formRecord);
      this._converterService.checkCheckboxes(loadedAmendReasonCodes, amendReasonOptionList, amendReasonFormArray);
    }

    formRecord.controls['otherDetails'].setValue(generalInfoModel.amend_reason_other_details);
    formRecord.controls['areLicensesTransfered'].setValue(generalInfoModel.are_licenses_transfered);
  }

  getAmendReasonCheckboxFormArray(formRecord: FormGroup) {
    return formRecord.controls['amendReasons'] as FormArray;
  }
  
  getSelectedAmendReasonCodes (amendReasonOptionList: CheckboxOption[], amendReasonCheckboxFormArray: FormArray) : string[]{
    return this._converterService.getCheckedCheckboxValues(amendReasonOptionList, amendReasonCheckboxFormArray)
  }

  public setValidaors(record: FormGroup, eventValue) {
    // record.controls['companyId.setValidators([Validators.required, ValidationService.companyIdValidator]);
    // record.controls['companyId.updateValueAndValidity();
    return [];
  }

    // Function to check checkboxes based on loaded data
    checkCheckboxesWithData(data: boolean[]) {

    }

}
