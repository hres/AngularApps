import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UtilsService} from '../../utils/utils.service';
import { ValidationService } from '../../validation/validation.service';
import { RecordListBaseService } from '../../record-list/record.list.base.service';
import { ENGLISH } from '../../common.constants';

@Injectable()
export class ContactDetailsService {

  private static lang = ENGLISH;    //todo get lang 

  constructor() {
  }

  /**
   * Sets language variable
   *
   */
  public static setLang(lang) {
    ContactDetailsService.lang = lang;
  }

  /**
   * Gets the reactive forms Model for contact details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder, isInternal) {
    if (!fb) {return null; }
    const contactIdValidators = isInternal ? [Validators.required, ValidationService.dossierContactIdValidator] : [];
    // const recordProcessedValidator = isInternal ? [Validators.required] : [];
    return fb.group({
      contactId: [null, contactIdValidators],
      status: 'NEW',
      // hcStatus: [null, Validators.required],
      // salutation: [null, Validators.required],
      fullName: [null, Validators.required],
      // initials: '',
      // lastName: [null, Validators.required],
      language: '',
      jobTitle: [null, Validators.required],
      faxNumber: ['', [Validators.minLength(10), ValidationService.faxNumberValidator]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), ValidationService.phoneNumberValidator]],
      phoneExtension: '',
      email: [null, [Validators.required, ValidationService.emailValidator]],
      routingId: ''
      // recordProcessed: [null, recordProcessedValidator]
    });
  }

  /**
   * Gets an empty
   *
   */
  public static getEmptyModel() {

    return (
      {
        contact_id: '',
        status: 'NEW',
        status_text: '',
        // hc_status: '',
        // salutation: '',
        full_name: '',
        // initials: '',
        // last_name: '',
        language: '',
        job_title: '',
        fax_number: '',
        phone_number: '',
        phone_extension: '',
        email: '',
        RoutingID: ''
      }
    );
  }


  public static mapFormModelToDataModel(formRecord: FormGroup, contactModel) {
    contactModel.contact_id = formRecord.controls['contactId'].value;
    if (formRecord.controls['status'].value) {
      // ling todo
      // const statList = this._convertListText(this.statusListInternal, this.lang);
      // const recordIndex = RecordListBaseService.getRecord(statList, formRecord.controls['status'].value, 'id');     //todo RecordListBaseService is abstract, is it right to call its method like this?
      // if (recordIndex > -1) {
      //   contactModel.status = {
      //     '__text': statList[recordIndex].text,
      //     '_id': statList[recordIndex].id,
      //     '_label_en': statList[recordIndex].label_en,
      //     '_label_fr': statList[recordIndex].label_fr
      //   };
        // contactModel.status_text = statList[recordIndex].text;
      // }
    } else {
      contactModel.status = null;
    }
    // contactModel.hc_status = formRecord.controls.hcStatus.value;
    // if (formRecord.controls.salutation.value) {
    //   const salutList = this._convertListText(this.salutationList, this.lang);
    //   const recordIndex2 = RecordListBaseService.getRecord(salutList, formRecord.controls.salutation.value, 'id');
    //   if (recordIndex2 > -1) {
    //     contactModel.salutation = {
    //       '__text': salutList[recordIndex2].text,
    //       '_id': salutList[recordIndex2].id,
    //       '_label_en': salutList[recordIndex2].label_en,
    //       '_label_fr': salutList[recordIndex2].label_fr
    //     };
    //   }
    // } else {
    //   contactModel.salutation = null;
    // }
    contactModel.full_name = formRecord.controls['fullName'].value;
    // contactModel.initials = formRecord.controls.initials.value;
    // contactModel.last_name = formRecord.controls.lastName.value;
    if (formRecord.controls['language'].value) {
      // ling todo
      const langList = "";  //this._convertListText(this.languageList, this.lang);
      // const recordIndex3 = RecordListBaseService.getRecord(langList, formRecord.controls['language'].value, 'id');
      // if (recordIndex3 > -1) {
      //   contactModel.language = {
      //     '__text': langList[recordIndex3].text,
      //     '_id': langList[recordIndex3].id,
      //     '_label_en': langList[recordIndex3].label_en,
      //     '_label_fr': langList[recordIndex3].label_fr
      //   };
      // }
    } else {
      contactModel.language = null;
    }
    contactModel.job_title = formRecord.controls['jobTitle'].value;
    contactModel.fax_number = formRecord.controls['faxNumber'].value;
    contactModel.phone_number = formRecord.controls['phoneNumber'].value;
    contactModel.phone_extension = formRecord.controls['phoneExtension'].value;
    contactModel.email = formRecord.controls['email'].value;
    contactModel.RoutingID = formRecord.controls['routingId'].value;
    // contactModel.hc_status = formRecord.controls.recordProcessed.value ? GlobalsService.YES : GlobalsService.NO;
  }

