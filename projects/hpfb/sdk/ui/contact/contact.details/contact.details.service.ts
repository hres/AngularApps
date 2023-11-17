import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RecordListBaseService} from '../../record-list/record.list.base.service'
import { ENGLISH, FRENCH } from '../../common.constants';
import { ValidationService } from '../../validation/validation.service';
import { UtilsService } from '../../utils/utils.service';
import { ConverterService } from '../../converter/converter.service';
import { ICode } from '../../data-loader/data';
import { Contact } from '../../model/entity-base';

@Injectable()
export class ContactDetailsService {

  private static lang = ENGLISH;

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

  constructor(private _utilsService: UtilsService, private _converterService: ConverterService) {}

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


  public mapFormModelToDataModel(formRecord: FormGroup, contactModel: Contact, lang: string, languageList: ICode[], contactSatusList: ICode[]) {
    contactModel.contact_id = formRecord.controls['contactId'].value;
    if (formRecord.controls['status'].value) {
      contactModel.status = this._converterService.findAndConverCodeToIdTextLabel(contactSatusList, formRecord.controls['status'].value, lang);
      contactModel.status_text = contactModel.status._id;
    } else {
      contactModel.status = null;
    }
    contactModel.full_name = formRecord.controls['fullName'].value;
    if (formRecord.controls['language'].value) {
      contactModel.language = this._converterService.findAndConverCodeToIdTextLabel(languageList, formRecord.controls['language'].value, lang);
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

  public mapDataModelToFormModel(contactModel: Contact, formRecord: FormGroup) {
    formRecord.controls['contactId'].setValue(contactModel.contact_id);
    if (contactModel.status) {
      // todo ling
      // const recordIndex = RecordListBaseService.getRecord(this.statusListInternal, contactModel.status._id, 'id');
      // if (recordIndex > -1) {
      //   formRecord.controls['status'].setValue(this.statusListInternal[recordIndex].id);
      // }
    } else {
      formRecord.controls['status'].setValue(null);
    }
    // formRecord.controls.hcStatus.setValue(contactModel.hc_status);
    // if (contactModel.salutation) {
    //   const recordIndex2 = ListService.getRecord(this.salutationList, contactModel.salutation._id, 'id');
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
      const langId: string | undefined = this._utilsService.getIdFromIdTextLabel(contactModel.language);
      formRecord.controls['language'].setValue(langId? langId : null);
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

  // /***
  //  * Converts the list iteems of id, label_en, and label_Fr
  //  * @param rawList
  //  * @param lang
  //  * @private
  //  */
  // private static _convertListText(rawList, lang) {
  //   const result = [];
  //   if (lang === FRENCH) {
  //     rawList.forEach(item => {
  //       item.text = item.label_fr;
  //       result.push(item);
  //       //  console.log(item);
  //     });
  //   } else {
  //     rawList.forEach(item => {
  //       item.text = item.label_en;
  //       // console.log("adding country"+item.text);
  //       result.push(item);
  //       // console.log(item);
  //     });
  //   }
  //   return result;
  // }

}
