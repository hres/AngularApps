import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CheckboxOption, ConverterService, ICode, IIdTextLabel, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { AmendReasons, ApplicationInfo } from '../models/Enrollment';
import { COMPANY_ID_PREFIX } from '../app.constants';
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
      manuContactId: ['', [Validators.required, ValidationService.dossierContactIdValidator]],
      reguCompanyId: ['', [Validators.required, ValidationService.numeric6Validator]],
      reguContactId: ['', [Validators.required, ValidationService.regulatoryContactIdValidator]],
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
      requestTo: ['', Validators.required],
      briefDesc: ['', Validators.required],
      transDescription: [null, []],
      hasDdt: [false, []],
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
      //   transactionInfoModel.manufacturing_contact_id = formRecord.controls.manuContactId.value;
  //   transactionInfoModel.regulatory_contact_id = formRecord.controls.reguContactId.value;

    if (formRecord.controls['activityType'].value) {
      transactionInfoModel.regulatory_activity_type = this._converterService.findAndConverCodeToIdTextLabel(activityTypeList, formRecord.controls['activityType'].value, lang);
    } else {
      transactionInfoModel.regulatory_activity_type = null;
    }

    transactionInfoModel.description_type = formRecord.controls['descriptionType'].value? 
      this._converterService.findAndConverCodeToIdTextLabel(txDescList, formRecord.controls['descriptionType'].value, lang) : null;


    transactionInfoModel.device_class = formRecord.controls['deviceClass']?.value? 
      this._converterService.findAndConverCodeToIdTextLabel(deviceClassList, formRecord.controls['deviceClass'].value, lang) : null;

    const reasons: AmendReasons = {
      amend_reason: this._converterService.findAndConverCodesToIdTextLabels(amendReasonList, slctdAmendReasonCodes, lang)
    }
    transactionInfoModel.amend_reasons = reasons;

    transactionInfoModel.rationale = formRecord.controls['rationale']?.value? formRecord.controls['rationale'].value : null;
    transactionInfoModel.proposed_indication = formRecord.controls['proposedIndication']?.value ? formRecord.controls['proposedIndication'].value : null;
    

    transactionInfoModel.licence_number = formRecord.controls['licenceNum'].value;
  //   if (formRecord.controls['descriptionType'].value !== descArray[this.getDescMap().indexOf('i9')].id &&
  //     formRecord.controls['descriptionType'].value !== descArray[this.getDescMap().indexOf('i2')].id &&
  //     formRecord.controls['descriptionType'].value !== descArray[this.getDescMap().indexOf('i3')].id &&
  //     formRecord.controls['descriptionType'].value !== descArray[this.getDescMap().indexOf('i6')].id &&
  //     formRecord.controls['descriptionType'].value !== descArray[this.getDescMap().indexOf('i7')].id &&
  //     formRecord.controls['descriptionType'].value !== descArray[this.getDescMap().indexOf('i10')].id &&
  //     formRecord.controls['descriptionType'].value !== descArray[this.getDescMap().indexOf('i12')].id) {
      transactionInfoModel.application_number = formRecord.controls['appNum'].value;
  //   } else if (formRecord.controls['descriptionType'].value === descArray[this.getDescMap().indexOf('i2')].id  ||
  //           formRecord.controls['descriptionType'].value === descArray[this.getDescMap().indexOf('i3')].id  ||
  //           formRecord.controls['descriptionType'].value === descArray[this.getDescMap().indexOf('i6')].id  ||
  //           formRecord.controls['descriptionType'].value === descArray[this.getDescMap().indexOf('i7')].id  ||
  //           formRecord.controls['descriptionType'].value === descArray[this.getDescMap().indexOf('i10')].id  ||
  //           formRecord.controls['descriptionType'].value === descArray[this.getDescMap().indexOf('i12')].id ) {
      transactionInfoModel.application_number = formRecord.controls['appNumOpt'].value;
  //   }
    transactionInfoModel.meeting_id = formRecord.controls['meetingId'].value;
    transactionInfoModel.device_name = formRecord.controls['deviceName'].value;
    transactionInfoModel.proposed_licence_name = formRecord.controls['licenceName'].value;

    transactionInfoModel.request_date = formRecord.controls['requestDate'].value;
  //   transactionInfoModel.request_to = formRecord.controls.requestTo.value;
    transactionInfoModel.brief_description = formRecord.controls['briefDesc'].value;
  //   transactionInfoModel.transaction_description = TransactionDetailsService._setConcatDetails(transactionInfoModel);
  //   // if (formRecord.controls.deviceChange.value ||
  //   //     (formRecord.controls.activityType.value === activityTypeList[1].id &&
  //   //           formRecord.controls['descriptionType'].value === descArray[9].id)) {
  //     transactionInfoModel.has_ddt = formRecord.controls.hasDdtMan.value;
  //   // } else {
  //   //   transactionInfoModel.has_ddt = formRecord.controls.hasDdt.value ? GlobalsService.YES : GlobalsService.NO;
  //   // }
  //   transactionInfoModel.has_app_info = formRecord.controls.hasAppInfo.value ? GlobalsService.YES : GlobalsService.NO;
    
    transactionInfoModel.org_manufacture_id = formRecord.controls['orgManufactureId'].value;
    transactionInfoModel.org_manufacture_lic = formRecord.controls['orgManufactureLic'].value;
  }

  public mapDataModelToFormModel(transactionInfoModel, formRecord: FormGroup, lang) {
//     // formRecord.controls.routingId.setValue(transactionInfoModel.routing_id);
//     formRecord.controls['dossierId'].setValue(transactionInfoModel.dossier_id);
//     if (transactionInfoModel.company_id) {
      formRecord.controls['manuCompanyId'].setValue(transactionInfoModel.company_id.slice(1));
//     }
//     formRecord.controls.manuContactId.setValue(transactionInfoModel.manufacturing_contact_id);
//     if (transactionInfoModel.regulatory_company_id) {
      formRecord.controls['reguCompanyId'].setValue(transactionInfoModel.regulatory_company_id.slice(1));
//     }
//     formRecord.controls.reguContactId.setValue(transactionInfoModel.regulatory_contact_id);

//     /**
//      formRecord.controls.activityLead.setValue(transactionInfoModel.activity_lead);
//      formRecord.controls.activityType.setValue(transactionInfoModel.activity_type);
// */

//     if (transactionInfoModel.regulatory_activity_lead) {
//       const activityLeads = TransactionDetailsService._convertListText(TransactionDetailsService.getRawActivityLeadList(), lang);
//       const recordIndex = ListService.getRecord(activityLeads, transactionInfoModel.regulatory_activity_lead._id, 'id');
//       if (recordIndex > -1) {
//         formRecord.controls.activityLead.setValue(activityLeads[recordIndex].id);
//       } else {
//         formRecord.controls.activityLead.setValue(null);
//       }
//     } else {
//       formRecord.controls.activityLead.setValue(null);
//     }


//     const activityTypes = TransactionDetailsService._convertListText(TransactionDetailsService.getRawActivityTypeList(), lang);
//     if (transactionInfoModel.regulatory_activity_type) {
//       const recordIndex = ListService.getRecord(activityTypes, transactionInfoModel.regulatory_activity_type._id, 'id');
//       if (recordIndex > -1) {
//         formRecord.controls.activityType.setValue(activityTypes[recordIndex].id);
//       } else {
//         formRecord.controls.activityType.setValue(null);
//       }
//     } else {
//       formRecord.controls.activityType.setValue(null);
//     }

//     const descriptions = TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
//     if (transactionInfoModel.description_type) {
//       const recordIndex = ListService.getRecord(descriptions, transactionInfoModel.description_type._id, 'id');
//       if (recordIndex > -1) {
//         formRecord.controls['descriptionType'].setValue(descriptions[recordIndex].id);
//       } else {
//         formRecord.controls['descriptionType'].setValue(null);
//       }
//     } else {
//       formRecord.controls['descriptionType'].setValue(null);
//     }

//     // formRecord.controls.deviceClass.setValue(transactionInfoModel.device_class);
//     const dcs = TransactionDetailsService._convertListText(TransactionDetailsService.getDeviceClassList(), lang);
//     if (transactionInfoModel.device_class) {
//       const recordIndex = ListService.getRecord(dcs, transactionInfoModel.device_class._id, 'id');
//       if (recordIndex > -1) {
//         formRecord.controls.deviceClass.setValue(dcs[recordIndex].id);
//       } else {
//         formRecord.controls.deviceClass.setValue(null);
//       }
//     } else {
//       formRecord.controls.deviceClass.setValue(null);
//     }
//     const clsc = transactionInfoModel.amend_reasons.classification_change === GlobalsService.YES ? true : false;
//     formRecord.controls.classChange.setValue(clsc);
//     const licc = transactionInfoModel.amend_reasons.licence_change === GlobalsService.YES ? true : false;
//     formRecord.controls.licenceChange.setValue(licc);
//     const decc = transactionInfoModel.amend_reasons.device_change === GlobalsService.YES ? true : false;
//     formRecord.controls.deviceChange.setValue(decc);
//     const proc = transactionInfoModel.amend_reasons.process_change === GlobalsService.YES ? true : false;
//     formRecord.controls.processChange.setValue(proc);
//     const quac = transactionInfoModel.amend_reasons.quality_change === GlobalsService.YES ? true : false;
//     formRecord.controls.qualityChange.setValue(quac);
//     const desc = transactionInfoModel.amend_reasons.design_change === GlobalsService.YES ? true : false;
//     formRecord.controls.designChange.setValue(desc);
//     const matc = transactionInfoModel.amend_reasons.materials_change === GlobalsService.YES ? true : false;
//     formRecord.controls.materialsChange.setValue(matc);
//     const labc = transactionInfoModel.amend_reasons.labelling_change === GlobalsService.YES ? true : false;
//     formRecord.controls.labellingChange.setValue(labc);
//     const safc = transactionInfoModel.amend_reasons.safety_change === GlobalsService.YES ? true : false;
//     formRecord.controls.safetyChange.setValue(safc);
//     const purc = transactionInfoModel.amend_reasons.purpose_change === GlobalsService.YES ? true : false;
//     formRecord.controls.purposeChange.setValue(purc);
//     const addc = transactionInfoModel.amend_reasons.add_delete_change === GlobalsService.YES ? true : false;
//     formRecord.controls.addChange.setValue(addc);
//     if (clsc || licc || decc || proc || quac || desc || matc || labc || safc || purc || addc) {
//       formRecord.controls.amendReason.setValue('reasonFilled');
//     }
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
//     formRecord.controls.requestTo.setValue(transactionInfoModel.request_to);
//     formRecord.controls['briefDesc'].setValue(transactionInfoModel.brief_description);
//     formRecord.controls.transDescription.setValue(transactionInfoModel.transaction_description);
//     // const hasddt = transactionInfoModel.has_ddt === GlobalsService.YES ? true : false;
//     // if (formRecord.controls.deviceChange.value ||
//     //   (transactionInfoModel.regulatory_activity_type._id === activityTypes[1].id &&
//     //         transactionInfoModel.description_type._id === descriptions[9].id)) {
//       formRecord.controls.hasDdtMan.setValue(transactionInfoModel.has_ddt);
//     // } else {
//     //   formRecord.controls.hasDdt.setValue(hasddt);
//     // }
//     const hasapp = transactionInfoModel.has_app_info === GlobalsService.YES ? true : false;
//     formRecord.controls.hasAppInfo.setValue(hasapp);

//     formRecord.controls.rationale.setValue(transactionInfoModel.rationale);
//     formRecord.controls.proposedIndication.setValue(transactionInfoModel.proposed_indication);
    formRecord.controls['orgManufactureId'].setValue(transactionInfoModel.org_manufacture_id);
    formRecord.controls['orgManufactureLic'].setValue(transactionInfoModel.org_manufacture_lic);
  }

  private _setConcatDetails(transactionInfoModel) {
    // const rDate = '';
    let concatText = '';
    // const dTypeList = TransactionDetailsService.getRawTransDescList();
    if (transactionInfoModel.description_type) {
      concatText = transactionInfoModel.description_type._label_en;
      // if (transactionInfoModel.descriptionType.value.id === dTypeList[9].id) {
      //   concatText = enDescription;
      //   if (transactionInfoModel.deviceClass) {
      //     concatText += ' with device class: ' + transactionInfoModel.deviceClass;
      //   }
      //   if (transactionInfoModel.deviceName) {
      //     concatText += ', and name of device: ' + transactionInfoModel.deviceName;
      //   }
      // }
      if (transactionInfoModel.request_to) {
        concatText += transactionInfoModel.request_date + ' to ' + transactionInfoModel.request_to;
      } else if (transactionInfoModel.request_date) {
        // rDate = TransactionDetailsService._convertDate(transactionInfoModel.request_date);
        concatText += ' dated ' + transactionInfoModel.request_date;
      }
      // if (transactionInfoModel.application_number) {
      //   concatText += ' with application number: ' + transactionInfoModel.application_number;
      // }
      // if (transactionInfoModel.meeting_id) {
      //   concatText = 'Meeting ID, ' + transactionInfoModel.meeting_id + ', ' + concatText;
      // }
      // if (transactionInfoModel.brief_description) {
      //   concatText += ', and brief description: ' + transactionInfoModel.brief_description;
      // }
    }
    return concatText;
  }

  // private _convertDate(value) {

  //   if (!value) {return ''; }
  //   const date = new Date(value);
  //   const m_names = ['Jan', 'Feb', 'Mar',
  //     'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  //     'Oct', 'Nov', 'Dec'];
  //   const result = m_names[date.getUTCMonth()] + '. ' + date.getUTCDate() + ', ' + date.getFullYear();
  //   return result;
  // }

  getSelectedAmendReasonCodes (amendReasonOptionList: CheckboxOption[], amendReasonCheckboxFormArray: FormArray) : string[]{
    return this._converterService.getCheckedCheckboxValues(amendReasonOptionList, amendReasonCheckboxFormArray)
  }


}
