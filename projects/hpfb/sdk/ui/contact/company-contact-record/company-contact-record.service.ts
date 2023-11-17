import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ContactDetailsService} from '../contact.details/contact.details.service';
import { ICode } from '../../data-loader/data';
import { Contact } from '../../model/entity-base';

@Injectable()
export class CompanyContactRecordService {

  constructor(private _detailsService: ContactDetailsService) {
  }

  public getReactiveModel(fb: FormBuilder, isInternal): FormGroup {
    if (!fb) {
      return null;
    }
    return fb.group({
        id: -1,
        seqNumber: -1,
        detailsDirty: [false, Validators.required],
        isNew: true,
        contactDetails: ContactDetailsService.getReactiveModel(fb, isInternal)
      }
    );
  }

  /** returns a data model for this **/
  public getEmptyModel() {

    const contactModel = ContactDetailsService.getEmptyModel();
    const companyModel = {
      id: '',
    };
    return this.extend(companyModel, contactModel);
  }

  public mapFormModelToDataModel(formRecord: FormGroup, contactRecordModel: Contact, lang: string, languageList: ICode[], contactSatusList: ICode[]) {
    // console.log(contactRecordModel);
    // console.log(formRecord);
    contactRecordModel.id = formRecord.controls['id'].value;
    // contactRecordModel.company = formRecord.controls.companyName.value;
    this._detailsService.mapFormModelToDataModel((<FormGroup>formRecord.controls['contactDetails']), contactRecordModel, lang, languageList, contactSatusList);

  }


  public mapDataModelFormModel(contactRecordModel, formRecord: FormGroup) {
    formRecord.controls['id'].setValue(Number(contactRecordModel.id));
    formRecord.controls['isNew'].setValue(false);
    // formRecord.controls.companyName.setValue(contactRecordModel.company);
    this._detailsService.mapDataModelToFormModel(contactRecordModel, <FormGroup>formRecord.controls['contactDetails']);
  }

  public extend(dest, src) {
    for (var key in src) {
      dest[key] = src[key];
    }
    return dest;
  }

}
