import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { COMPANY_ID_PREFIX, EnrollmentStatus } from '../app.constants';
import { CheckboxOption, ConverterService, ICode, UtilsService, ValidationService, ICodeDefinition } from '@hpfb/sdk/ui';
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
      formStatusText: '', // UI display
      lastSavedDate: '',
      companyId: ['', [Validators.required, ValidationService.companyIdValidator]],
      amendReasons: this._fb.array([], [ValidationService.atLeastOneCheckboxSelected]),
      selectedAmendReasonCodes: [''],
      rationale: ['', [Validators.required]],
      areLicensesTransfered: ['', [Validators.required]]
    });
  }

  mapFormModelToDataModel(formRecord: FormGroup, generalInfoModel: GeneralInformation, slctdAmendReasonCodes: string[], amendReasonCodeList: ICode[], lang: string, enrollmentStatusesList: ICode[]) {
    if (formRecord.controls['formStatus'].value) {
      generalInfoModel.status = this._converterService.findAndConverCodeToIdTextLabel(enrollmentStatusesList, formRecord.controls['formStatus'].value, lang);
    } else {
      generalInfoModel.status = null;
    }
    generalInfoModel.last_saved_date = formRecord.controls['lastSavedDate'].value;
    if (formRecord.controls['companyId'].value) {
      generalInfoModel.company_id = COMPANY_ID_PREFIX + formRecord.controls['companyId'].value;
    }

    if (formRecord.controls['selectedAmendReasonCodes'].value) {
      const reasons: AmendReasons = {
        amend_reason: this._converterService.findAndConverCodesToIdTextLabels(amendReasonCodeList, formRecord.controls['selectedAmendReasonCodes'].value, lang)
      }
      // if no amend reasons, set the output field to null
      generalInfoModel.amend_reasons = reasons.amend_reason.length > 0 ? reasons : null;
    } else {
      generalInfoModel.amend_reasons = null;
    }

    generalInfoModel.rationale = formRecord.controls['rationale'].value,
    generalInfoModel.are_licenses_transfered = formRecord.controls['areLicensesTransfered'].value;
  }

  mapDataModelToFormModel(generalInfoModel : GeneralInformation, formRecord: FormGroup, amendReasonOptionList: CheckboxOption[], enrollmentStatusesList: ICode[], lang, amendReasonsList: ICodeDefinition[]) {
    //const formStatus = this._utilsService.translateWord(enrollmentStatusList, lang, generalInfoModel.status);
    this.setEnrolmentStatus(formRecord, generalInfoModel.status._id, enrollmentStatusesList, lang, true); 
    formRecord.controls['lastSavedDate'].setValue(generalInfoModel.last_saved_date);
    if (generalInfoModel.company_id) {
      formRecord.controls['companyId'].setValue(generalInfoModel.company_id.slice(1));
    }

    if (generalInfoModel.amend_reasons) {
      const loadedAmendReasonCodes: string[] = this._utilsService.getIdsFromIdTextLabels(generalInfoModel.amend_reasons.amend_reason);
      if (loadedAmendReasonCodes.length > 0) {
        const amendReasonFormArray = this.getAmendReasonCheckboxFormArray(formRecord);
        this.loadAmendReasonOptions(amendReasonsList, amendReasonOptionList, amendReasonFormArray, lang);
        this._converterService.checkCheckboxes(loadedAmendReasonCodes, amendReasonOptionList, amendReasonFormArray);
      }  
      formRecord.controls['selectedAmendReasonCodes'].setValue(loadedAmendReasonCodes);
    } 
    
    formRecord.controls['rationale'].setValue(generalInfoModel.rationale); // Moved this here because rationale 
    formRecord.controls['areLicensesTransfered'].setValue(generalInfoModel.are_licenses_transfered);
  }

  getAmendReasonCheckboxFormArray(formRecord: FormGroup) {
    return formRecord.controls['amendReasons'] as FormArray;
  }

  loadAmendReasonOptions(amendReasonsList, amendReasonsOptionList, amendReasonsChkFormArray, lang) {
    amendReasonsOptionList.length = 0;
    amendReasonsChkFormArray.clear();

   
    // Populate the array with new items
    amendReasonsList.forEach((item) => {
      const checkboxOption = this._converterService.convertCodeToCheckboxOption(item, lang);
      amendReasonsOptionList.push(checkboxOption);
      amendReasonsChkFormArray.push(new FormControl(false));
    });
    
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

  setEnrolmentStatus(formRecord: FormGroup, statusId: string, enrollmentStatusList: ICode[], lang:string, setStatusAlso:boolean) {
    if (setStatusAlso) {
      formRecord.controls['formStatus'].setValue(statusId);  
    }
    formRecord.controls['formStatusText'].setValue(this._utilsService.findAndTranslateCode(enrollmentStatusList, lang, statusId));
  }

  resetAmendReasons(amendReasonChkFormArray, formRecord: FormGroup) {
    amendReasonChkFormArray.controls.forEach(control => {
      control.setValue(false); // uncheck
      control.markAsPristine(); // optional: reset touched/pristine state
    });
    
    // Reset selectedAmendReasonCodes if you’re tracking them separately
    formRecord.controls['selectedAmendReasonCodes'].setValue([]);
  }
}
