import { Injectable } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { CheckboxOption, ConverterService, ENGLISH, EntityBaseService, FRENCH, ICode, IIdTextLabel, ILabel, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { AmendReasons, ApplicationInfo } from '../models/Enrollment';
import { RegulatoryActivityType, COMPANY_ID_PREFIX, TransactionDesc } from '../app.constants';
import { GlobalService } from '../global/global.service';

@Injectable()
export class TransactionDetailsService {

  constructor(private _utilsService: UtilsService, private _converterService: ConverterService, private _globalService: GlobalService, private _entityBaseService: EntityBaseService ) {}

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
      amendReasons: fb.array([], [ValidationService.atLeastOneCheckboxSelected]), // holds "Reason for filing this Amendment" dropdown list options selected states (true or false)
      selectedAmendReasonCodes: [''],    // holds the selected amend reason codes, it's set when "Reason for filing this Amendment" dropdown list onChange"
      rationale: ['', Validators.required],
      proposedPurpose: ['', Validators.required],
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

  // formValue: TransactionDetailsComponent transDetailsForm FormGroup value, to get a specific control's value, use the FormControl's name, eg: dossierId
  public mapDetailFormToDataModel(formValue: any, transactionInfoModel: ApplicationInfo){
    const lang = this._globalService.getCurrLanguage();
    const activityTypeList = this._globalService.$activityTypeList;
    const txDescList = this._globalService.$transactionDescriptionList;
    const deviceClassList = this._globalService.$deviceClasseList;
    const amendReasonList = this._globalService.$amendReasonList;

    transactionInfoModel.dossier_id = formValue.dossierId;

    if (formValue.manuCompanyId) {
       transactionInfoModel.company_id = COMPANY_ID_PREFIX + formValue.manuCompanyId;
    }
    if (formValue.reguCompanyId) {
       transactionInfoModel.regulatory_company_id = COMPANY_ID_PREFIX + formValue.reguCompanyId;
    }
    transactionInfoModel.manufacturing_contact_id = formValue.manuContactId;
    transactionInfoModel.regulatory_contact_id = formValue.reguContactId;

    if (formValue.activityType) {
      transactionInfoModel.regulatory_activity_type = this._converterService.findAndConverCodeToIdTextLabel(activityTypeList, formValue.activityType, lang);
    } else {
      transactionInfoModel.regulatory_activity_type = null;
    }

    const txDescriptionControlValue = formValue.descriptionType;
    if (txDescriptionControlValue) {
      const txDescriptionIdTextLabel = this._converterService.findAndConverCodeToIdTextLabel(txDescList, formValue.descriptionType, lang);
      transactionInfoModel.description_type = txDescriptionIdTextLabel;
    } else {
      transactionInfoModel.description_type = null;
      transactionInfoModel.transaction_description = null;
    }
    
    transactionInfoModel.device_class = formValue.deviceClass? 
      this._converterService.findAndConverCodeToIdTextLabel(deviceClassList, formValue.deviceClass, lang) : null;

    if (formValue.selectedAmendReasonCodes) {
      const reasons: AmendReasons = {
        amend_reason: this._converterService.findAndConverCodesToIdTextLabels(amendReasonList, formValue.selectedAmendReasonCodes, lang)
      }
      // if no amend reasons, set the output field to null
      transactionInfoModel.amend_reasons = reasons.amend_reason.length > 0 ? reasons : null;
    } else {
      transactionInfoModel.amend_reasons = null;
    }

    transactionInfoModel.rationale = formValue.rationale? formValue.rationale : null;
    transactionInfoModel.proposed_indication = formValue.proposedPurpose? formValue.proposedPurpose : null;
    

    transactionInfoModel.licence_number = formValue.licenceNum;
    if (this.isMandatoryAppNumRequired(txDescriptionControlValue)) {
      transactionInfoModel.application_number = formValue.appNum;
    } else if (this.isOptionalAppNumRequired(txDescriptionControlValue)){
      transactionInfoModel.application_number = formValue.appNumOpt;
    } else {
      transactionInfoModel.application_number = null;
    }

    transactionInfoModel.meeting_id = formValue.meetingId;
    transactionInfoModel.device_name = formValue.deviceName;
    transactionInfoModel.proposed_licence_name = formValue.licenceName;

    transactionInfoModel.request_date = formValue.requestDate;
    transactionInfoModel.brief_description = formValue.briefDesc;

    transactionInfoModel.transaction_description = txDescriptionControlValue? this._concatTransactionDescriptionDetails(
      transactionInfoModel.description_type, transactionInfoModel.request_date, transactionInfoModel.brief_description): null;

    transactionInfoModel.has_ddt = formValue.hasDdtMan;

    transactionInfoModel.has_app_info = formValue.hasAppInfo   
    transactionInfoModel.org_manufacture_id = formValue.orgManufactureId;
    transactionInfoModel.org_manufacture_lic = formValue.orgManufactureLic;

  }

  public mapDataModelToDetailForm(transactionInfoModel: ApplicationInfo, formRecord: FormGroup, amendReasonList: ICode[], relationship: any, amendReasonOptionList: CheckboxOption[], lang: string) {
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
    formRecord.controls['appNumOpt'].setValue(transactionInfoModel.application_number);
    formRecord.controls['appNum'].setValue(transactionInfoModel.application_number);
    formRecord.controls['meetingId'].setValue(transactionInfoModel.meeting_id);
    formRecord.controls['deviceName'].setValue(transactionInfoModel.device_name);
    formRecord.controls['licenceName'].setValue(transactionInfoModel.proposed_licence_name);
    formRecord.controls['requestDate'].setValue(transactionInfoModel.request_date);
    formRecord.controls['hasDdtMan'].setValue(transactionInfoModel.has_ddt);
    formRecord.controls['hasAppInfo'].setValue(transactionInfoModel.has_app_info);
    formRecord.controls['rationale'].setValue(transactionInfoModel.rationale);
    formRecord.controls['proposedPurpose'].setValue(transactionInfoModel.proposed_indication);
    formRecord.controls['orgManufactureId'].setValue(transactionInfoModel.org_manufacture_id);
    formRecord.controls['orgManufactureLic'].setValue(transactionInfoModel.org_manufacture_lic);
  }

  private _concatTransactionDescriptionDetails(txDescriptionIdTextLabel: IIdTextLabel, requestDate: string, briefDescription: string): ILabel{
    let labelObj: ILabel = this._entityBaseService.getEmptyLabel();
    const enumValue = this._utilsService.getEnumValueFromString(TransactionDesc, txDescriptionIdTextLabel._id);

    // Transaction description English Concat
    let enConcatText: string | undefined = undefined;
    const enTxDescription: string = this._utilsService.getLabelFromIdTextLabelByLang(txDescriptionIdTextLabel, ENGLISH);
    if (this.isRequestDateRequired(enumValue)) {
      enConcatText = this._utilsService.concat(enTxDescription, 'dated', requestDate)
    } else if (this.isBriefDescRequired(enumValue)) {
      enConcatText = this._utilsService.concat(enTxDescription, '-', briefDescription)
    }
    labelObj._label_en = enConcatText;

    // Transaction description French Concat
    let frConcatText: string | undefined = undefined;
    const frTxDescription: string = this._utilsService.getLabelFromIdTextLabelByLang(txDescriptionIdTextLabel, FRENCH);
    if (this.isRequestDateRequired(enumValue)) {
      frConcatText = this._utilsService.concat(frTxDescription, 'daté du', requestDate)
    } else if (this.isBriefDescRequired(enumValue)) {
      frConcatText = this._utilsService.concat(frTxDescription, '-', briefDescription)
    }
    labelObj._label_fr = frConcatText;

    if (typeof enConcatText === 'undefined' && typeof frConcatText === 'undefined') {
      return null;
    } else {
      return labelObj;
    }
  }

  getAmendReasonCheckboxFormArray(formRecord: FormGroup) {
    return formRecord.controls['amendReasons'] as FormArray;
  }  

  getSelectedAmendReasonCodes (amendReasonOptionList: CheckboxOption[], amendReasonCheckboxFormArray: FormArray) : string[]{
    return this._converterService.getCheckedCheckboxValues(amendReasonOptionList, amendReasonCheckboxFormArray)
  }

  loadAmendReasonOptions(activityTypeId: string, deviceClassId: string, amendReasonList: ICode[], relationship: any, amendReasonOptionList: CheckboxOption[], lang: string, amendReasonCheckboxFormArray: FormArray) : void{
    // console.log("##0 activityTypeId: ", activityTypeId, "deviceClassId: ", deviceClassId, "amendReasonList: ", amendReasonList, "relationship: ", relationship);
    const group = relationship.find((item) => item.raTypeId === activityTypeId);
    if (group) {
      // console.log("##1",group)
      const deviceClassAndAmendReason = group.amendReasons.filter((member) => member.deviceClassId === deviceClassId);
      // console.log("##2",deviceClassAndAmendReason[0])
      const availableAmendReasonIds = deviceClassAndAmendReason[0].values;
      // console.log("##3",availableAmendReasonIds)
      const availableAmendReasonCodeList = this._utilsService.filterCodesByIds(amendReasonList, availableAmendReasonIds);
      // console.log("##4", availableAmendReasonCodeList)

      // Clear existing items for the amend reason checkbox options and form array
      amendReasonOptionList.length = 0;
      amendReasonCheckboxFormArray.clear();

      // Populate the array with new items
      availableAmendReasonCodeList.forEach((item) => {
        const checkboxOption = this._converterService.convertCodeToCheckboxOption(item, lang);
        amendReasonOptionList.push(checkboxOption);
        amendReasonCheckboxFormArray.push(new FormControl(false));
      });
      // console.log("##5", amendReasonOptionList)
    } else {
      // console.info("couldn't find amendReasons for activityType", activityTypeId, "and deviceClass", deviceClassId);
    }
  }

  isRequestDateRequired(txDescription: TransactionDesc): boolean{
    const txDescRequireDate = [TransactionDesc.IRSR, TransactionDesc.MM, TransactionDesc.PSI, TransactionDesc.RAIL, TransactionDesc.RER, 
      TransactionDesc.RS25L, TransactionDesc.RS36L, TransactionDesc.RS39L, TransactionDesc.RS];

     return txDescRequireDate.includes(txDescription) ? true : false;
  }

  isBriefDescRequired(txDescription: TransactionDesc): boolean{
    return txDescription === TransactionDesc.UD ? true : false;
  }

  isMandatoryAppNumRequired(txDescription: TransactionDesc): boolean{
    const txDescRequireMandatoryAppNum = [TransactionDesc.ACD, TransactionDesc.LIA, TransactionDesc.RAIL, TransactionDesc.RER, TransactionDesc.RS, TransactionDesc.WR];
    return txDescRequireMandatoryAppNum.includes(txDescription)
  }

  isOptionalAppNumRequired(txDescription: TransactionDesc): boolean{
    const txDescRequireOptionalAppNum = [TransactionDesc.LIOH, TransactionDesc.MM, TransactionDesc.OHCD, TransactionDesc.RS36L, TransactionDesc.RS39L];
    return txDescRequireOptionalAppNum.includes(txDescription)
  }

  isOrgManufactureInfoRequired(raType: RegulatoryActivityType, txDescription: TransactionDesc): boolean{
    const raTypeRequireManufactureInfo: string[] = [RegulatoryActivityType.PrivateLabel, RegulatoryActivityType.PrivateLabelAmendment];
    const txDescRequireManufactureInfo = [TransactionDesc.INITIAL, TransactionDesc.RS, TransactionDesc.UD];

    return raTypeRequireManufactureInfo.includes(raType) && txDescRequireManufactureInfo.includes(txDescription) ? true : false;
  }

}
