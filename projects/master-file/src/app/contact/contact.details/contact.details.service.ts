import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../../globals/globals.service';
import {ValidationService} from '../../validation.service';
import {ListService} from '../../list-service';
import { IContact } from '../../models/transaction';

@Injectable()
export class ContactDetailsService {

  private static lang = GlobalsService.ENGLISH;

  // todo: move statice data to data loader serivce
  // public static statusListExternal: Array<any> = [
  //   {id: 'NEW', label_en: 'New', label_fr: 'fr_New'},
  //   {id: 'REVISE', label_en: 'Revise', label_fr: 'fr_Revise'},
  //   {id: 'REMOVE', label_en: 'Remove', label_fr: 'fr_Remove'},
  //   {id: 'ACTIVE', label_en: 'Active', label_fr: 'fr_Active'}
  // ];
  // public static statusListAdd: Array<any> = [
  //   {id: 'ACTIVE', label_en: 'Active', label_fr: 'fr_Active'}
  // ];
  // public static statusListInternal: Array<any> = ContactDetailsService.statusListExternal;

  // public static salutationList: Array<any> = [
  //   {id: 'DR', label_en: 'Dr.', label_fr: 'fr_Dr.'},
  //   {id: 'MR', label_en: 'Mr.', label_fr: 'fr_Mr.'},
  //   {id: 'MRS', label_en: 'Mrs.', label_fr: 'fr_Mrs.'},
  //   {id: 'MS', label_en: 'Ms.', label_fr: 'fr_Ms.'}
  // ];
  public static languageList: Array<any> = [
    {id: 'EN', en: 'English', fr: 'Anglais'},
    {id: 'FR', en: 'French', fr: 'Français'}
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

  public static mapFormModelToDataModel(formRecord: FormGroup, contactModel : IContact) {
    contactModel.given_name = formRecord.controls['firstName'].value;
    // contactModel.initials = formRecord.controls['initials.value;
    contactModel.surname = formRecord.controls['lastName'].value;
    if (formRecord.controls['language'].value) {
      const recordIndex3 = ListService.getRecord(this.languageList, formRecord.controls['language'].value, 'id');
      if (recordIndex3 > -1) {
        contactModel.language_correspondance = GlobalsService.convertCodeToIdTextLabel(this.languageList[recordIndex3], this.lang);
      }
    } else {
      contactModel.language_correspondance = null;
    }
    contactModel.job_title = formRecord.controls['jobTitle'].value;
    contactModel.fax_num = formRecord.controls['faxNumber'].value;
    contactModel.phone_num = formRecord.controls['phoneNumber'].value;
    contactModel.phone_ext = formRecord.controls['phoneExtension'].value;
    contactModel.email = formRecord.controls['email'].value;
  }

  public static mapDataModelToFormModel(contactModel : IContact, formRecord: FormGroup) {

    formRecord.controls['firstName'].setValue(contactModel.given_name);
    // formRecord.controls['initials.setValue(contactModel.initials);
    formRecord.controls['lastName'].setValue(contactModel.surname);
    if (contactModel.language_correspondance) {
      const recordIndex3 = ListService.getRecord(this.languageList, contactModel.language_correspondance._id, 'id');
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

}
