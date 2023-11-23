import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { COMPANY_ID_PREFIX, EnrollmentStatus } from '../app.constants';
import { CheckboxOption, ConverterService, ICode, UtilsService, ValidationService, YES } from '@hpfb/sdk/ui';
import { AmendReasons, GeneralInformation } from '../models/Enrollment';

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
      formStatus: [EnrollmentStatus.New],
      lastSavedDate: '',
      companyId: ['', [Validators.required, ValidationService.companyIdValidator]],
      amendReasons: new FormArray([]),
      rationale: ['', [Validators.required]],
      areLicensesTransfered: ['', [Validators.required]]
    });
  }

  mapFormModelToDataModel(formRecord: FormGroup, generalInfoModel: GeneralInformation, slctdAmendReasonCodes: string[], amendReasonCodeList: ICode[], lang: string) {
    generalInfoModel.status = formRecord.controls['formStatus'].value;
    generalInfoModel.last_saved_date = formRecord.controls['lastSavedDate'].value;
    if (formRecord.controls['companyId'].value) {
      generalInfoModel.company_id = COMPANY_ID_PREFIX + formRecord.controls['companyId'].value;
    }

    const reasons: AmendReasons = {
      amend_reason: this._converterService.findAndConverCodesToIdTextLabels(amendReasonCodeList, slctdAmendReasonCodes, lang),
      rationale: formRecord.controls['rationale'].value,
    }
    generalInfoModel.amend_reasons = reasons;
    generalInfoModel.are_licenses_transfered = formRecord.controls['areLicensesTransfered'].value;
  }

  mapDataModelToFormModel(generalInfoModel : GeneralInformation, formRecord: FormGroup, amendReasonOptionList: CheckboxOption[]) {
    //const formStatus = this._utilsService.translateWord(enrollmentStatusList, lang, generalInfoModel.status);
    formRecord.controls['formStatus'].setValue(generalInfoModel.status);
    formRecord.controls['lastSavedDate'].setValue(generalInfoModel.last_saved_date);
    if (generalInfoModel.company_id) {
      formRecord.controls['companyId'].setValue(generalInfoModel.company_id.slice(1));
    }

    if (generalInfoModel.amend_reasons) {
      const loadedAmendReasonCodes: string[] = this._utilsService.getIdsFromIdTextLabels(generalInfoModel.amend_reasons.amend_reason);
      if (loadedAmendReasonCodes.length > 0) {
        const amendReasonFormArray = this.getAmendReasonCheckboxFormArray(formRecord);
        this._converterService.checkCheckboxes(loadedAmendReasonCodes, amendReasonOptionList, amendReasonFormArray);
      }  
      formRecord.controls['rationale'].setValue(generalInfoModel.amend_reasons.rationale); // Moved this here because rationale 
    }

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