  public static mapDataModelToFormModel(contactModel, formRecord: FormGroup) {
    formRecord.controls['contactId'].setValue(contactModel.contact_id);
    // if (contactModel.status) {
    //   const recordIndex = RecordListBaseService.getRecord(this.statusListInternal, contactModel.status._id, 'id');
    //   if (recordIndex > -1) {
    //     formRecord.controls['status'].setValue(this.statusListInternal[recordIndex].id);
    //   }
    // } else {
    //   formRecord.controls['status'].setValue(null);
    // }
    // formRecord.controls.hcStatus.setValue(contactModel.hc_status);
    // if (contactModel.salutation) {
    //   const recordIndex2 = RecordListBaseService.getRecord(this.salutationList, contactModel.salutation._id, 'id');
    //   if (recordIndex2 > -1) {
    //     formRecord.controls.salutation.setValue(this.salutationList[recordIndex2].id);
    //   }
    // } else {
    //   formRecord.controls.salutation.setValue(null);
    // }

    formRecord.controls['fullName'].setValue(contactModel.full_name);
    // formRecord.controls.initials.setValue(contactModel.initials);
    // formRecord.controls.lastName.setValue(contactModel.last_name);
    if (contactModel.language) {
      // ling todo
      // const recordIndex3 = RecordListBaseService.getRecord(this.languageList, contactModel.language._id, 'id');
      // if (recordIndex3 > -1) {
      //   formRecord.controls['language'].setValue(this.languageList[recordIndex3].id);
      // }
    } else {
      formRecord.controls['language'].setValue(null);
    }
    formRecord.controls['jobTitle'].setValue(contactModel.job_title);
    formRecord.controls['faxNumber'].setValue(contactModel.fax_number);
    formRecord.controls['phoneNumber'].setValue(contactModel.phone_number);
    formRecord.controls['phoneExtension'].setValue(contactModel.phone_extension);
    formRecord.controls['email'].setValue(contactModel.email);
    formRecord.controls['routingId'].setValue(contactModel.RoutingID);
    // if (contactModel.hc_status) {
    //   const hcs = contactModel.hc_status === GlobalsService.YES ? true : false;
    //   formRecord.controls.recordProcessed.setValue(hcs);
    // }
  }

  public static getRecordId(record: FormGroup) {
    return (record.controls['id'].value);
  }

  public static setRecordId(record: FormGroup, value: number): void {
    if (!record) {
      return;
    }
    record.controls['id'].setValue(value);
  }

  /***
   * Converts the list iteems of id, label_en, and label_Fr
   * @param rawList
   * @param lang
   * @private
   */
  private static _convertListText(rawList, lang) {
    const result = [];
    if (UtilsService.isFrench(lang)) {
      rawList.forEach(item => {
        item.text = item.label_fr;
        result.push(item);
        //  console.log(item);
      });
    } else {
      rawList.forEach(item => {
        item.text = item.label_en;
        // console.log("adding country"+item.text);
        result.push(item);
        // console.log(item);
      });
    }
    return result;
  }

}
