import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ConverterService, ICode, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { IContact } from '../../models/transaction';
import { GlobalService } from '../../global/global.service';


@Injectable()
export class ContactDetailsService {

  constructor(private _utilsService: UtilsService, private _converterService: ConverterService, private _globalService: GlobalService) {
  }

  /**
   * Gets the reactive forms Model for address details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
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

  public mapFormModelToDataModel(formValue: any, contactModel: IContact) {

    const lang = this._globalService.currLanguage;
    const languageList: ICode[] = this._globalService.languageList;

    contactModel.given_name = formValue['firstName'];
    // contactModel.initials = formRecord.controls['initials.value;
    contactModel.surname = formValue['lastName'];
    contactModel.language_correspondance = formValue['language']? this._converterService.findAndConverCodeToIdTextLabel(languageList, formValue['language'], lang) : null;
    contactModel.job_title = formValue['jobTitle'];
    contactModel.fax_num = formValue['faxNumber'];
    contactModel.phone_num = formValue['phoneNumber'];
    contactModel.phone_ext = formValue['phoneExtension'];
    contactModel.email = formValue['email'];
  }

  public mapDataModelToFormModel(contactModel: IContact, formRecord: FormGroup) {

    formRecord.controls['firstName'].setValue(contactModel.given_name);
    formRecord.controls['lastName'].setValue(contactModel.surname);
    if (contactModel.language_correspondance) {
        formRecord.controls['language'].setValue(contactModel.language_correspondance._id);
    } else {
      formRecord.controls['language'].setValue(null);
    }
    formRecord.controls['jobTitle'].setValue(contactModel.job_title);
    formRecord.controls['faxNumber'].setValue(contactModel.fax_num);
    formRecord.controls['phoneNumber'].setValue(contactModel.phone_num);
    formRecord.controls['phoneExtension'].setValue(contactModel.phone_ext);
    formRecord.controls['email'].setValue(contactModel.email);
  }

}
