import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CompanyContactRecordService} from '../company-contact-record/company-contact-record.service';
import {ContactDetailsService} from '../contact.details/contact.details.service';
import { RecordListServiceInterface } from '../../record-list/record.list.service.interface';
import { RecordListBaseService } from '../../record-list/record.list.base.service';
import { ICode } from '../../data-loader/data';
import { Contact } from '../../model/entity-base';
import { Observable, Subject } from 'rxjs';
import { EntityBaseService } from '../../model/entity-base.service';
import { ContactStatus } from '../../common.constants';
import { UtilsService } from '../../public-api';

@Injectable()
export class ContactListService extends RecordListBaseService implements RecordListServiceInterface {

  /***
   *  The data list of contact records
   * @type {{id: number; contact: string; city: string; country: {id: string; text: string}}[]}
   */
  private contactList = [];

  // to facilitate to subscribe to contactModel's changes
  private contactModelSubject: Subject<any> = new Subject<any>();
  contactModelChanges$: Observable<any> = this.contactModelSubject.asObservable();

  notifyContactModelChanges(changes: any) {
    this.contactModelSubject.next(changes);
  }

  constructor(private _recordService: CompanyContactRecordService, private _entityBaseService: EntityBaseService, private _utilsService: UtilsService,
    private _detailsService: ContactDetailsService) {
    super();
    this.contactList = [];
    this.initIndex(this.contactList);
  }

  /**
   * Gets the array of  model records
   * @returns {{id: number; contact: string; city: string; country: {id: string; text: string}}[]}
   */
  public getModelRecordList() {
    return this.contactList;
  }

  /**
   * Sets the data model. Converts the data model to the form model
   * @param value
   */
  public setModelRecordList(value) {
    this.contactList = value;
  }

  // /**
  //  * Adds
  //  * @param record
  //  */
  // addContact(record) {
  //   // TODO error checking
  //   this.contactList.push(record);
  // }

  getEmptyContactModel(): Contact {
    let contact: Contact = this._entityBaseService.getEmptyContactModel();
    // this value is used when reverting an unsaved contact formRecord
    contact.status._id = ContactStatus.New;
    return contact;
  }

  public getReactiveModel(fb: FormBuilder): FormGroup {
    return fb.group({
      contacts: fb.array([])
    });
  }

  createContactFormRecord(fb: FormBuilder, isInternal: boolean) {
    const formRecord = this._recordService.getReactiveModel(fb, isInternal);
    const nextId = this.getNextIndex();
    formRecord.controls['id'].setValue(nextId);
    return formRecord;
  }


  private contactFormToData(record: FormGroup, contactModel: Contact, lang: string, languageList: ICode[], contactSatusList: ICode[]) {
    this._recordService.mapFormModelToDataModel(record, contactModel, lang, languageList, contactSatusList );
  }

  public createFormRecordList(modelDataList, fb: FormBuilder, formRecordList, isInternal) {
    for (let i = 0; i < modelDataList.length; i++) {
      const formRecord = this._recordService.getReactiveModel(fb, isInternal);
      this.contactDataToForm(modelDataList[i], formRecord);
      formRecordList.push(formRecord);
    }
  }

  private contactDataToForm(contactModel, record: FormGroup) {
    this._recordService.mapDataModelFormModel(contactModel, record);
    return (record);
  }

  public saveRecord(formRecord: FormGroup, lang:string, languageList: ICode[], contactSatusList: ICode[]) {
    let modelList = this.getModelRecordList();
    let id:number;
    let contactModel: Contact = null;

    if (formRecord.controls['isNew'].value) {
      // this.setRecordId(formRecord, this.getNextIndex());
      formRecord.controls['isNew'].setValue(false);
      contactModel = this.getEmptyContactModel();
      modelList.push(contactModel);
      this.contactFormToData(formRecord, contactModel, lang, languageList, contactSatusList);
    } else {
      contactModel = this.getModelRecord(formRecord.controls['id'].value);
      if (!contactModel) {
        contactModel = this.getEmptyContactModel();
        modelList.push(contactModel);
      }
      this.contactFormToData(formRecord, contactModel, lang, languageList, contactSatusList);
    }

    this.notifyContactModelChanges({ ...modelList });

    id = contactModel.id;
    return id;
  }

  public getModelRecord(id: number) {
    let modelList = this.getModelRecordList();

    for (let i = 0; i < modelList.length; i++) {
      if (Number(modelList[i].id) === id) {
        return modelList[i];
      }
    }
    return null;
  }

  deleteModelRecord(id): boolean {
    let modelList = this.getModelRecordList();

    for (let i = 0; i < modelList.length; i++) {
      if (Number(modelList[i].id) === id) {
        modelList.splice(i, 1);
        if (id === this.getCurrentIndex()) {
          this.setIndex(id - 1);
        }

        this.notifyContactModelChanges({ ...modelList });

        return true;
      }
    }
    return false;
  }

  updateUIDisplayValues(formRecordList: FormArray, contactStatusList: ICode[], lang: string){
    // update Contact Record seqNumber
    this.updateFormRecordListSeqNumber(formRecordList); 
    // update Contact Detail statusText
    formRecordList.controls.forEach( (element: FormGroup) => {
      const contactDetailFormRecord = element.controls['contactDetails'] as FormGroup;
      this._detailsService.setContactStatus(contactDetailFormRecord, contactDetailFormRecord.controls['status'].value, contactStatusList, lang, false)
    });
  }

}
