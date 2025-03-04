import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';



import { ContactStatus } from '../../app.constants';
import { ConverterService, ICode, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { Contact } from '../../models/Enrollment';

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
    const statusValidator = isInternal ? [this.contactStatusValidator] : [];
    return fb.group({
      contactId: [null, contactIdValidators],
      status: [ContactStatus.New,statusValidator],
      statusText: ['',statusValidator], // for UI display purpose only
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
      // routingId: ''
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
      contactModel.language_correspondence = this._converterService.findAndConverCodeToIdTextLabel(languageList, formRecord.controls['language'].value, lang);
    } else {
      contactModel.language_correspondence = null;
    }
    contactModel.job_title = formRecord.controls['jobTitle'].value;
    contactModel.fax_num = formRecord.controls['faxNumber'].value;
    contactModel.phone_num = formRecord.controls['phoneNumber'].value;
    contactModel.phone_ext = formRecord.controls['phoneExtension'].value;
    contactModel.email = formRecord.controls['email'].value;
    // contactModel.routingID = formRecord.controls['routingId'].value;
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

    if (contactModel.language_correspondence) {
      const langId: string | undefined = this._utilsService.getIdFromIdTextLabel(contactModel.language_correspondence);
      formRecord.controls['language'].setValue(langId? langId : null);
    } else {
      formRecord.controls['language'].setValue(null);
    }
    formRecord.controls['jobTitle'].setValue(contactModel.job_title);
    formRecord.controls['faxNumber'].setValue(contactModel.fax_num);
    formRecord.controls['phoneNumber'].setValue(contactModel.phone_num);
    formRecord.controls['phoneExtension'].setValue(contactModel.phone_ext);
    formRecord.controls['email'].setValue(contactModel.email);
    // formRecord.controls['routingId'].setValue(contactModel.routingID);
    // if (contactModel.hc_status) {
    //   const hcs = contactModel.hc_status === GlobalsService.YES ? true : false;
    //   formRecord.controls.recordProcessed.setValue(hcs);
    // }
  }

  setFormContactStatus(contactDetailFormRecord: FormGroup, statusId:string, contactStatusList: ICode[], lang: string, setStatusAlso: boolean){

    if (setStatusAlso) {
      contactDetailFormRecord.controls['status'].setValue(statusId);  
    }
    contactDetailFormRecord.controls['statusText'].setValue(this._utilsService.findAndTranslateCode(contactStatusList, lang, statusId));
  }

  contactStatusValidator(control) {
    if (!control.value) {
      return null;
    }
    if (control.value.toUpperCase()==ContactStatus.Remove) {
      return {'error.msg.remove.contact': true};
    } else if (control.value.toUpperCase()==ContactStatus.Revise) {
      return {'error.msg.revise.contact': true};
    } else {
      return null;
    }
  }
}
