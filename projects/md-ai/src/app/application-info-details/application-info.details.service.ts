import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { IIdTextLabel, UtilsService, ValidationService, YES, NO, CheckboxOption, ConverterService, ICode } from '@hpfb/sdk/ui';
// import {GlobalsService} from '../globals/globals.service';
// import {ValidationService} from '../validation.service';
// import {ListService} from '../list-service';
import { ApplicationInfo, Compliances, DiagnosisReasons } from '../models/Enrollment';
import { COMPANY_ID_PREFIX } from '../app.constants';
import { GlobalService } from '../global/global.service';

@Injectable()
export class ApplicationInfoDetailsService {

  constructor(private _utilsService : UtilsService, private _converterService : ConverterService, private _globalService: GlobalService) {
  }

  /**
   * Gets the reactive forms Model for address details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      companyId: [null, [Validators.required, ValidationService.numeric6Validator]],
      dossierId: [null, [Validators.required, ValidationService.dossierIdValidator]],
      mdsapNum: [null, Validators.required],
      mdsapOrg: [null, Validators.required],
      licenceAppType: [null, Validators.required],
      activityType: [null, Validators.required],
      deviceClass: [null, Validators.required],
      isIvdd: [null, Validators.required],
      isHomeUse: [null, Validators.required],
      isCarePoint: [null, Validators.required],
      isEmitRadiation: [null, Validators.required],
      hasDrug: [null, Validators.required],
      hasDinNpn: [null, []],
     /** din: ['', []],
      npn: ['', []], **/
      din: [null, [Validators.required, ValidationService.numeric8Validator]],
      npn: [null, [Validators.required, ValidationService.numeric8Validator]],
      drugName: [null, Validators.required],
      activeIngredients: [null, Validators.required],
      manufacturer: [null, Validators.required],
      compliance: fb.array([], [ValidationService.atLeastOneCheckboxSelected]),
      otherPharmacopeia: [null, Validators.required],
      provisionMdrIT: [false, []],
      provisionMdrSA: [false, []],
      provisionMdrIOA: [false, []],
      applicationNum: ['', [ValidationService.numeric6Validator]],
      sapReqNum: ['', []],
      authNum: ['',[ValidationService.numeric6Validator]],
      declarationConformity : [null, Validators.required],
      hasRecombinant: [null, Validators.required],
      isAnimalHumanSourced : [null, Validators.required],
      // hasMaterial: [null, Validators.required],
      isListedIddTable: [null, Validators.required],
      isPriorityReq: [null, []],
      diagnosisReasons: fb.array([], [ValidationService.atLeastOneCheckboxSelected])
    });
  }

  getSelectedDiagnosisCodes(seriousDiagnosisReasonList: CheckboxOption[], diagnosisReasonChkFormArray: FormArray) : string[] {
    return this._converterService.getCheckedCheckboxValues(seriousDiagnosisReasonList, diagnosisReasonChkFormArray);
  }

  getSelectedComplianceCodes(complianceList: CheckboxOption[], complianceChkFormArray: FormArray) : string[]{
    return this._converterService.getCheckedCheckboxValues(complianceList, complianceChkFormArray);
  }

  public mapFormModelToDataModel(formRecord: FormGroup, appInfoModel, slctdComplianceCodes : string[], slctdDiagnosisReasonCodes : string[], lang) {
    const licenceAppTypeList = this._globalService.$licenceAppTypeList;
    const mdsapOrgList = this._globalService.$mdAuditProgramList;
    const actTypeList = this._globalService.$regActivityTypeList;
    const devClassList = this._globalService.$deviceClassesList;
    const drugTypeList = this._globalService.$rawDrugTypeList;
    
    const complianceList = this._globalService.$complianceList;
    const diagnosisReasonList = this._globalService.$diagnosisReasonList;

    console.log(formRecord);
    if (formRecord.controls['companyId'].value) {
      appInfoModel.company_id = COMPANY_ID_PREFIX + formRecord.controls['companyId'].value;
    }
    appInfoModel.dossier_id = formRecord.controls['dossierId'].value;
    appInfoModel.mdsap_number = formRecord.controls['mdsapNum'].value;
    
    const mdsapOrgCodeValue = this._utilsService.findCodeById(mdsapOrgList, formRecord.controls['mdsapOrg'].value);
    appInfoModel.mdsap_org = mdsapOrgCodeValue? this._converterService.convertCodeToIdTextLabel(mdsapOrgCodeValue, lang) : null;
    
    const licenceAppTypeCodeValue = this._utilsService.findCodeById(licenceAppTypeList, formRecord.controls['licenceAppType'].value);
    appInfoModel.licence_application_type = licenceAppTypeCodeValue? this._converterService.convertCodeToIdTextLabel(licenceAppTypeCodeValue, lang) : null;

    const actTypeCodeValue = this._utilsService.findCodeById(actTypeList, formRecord.controls['activityType'].value);
    appInfoModel.regulatory_activity_type = actTypeCodeValue? this._converterService.convertCodeToIdTextLabel(actTypeCodeValue, lang) : null;

    const devClassCodeValue = this._utilsService.findCodeById(devClassList, formRecord.controls['deviceClass'].value);
    appInfoModel.device_class = devClassCodeValue? this._converterService.convertCodeToIdTextLabel(devClassCodeValue, lang) : null;

    appInfoModel.is_ivdd = formRecord.controls['isIvdd'].value;
    appInfoModel.is_home_use = formRecord.controls['isHomeUse'].value;
    appInfoModel.is_care_point_use = formRecord.controls['isCarePoint'].value;
    appInfoModel.is_emit_radiation = formRecord.controls['isEmitRadiation'].value;
    appInfoModel.has_drug = formRecord.controls['hasDrug'].value;

    const hasDinNpnCodeValue = this._utilsService.findCodeById(drugTypeList, formRecord.controls['hasDinNpn'].value);
    appInfoModel.has_din_npn = hasDinNpnCodeValue? this._converterService.convertCodeToIdTextLabel(hasDinNpnCodeValue, lang) : null;
    
  
    const compliances: Compliances = {
      compliance: this._converterService.findAndConverCodesToIdTextLabels(complianceList, slctdComplianceCodes, lang)
    }
    appInfoModel.compliance = compliances;
    appInfoModel.din = formRecord.controls['din'].value;
    appInfoModel.npn = formRecord.controls['npn'].value;
    appInfoModel.drug_name = formRecord.controls['drugName'].value;
    appInfoModel.active_ingredients = formRecord.controls['activeIngredients'].value;
    appInfoModel.manufacturer = formRecord.controls['manufacturer'].value;
    appInfoModel.other_pharmacopeia = formRecord.controls['otherPharmacopeia'].value;
    appInfoModel.provision_mdr_it = formRecord.controls['provisionMdrIT'].value ? YES : NO; // Diana TODO - Refactor
    appInfoModel.provision_mdr_sa = formRecord.controls['provisionMdrSA'].value ? YES : NO;
    appInfoModel.interim_order_authorization = formRecord.controls['provisionMdrIOA'].value ? YES : NO;
    appInfoModel.application_number = formRecord.controls['applicationNum'].value;
    appInfoModel.sap_request_number = formRecord.controls['sapReqNum'].value;
    appInfoModel.authorization_id = formRecord.controls['authNum'].value;
    appInfoModel.declaration_conformity = formRecord.controls['declarationConformity'].value;
    appInfoModel.has_recombinant = formRecord.controls['hasRecombinant'].value;
    appInfoModel.is_animal_human_sourced = formRecord.controls['isAnimalHumanSourced'].value;
    appInfoModel.is_listed_idd_table = formRecord.controls['isListedIddTable'].value;
    appInfoModel.priority_review = formRecord.controls['isPriorityReq'].value;
    const reasons: DiagnosisReasons = {
      diagnosis_reason: this._converterService.findAndConverCodesToIdTextLabels(diagnosisReasonList, slctdDiagnosisReasonCodes, lang)
    }
    appInfoModel.is_diagnosis_treatment_serious = reasons;
  }

  public mapDataModelToFormModel(appInfoModel: ApplicationInfo, formRecord: FormGroup, complianceList: ICode[], diagnosisReasonList: ICode[], complianceOptionList : CheckboxOption[], diagnosisOptionList: CheckboxOption[], lang) {
    let mdsapOrgId: string | undefined;
    let licenceAppTypeId: string | undefined;
    let regActivityTypeId: string | undefined;
    let deviceClassId: string | undefined;
    let hasDinNpnId: string | undefined;
    if (appInfoModel.company_id != '') {
      formRecord.controls['companyId'].setValue(appInfoModel.company_id.slice(1));
    }

    formRecord.controls['dossierId'].setValue(appInfoModel.dossier_id);
    formRecord.controls['mdsapNum'].setValue(appInfoModel.mdsap_number);

    if (appInfoModel.mdsap_org) {
      mdsapOrgId = this._utilsService.getIdFromIdTextLabel(appInfoModel.mdsap_org);
      formRecord.controls['mdsapOrg'].setValue(mdsapOrgId? mdsapOrgId : null);
    } else {
      formRecord.controls['mdsapOrg'].setValue(null);
    }

    if (appInfoModel.licence_application_type) {
      licenceAppTypeId = this._utilsService.getIdFromIdTextLabel(appInfoModel.licence_application_type);
      formRecord.controls['licenceAppType'].setValue(licenceAppTypeId? licenceAppTypeId : null);
    } else {
      formRecord.controls['licenceAppType'].setValue(null);
    }

    if (appInfoModel.regulatory_activity_type) {
      regActivityTypeId = this._utilsService.getIdFromIdTextLabel(appInfoModel.regulatory_activity_type);
      formRecord.controls['activityType'].setValue(regActivityTypeId? regActivityTypeId : null);
    } else {
      formRecord.controls['activityType'].setValue(null);
    }

    if (appInfoModel.device_class) {
      deviceClassId = this._utilsService.getIdFromIdTextLabel(appInfoModel.device_class);
      formRecord.controls['deviceClass'].setValue(deviceClassId? deviceClassId : null);
    } else {
      formRecord.controls['deviceClass'].setValue(null);
    }

    formRecord.controls['isIvdd'].setValue(appInfoModel.is_ivdd);
    formRecord.controls['isHomeUse'].setValue(appInfoModel.is_home_use);
    formRecord.controls['isCarePoint'].setValue(appInfoModel.is_care_point_use);
    formRecord.controls['isEmitRadiation'].setValue(appInfoModel.is_emit_radiation);
    formRecord.controls['hasDrug'].setValue(appInfoModel.has_drug);

    if (appInfoModel.has_din_npn) {
      hasDinNpnId = this._utilsService.getIdFromIdTextLabel(appInfoModel.has_din_npn);
      formRecord.controls['hasDinNpn'].setValue(hasDinNpnId? hasDinNpnId : null);
    } else {
      formRecord.controls['hasDinNpn'].setValue(null);
    }

    if (appInfoModel.compliance) {
      const loadedComplianceReasonCodes: string[] = this._utilsService.getIdsFromIdTextLabels(appInfoModel.compliance.compliance);
      if (loadedComplianceReasonCodes.length > 0) {
        const complianceFormArray = this.getComplianceChkboxFormArray(formRecord);
        this.loadComplianceOptions(complianceList, complianceOptionList, complianceFormArray, lang);
        this._converterService.checkCheckboxes(loadedComplianceReasonCodes, complianceOptionList, complianceFormArray);
      }  
    }

    formRecord.controls['din'].setValue(appInfoModel.din);
    formRecord.controls['npn'].setValue(appInfoModel.npn);
    formRecord.controls['drugName'].setValue(appInfoModel.drug_name);
    formRecord.controls['activeIngredients'].setValue(appInfoModel.active_ingredients);
    formRecord.controls['manufacturer'].setValue(appInfoModel.manufacturer);
    formRecord.controls['otherPharmacopeia'].setValue(appInfoModel.other_pharmacopeia);
    const mdtit = appInfoModel.provision_mdr_it === YES ? true : false;
    formRecord.controls['provisionMdrIT'].setValue(mdtit);
    const mdrsa = appInfoModel.provision_mdr_sa === YES ? true : false;
    formRecord.controls['provisionMdrSA'].setValue(mdrsa);
    const mdrioa = appInfoModel.interim_order_authorization === YES ? true : false;
    formRecord.controls['provisionMdrIOA'].setValue(mdrioa)
    formRecord.controls['applicationNum'].setValue(appInfoModel.application_number);
    formRecord.controls['sapReqNum'].setValue(appInfoModel.sap_request_number);
    formRecord.controls['authNum'].setValue(appInfoModel.authorization_id);
    formRecord.controls['declarationConformity'].setValue(appInfoModel.declaration_conformity);
    formRecord.controls['hasRecombinant'].setValue(appInfoModel.has_recombinant);
    formRecord.controls['isAnimalHumanSourced'].setValue(appInfoModel.is_animal_human_sourced);
    formRecord.controls['isListedIddTable'].setValue(appInfoModel.is_listed_idd_table);
    formRecord.controls['isPriorityReq'].setValue(appInfoModel.priority_review);

    if (appInfoModel.is_diagnosis_treatment_serious) {
      const loadedDiagnosisCodes: string[] = this._utilsService.getIdsFromIdTextLabels(appInfoModel.is_diagnosis_treatment_serious.diagnosis_reason);
      if (loadedDiagnosisCodes.length > 0) {
        const diagnosisFormArray = this.getDiagnosisChkboxFormArray(formRecord);
        this.loadDiagnosisReasonOptions(diagnosisReasonList, diagnosisOptionList, diagnosisFormArray, lang)
        this._converterService.checkCheckboxes(loadedDiagnosisCodes, diagnosisOptionList, diagnosisFormArray);
      }  
    }
  }

  getComplianceChkboxFormArray(formRecord: FormGroup) {
    return formRecord.controls['compliance'] as FormArray;
  }  
  getDiagnosisChkboxFormArray(formRecord: FormGroup) {
    return formRecord.controls['diagnosisReasons'] as FormArray;
  }  

  loadComplianceOptions(complianceList, complianceOptionList, complianceChkboxFormArray, lang) {
    complianceOptionList.length = 0;
    complianceChkboxFormArray.clear();

    console.log("#1", complianceList);
    console.log("#2", complianceOptionList);
    console.log("#3", complianceChkboxFormArray);

    // Populate the array with new items
    complianceList.forEach((item) => {
      const checkboxOption = this._converterService.convertCodeToCheckboxOption(item, lang);
      complianceOptionList.push(checkboxOption);
      complianceChkboxFormArray.push(new FormControl(false));
    });

    console.log("#4", complianceOptionList);
    console.log("#5", complianceChkboxFormArray);
  }

  loadDiagnosisReasonOptions(diagnosisList, seriousDiagnosisReasonOptionList, diagnosisReasonChkFormArray, lang) {
    seriousDiagnosisReasonOptionList.length = 0;
    diagnosisReasonChkFormArray.clear();

   
    // Populate the array with new items
    diagnosisList.forEach((item) => {
      const checkboxOption = this._converterService.convertCodeToCheckboxOption(item, lang);
      seriousDiagnosisReasonOptionList.push(checkboxOption);
      diagnosisReasonChkFormArray.push(new FormControl(false));
    });

    
  }
}
