import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidationService } from '../../validation/validation.service';
import { UtilsService } from '../../utils/utils.service';
import { ConverterService } from '../../converter/converter.service';
import { ICode } from '../../data-loader/data';
import { Contact } from '../../model/entity-base';
import { ContactStatus } from '../../common.constants';

@Injectable()
export class ContactDetailsService {

  constructor(private _utilsService: UtilsService, private _converterService: ConverterService) {}

  /**
   * Gets the reactive forms Model for contact details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder, isInternal) {
    if (!fb) {return null; }
    const contactIdValidators = isInternal ? [Validators.required, ValidationService.dossierContactIdValidator] : [];
    // const recordProcessedValidator = isInternal ? [Validators.required] : [];
    return fb.group({
      contactId: [null, contactIdValidators],
      status: ContactStatus.New,
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

   public mapFormModelToDataModel(formRecord: FormGroup, contactModel: Contact, lang: string, languageList: ICode[], contactSatusList: ICode[]) {
    contactModel.contact_id = formRecord.controls['contactId'].value;
    if (formRecord.controls['status'].value) {
      contactModel.status = this._converterService.findAndConverCodeToIdTextLabel(contactSatusList, formRecord.controls['status'].value, lang);
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
      const contactStatusId: string | undefined = this._utilsService.getIdFromIdTextLabel(contactModel.status);
      formRecord.controls['status'].setValue(contactStatusId? contactStatusId : null);
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

}
