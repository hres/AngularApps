import { Injectable } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { CheckboxOption, ConverterService, ICode, IIdTextLabel, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { AmendReasons, ApplicationInfo } from '../models/Enrollment';
import { COMPANY_ID_PREFIX, TransactionDesc } from '../app.constants';
import { GlobalService } from '../global/global.service';

@Injectable()
export class TransactionDetailsService {

  constructor(private _utilsService: UtilsService, private _converterService: ConverterService, private _globalService: GlobalService, ) {}

  /**
   * Gets the reactive forms Model for address details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      dossierId: ['', [Validators.required, ValidationService.dossierIdValidator]],
      manuCompanyId: ['', [Validators.required, ValidationService.numeric6Validator]],
      manuContactId: ['', [Validators.required, ValidationService.numeric5Validator]],
      reguCompanyId: ['', [Validators.required, ValidationService.numeric6Validator]],
      reguContactId: ['', [Validators.required, ValidationService.numeric5Validator]],
      activityType: ['', Validators.required],
      descriptionType: ['', Validators.required],
      deviceClass: ['', Validators.required],
      amendReasons: fb.array([], [ValidationService.atLeastOneCheckboxSelected]),
      rationale: ['', Validators.required],
      proposedIndication: ['', Validators.required],
      licenceNum: ['', [Validators.required, ValidationService.licenceNumValidator]],
      orgManufactureId: ['', [Validators.required, ValidationService.numeric6Validator]],
      orgManufactureLic: ['', [Validators.required, ValidationService.licenceNumValidator]],
      appNum: ['', [Validators.required, ValidationService.numeric6Validator]],
      appNumOpt: ['', [ValidationService.numeric6Validator]],
      meetingId: ['', [ValidationService.numeric6Validator]],
      deviceName: ['', Validators.required],
      licenceName: ['', Validators.required],
      requestDate: ['', Validators.required],
      briefDesc: ['', Validators.required],
      hasDdtMan: ['', Validators.required],
      hasAppInfo: [false, []]
    });
  }

  public mapFormModelToDataModel(formRecord: FormGroup, transactionInfoModel: ApplicationInfo, slctdAmendReasonCodes: string[], lang: string ) {
    const activityTypeList = this._globalService.$activityTypeList;
    const txDescList = this._globalService.$transactionDescriptionList;
    const deviceClassList = this._globalService.$deviceClasseList;
    const amendReasonList = this._globalService.$amendReasonList;

    transactionInfoModel.dossier_id = formRecord.controls['dossierId'].value;

    if (formRecord.controls['manuCompanyId'].value) {
       transactionInfoModel.company_id = COMPANY_ID_PREFIX + formRecord.controls['manuCompanyId'].value;
    }
    if (formRecord.controls['reguCompanyId'].value) {
       transactionInfoModel.regulatory_company_id = COMPANY_ID_PREFIX + formRecord.controls['reguCompanyId'].value;
    }
    transactionInfoModel.manufacturing_contact_id = formRecord.controls['manuContactId'].value;
    transactionInfoModel.regulatory_contact_id = formRecord.controls['reguContactId'].value;

    if (formRecord.controls['activityType'].value) {
      transactionInfoModel.regulatory_activity_type = this._converterService.findAndConverCodeToIdTextLabel(activityTypeList, formRecord.controls['activityType'].value, lang);
    } else {
      transactionInfoModel.regulatory_activity_type = null;
    }

    const txDescriptionControlValue = formRecord.controls['descriptionType'].value;
    if (txDescriptionControlValue) {
      const txDescriptionIdTextLabel = this._converterService.findAndConverCodeToIdTextLabel(txDescList, formRecord.controls['descriptionType'].value, lang);
      transactionInfoModel.description_type = txDescriptionIdTextLabel;
    } else {
      transactionInfoModel.description_type = null;
      transactionInfoModel.transaction_description = null;
    }
    
    transactionInfoModel.device_class = formRecord.controls['deviceClass']?.value? 
      this._converterService.findAndConverCodeToIdTextLabel(deviceClassList, formRecord.controls['deviceClass'].value, lang) : null;

    const reasons: AmendReasons = {
      amend_reason: this._converterService.findAndConverCodesToIdTextLabels(amendReasonList, slctdAmendReasonCodes, lang)
    }
    transactionInfoModel.amend_reasons = reasons;

    transactionInfoModel.rationale = formRecord.controls['rationale']?.value? formRecord.controls['rationale'].value : null;
    transactionInfoModel.proposed_indication = formRecord.controls['proposedIndication']?.value ? formRecord.controls['proposedIndication'].value : null;
    

    transactionInfoModel.licence_number = formRecord.controls['licenceNum'].value;
    if (this.isMandatoryAppNumRequired(txDescriptionControlValue)) {
      transactionInfoModel.application_number = formRecord.controls['appNum'].value;
    } else if (this.isOptionalAppNumRequired(txDescriptionControlValue)){
      transactionInfoModel.application_number = formRecord.controls['appNumOpt'].value;
    } else {
      transactionInfoModel.application_number = null;
    }

    transactionInfoModel.meeting_id = formRecord.controls['meetingId'].value;
    transactionInfoModel.device_name = formRecord.controls['deviceName'].value;
    transactionInfoModel.proposed_licence_name = formRecord.controls['licenceName'].value;

    transactionInfoModel.request_date = formRecord.controls['requestDate'].value;
    transactionInfoModel.brief_description = formRecord.controls['briefDesc'].value;

    transactionInfoModel.transaction_description = txDescriptionControlValue? this._concatTransactionDescriptionDetails(
      transactionInfoModel.description_type, transactionInfoModel.request_date, transactionInfoModel.brief_description, lang): null;

    transactionInfoModel.has_ddt = formRecord.controls['hasDdtMan'].value;

    transactionInfoModel.has_app_info = formRecord.controls['hasAppInfo'].value   
    transactionInfoModel.org_manufacture_id = formRecord.controls['orgManufactureId'].value;
    transactionInfoModel.org_manufacture_lic = formRecord.controls['orgManufactureLic'].value;
  }

  public mapDataModelToFormModel(transactionInfoModel: ApplicationInfo, formRecord: FormGroup, amendReasonList: ICode[], relationship: any, amendReasonOptionList: CheckboxOption[], lang: string) {
    let activityTypeId: string | undefined;
    let txDescriptionId: string | undefined;
    let deviceClassId: string | undefined;

    formRecord.controls['dossierId'].setValue(transactionInfoModel.dossier_id);

    if (transactionInfoModel.company_id) {
      formRecord.controls['manuCompanyId'].setValue(transactionInfoModel.company_id.slice(1));
    }

    formRecord.controls['manuContactId'].setValue(transactionInfoModel.manufacturing_contact_id);
    if (transactionInfoModel.regulatory_company_id) {
      formRecord.controls['reguCompanyId'].setValue(transactionInfoModel.regulatory_company_id.slice(1));
    }

    formRecord.controls['reguContactId'].setValue(transactionInfoModel.regulatory_contact_id);

    if (transactionInfoModel.regulatory_activity_type) {
      activityTypeId = this._utilsService.getIdFromIdTextLabel(transactionInfoModel.regulatory_activity_type);
      formRecord.controls['activityType'].setValue(activityTypeId? activityTypeId : null);
    } else {
      formRecord.controls['activityType'].setValue(null);
    }

    if (transactionInfoModel.description_type) {
      txDescriptionId = this._utilsService.getIdFromIdTextLabel(transactionInfoModel.description_type);
      formRecord.controls['descriptionType'].setValue(txDescriptionId? txDescriptionId : null);
    } else {
      formRecord.controls['descriptionType'].setValue(null);
    }

    if (transactionInfoModel.device_class) {
      deviceClassId = this._utilsService.getIdFromIdTextLabel(transactionInfoModel.device_class);
      formRecord.controls['deviceClass'].setValue(deviceClassId? deviceClassId : null);
    } else {
      formRecord.controls['deviceClass'].setValue(null);
    }

    if (transactionInfoModel.amend_reasons) {
      const loadedAmendReasonCodes: string[] = this._utilsService.getIdsFromIdTextLabels(transactionInfoModel.amend_reasons.amend_reason);
      if (loadedAmendReasonCodes.length > 0) {
        const amendReasonFormArray = this.getAmendReasonCheckboxFormArray(formRecord);
        this.loadAmendReasonOptions(activityTypeId, deviceClassId, amendReasonList, relationship, amendReasonOptionList, lang, amendReasonFormArray);
        this._converterService.checkCheckboxes(loadedAmendReasonCodes, amendReasonOptionList, amendReasonFormArray);
      }  
    }

    formRecord.controls['licenceNum'].setValue(transactionInfoModel.licence_number);
//     if (transactionInfoModel.description_type._id &&
//       (transactionInfoModel.description_type._id === descriptions[2].id ||
//         transactionInfoModel.description_type._id === descriptions[3].id ||
//         transactionInfoModel.description_type._id === descriptions[6].id ||
//         transactionInfoModel.description_type._id === descriptions[7].id ||
//         transactionInfoModel.description_type._id === descriptions[10].id ||
//         transactionInfoModel.description_type._id === descriptions[12].id)) {
      formRecord.controls['appNumOpt'].setValue(transactionInfoModel.application_number);
//     } else {
      formRecord.controls['appNum'].setValue(transactionInfoModel.application_number);
//     }
    formRecord.controls['meetingId'].setValue(transactionInfoModel.meeting_id);
    formRecord.controls['deviceName'].setValue(transactionInfoModel.device_name);
    formRecord.controls['licenceName'].setValue(transactionInfoModel.proposed_licence_name);
    formRecord.controls['requestDate'].setValue(transactionInfoModel.request_date);
    formRecord.controls['hasDdtMan'].setValue(transactionInfoModel.has_ddt);
    formRecord.controls['hasAppInfo'].setValue(transactionInfoModel.has_app_info);
    formRecord.controls['rationale'].setValue(transactionInfoModel.rationale);
    formRecord.controls['proposedIndication'].setValue(transactionInfoModel.proposed_indication);
    formRecord.controls['orgManufactureId'].setValue(transactionInfoModel.org_manufacture_id);
    formRecord.controls['orgManufactureLic'].setValue(transactionInfoModel.org_manufacture_lic);
  }

  getAmendReasonCheckboxFormArray(formRecord: FormGroup) {
    return formRecord.controls['amendReasons'] as FormArray;
  }  

  private _concatTransactionDescriptionDetails(txDescriptionIdTextLabel: IIdTextLabel, requestDate: string, briefDescription: string, lang: string): string{
    let concatText: string = '';
    const txDescription: string = this._utilsService.getLabelFromIdTextLabelByLang(txDescriptionIdTextLabel, lang);
    const enumValue = this._utilsService.getEnumValueFromString(TransactionDesc, txDescriptionIdTextLabel._id);
    if (this.isRequestDateRequired(enumValue)) {
      concatText = this._utilsService.concat(txDescription, 'dated', requestDate)
    } else if (this.isBriefDescRequired(enumValue)) {
      concatText = this._utilsService.concat(txDescription, '-', briefDescription)
    }

    return concatText;
  }

  getSelectedAmendReasonCodes (amendReasonOptionList: CheckboxOption[], amendReasonCheckboxFormArray: FormArray) : string[]{
    return this._converterService.getCheckedCheckboxValues(amendReasonOptionList, amendReasonCheckboxFormArray)
  }

  loadAmendReasonOptions(activityTypeId: string, deviceClassId: string, amendReasonList: ICode[], relationship: any, amendReasonOptionList: CheckboxOption[], lang: string, amendReasonCheckboxFormArray: FormArray) : void{
    console.log("##0",activityTypeId, deviceClassId, amendReasonList, relationship);
    const group = relationship.find((item) => item.activityTypeId === activityTypeId);
    if (group) {
      const reasons =  group.amendReasons.filter((member) => member.deviceClassId === deviceClassId);
      console.log("##1",reasons[0])
      const reasonIds = reasons[0].values;
      console.log("##2",reasonIds)
      const amendReasonCodeList = this._utilsService.filterCodesByIds(amendReasonList, reasonIds);
      console.log("##3", amendReasonCodeList)

      // Clear existing items for the amend reason checkbox options and form array
      amendReasonOptionList.length = 0;
      amendReasonCheckboxFormArray.clear();

      // Populate the array with new items
      amendReasonCodeList.forEach((item) => {
        const checkboxOption = this._converterService.convertCodeToCheckboxOption(item, lang);
        amendReasonOptionList.push(checkboxOption);
        amendReasonCheckboxFormArray.push(new FormControl(false));
      });

      console.log("##4", amendReasonOptionList)
    } else {
      console.error("couldn't find amendReasons for activityType", activityTypeId, "and deviceClass", deviceClassId);
    }
  }

  isRequestDateRequired(selectedTxDescription: TransactionDesc): boolean{
    const txDescRequireDate = [TransactionDesc.IRSR, TransactionDesc.MM, TransactionDesc.PSI, TransactionDesc.RAIL, TransactionDesc.RER, 
      TransactionDesc.RS25L, TransactionDesc.RS36L, TransactionDesc.RS39L, TransactionDesc.RS];

     return txDescRequireDate.includes(selectedTxDescription) ? true : false;
  }

  isBriefDescRequired(selectedTxDescription: TransactionDesc): boolean{
    return selectedTxDescription === TransactionDesc.UD ? true : false;
  }

  isMandatoryAppNumRequired(selectedTxDescription: TransactionDesc): boolean{
    const txDescRequireMandatoryAppNum = [TransactionDesc.ACD, TransactionDesc.LIA, TransactionDesc.RAIL, TransactionDesc.RER, TransactionDesc.RS, TransactionDesc.WR];
    return txDescRequireMandatoryAppNum.includes(selectedTxDescription)
  }

  isOptionalAppNumRequired(selectedTxDescription: TransactionDesc): boolean{
    const txDescRequireOptionalAppNum = [TransactionDesc.LIOH, TransactionDesc.MM, TransactionDesc.OHCD, TransactionDesc.RS36L, TransactionDesc.RS39L];
    return txDescRequireOptionalAppNum.includes(selectedTxDescription)
  }
}
