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
        seqNumber: -1,  // for UI display purpose only
        detailsDirty: [false, Validators.required],
        isNew: true,
        expandFlag: false,
        contactDetails: this._detailsService.getReactiveModel(fb, isInternal)
      }
    );
  }

  public mapFormModelToDataModel(formRecord: FormGroup, contactRecordModel: Contact, lang: string, languageList: ICode[], contactSatusList: ICode[]) {
    // console.log(contactRecordModel);
    // console.log(formRecord);
    contactRecordModel.id = formRecord.controls['id'].value;
    // contactRecordModel.company = formRecord.controls.companyName.value;
    this._detailsService.mapFormModelToDataModel((<FormGroup>formRecord.controls['contactDetails']), contactRecordModel, lang, languageList, contactSatusList);

  }


  public mapDataModelFormModel(contactRecordModel: Contact, formRecord: FormGroup) {
    formRecord.controls['id'].setValue(Number(contactRecordModel.id));
    formRecord.controls['isNew'].setValue(false);
    // formRecord.controls.companyName.setValue(contactRecordModel.company);
    this._detailsService.mapDataModelToFormModel(contactRecordModel, <FormGroup>formRecord.controls['contactDetails']);
  }

}
