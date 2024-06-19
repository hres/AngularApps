import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ConverterService, ICode, UtilsService, ValidationService } from '@hpfb/sdk/ui';


@Injectable()
export class ContactDetailsService {

  constructor(private _utilsService: UtilsService, private _converterService: ConverterService) {
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

  public mapFormModelToDataModel(formRecord: FormGroup, contactModel, lang: string, languageList: ICode[]) {
    contactModel.given_name = formRecord.controls['firstName'].value;
    // contactModel.initials = formRecord.controls['initials.value;
    contactModel.surname = formRecord.controls['lastName'].value;
    if (formRecord.controls['language'].value) {
        contactModel.language_correspondance = this._converterService.findAndConverCodeToIdTextLabel(languageList, formRecord.controls['language'].value, lang);
    } else {
        contactModel.language_correspondance = null;
    }
    contactModel.job_title = formRecord.controls['jobTitle'].value;
    contactModel.fax_num = formRecord.controls['faxNumber'].value;
    contactModel.phone_num = formRecord.controls['phoneNumber'].value;
    contactModel.phone_ext = formRecord.controls['phoneExtension'].value;
    contactModel.email = formRecord.controls['email'].value;
  }

  public mapDataModelToFormModel(contactModel, formRecord: FormGroup, lang: string, languageList: ICode[]) {

    formRecord.controls['firstName'].setValue(contactModel.given_name);
    // formRecord.controls['initials.setValue(contactModel.initials);
    formRecord.controls['lastName'].setValue(contactModel.surname);
    if (contactModel.language_correspondance) {
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
  }

}
