import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import {TheraClassService} from '../../therapeutic/therapeutic-classification/thera-class.service';
import {GlobalsService} from '../../globals/globals.service';
import {ValidationService} from '../../validation.service';
import {ListService} from '../../list-service';

@Injectable()
export class ContactDetailsService {

  private static lang = GlobalsService.ENGLISH;

  // todo: move statice data to data loader serivce
  public static statusListExternal: Array<any> = [
    {id: 'NEW', label_en: 'New', label_fr: 'fr_New'},
    {id: 'REVISE', label_en: 'Revise', label_fr: 'fr_Revise'},
    {id: 'REMOVE', label_en: 'Remove', label_fr: 'fr_Remove'},
    {id: 'ACTIVE', label_en: 'Active', label_fr: 'fr_Active'}
  ];
  public static statusListAdd: Array<any> = [
    {id: 'ACTIVE', label_en: 'Active', label_fr: 'fr_Active'}
  ];
  public static statusListInternal: Array<any> = ContactDetailsService.statusListExternal;

  // public static salutationList: Array<any> = [
  //   {id: 'DR', label_en: 'Dr.', label_fr: 'fr_Dr.'},
  //   {id: 'MR', label_en: 'Mr.', label_fr: 'fr_Mr.'},
  //   {id: 'MRS', label_en: 'Mrs.', label_fr: 'fr_Mrs.'},
  //   {id: 'MS', label_en: 'Ms.', label_fr: 'fr_Ms.'}
  // ];
  public static languageList: Array<any> = [
    {'id': 'EN', 'label_en': 'English', 'label_fr': 'Anglais'},
    {'id': 'FR', 'label_en': 'French', 'label_fr': 'Français'}
  ];

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
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      language: [null, Validators.required],
      jobTitle: [null, Validators.required],
      faxNumber: ['', [Validators.minLength(10), ValidationService.faxNumberValidator]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), ValidationService.phoneNumberValidator]],
      phoneExtension: '',
      email: [null, [Validators.required, ValidationService.emailValidator]],
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
        given_name: '',
        // initials: '',
        surname: '',
        language: '',
        job_title: '',
        fax_num: '',
        phone_num: '',
        phone_ext: '',
        email: '',
        RoutingID: ''
      }
    );
  }


  public static mapFormModelToDataModel(formRecord: FormGroup, contactModel) {
    contactModel.given_name = formRecord.controls['firstName'].value;
    // contactModel.initials = formRecord.controls['initials.value;
    contactModel.surname = formRecord.controls['lastName'].value;
    if (formRecord.controls['language'].value) {
      const langList = this._convertListText(this.languageList, this.lang);
      const recordIndex3 = ListService.getRecord(langList, formRecord.controls['language'].value, 'id');
      if (recordIndex3 > -1) {
        contactModel.language = {
          '__text': langList[recordIndex3].text,
          '_id': langList[recordIndex3].id,
          '_label_en': langList[recordIndex3].label_en,
          '_label_fr': langList[recordIndex3].label_fr
        };
      }
    } else {
      contactModel.language = null;
    }
    contactModel.job_title = formRecord.controls['jobTitle'].value;
    contactModel.fax_num = formRecord.controls['faxNumber'].value;
    contactModel.phone_num = formRecord.controls['phoneNumber'].value;
    contactModel.phone_ext = formRecord.controls['phoneExtension'].value;
    contactModel.email = formRecord.controls['email'].value;
  }

  public static mapDataModelToFormModel(contactModel, formRecord: FormGroup) {

    formRecord.controls['firstName'].setValue(contactModel.given_name);
    // formRecord.controls['initials.setValue(contactModel.initials);
    formRecord.controls['lastName'].setValue(contactModel.surname);
    if (contactModel.language) {
      const recordIndex3 = ListService.getRecord(this.languageList, contactModel.language._id, 'id');
      if (recordIndex3 > -1) {
        formRecord.controls['language'].setValue(this.languageList[recordIndex3].id);
      }
    } else {
      formRecord.controls['language'].setValue(null);
    }
    formRecord.controls['jobTitle'].setValue(contactModel.job_title);
    formRecord.controls['faxNumber'].setValue(contactModel.fax_num);
    formRecord.controls['phoneNumber'].setValue(contactModel.phone_num);
    formRecord.controls['phoneExtension'].setValue(contactModel.phone_ext);
    formRecord.controls['email'].setValue(contactModel.email);
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
    if (lang === GlobalsService.FRENCH) {
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
