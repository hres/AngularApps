import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ICode, UtilsService } from '@hpfb/sdk/ui';
import { RecordListServiceInterface } from './specy-subtype.list.service.interface';
import { SpeciesSubtypesRecordService } from '../species-subtypes-record-comonent/species-subtypes-record-service';
import { SpecySubtypeBaseService } from '../specis-subtypes-base.service';
import { SpeciesSubtypesDetailsService } from '../species-subtypes-detail-component/species-subtypes-detail-service';
import { SpecyAndSubType } from '../../models/ProductInformation';



@Injectable()
export class SpeciesSubtypesListService implements RecordListServiceInterface {


  private specyList = [];

  // to facilitate to subscribe to specyModel's changes
  private specyModelSubject: Subject<any> = new Subject<any>();
  specyModelChanges$: Observable<any> = this.specyModelSubject.asObservable();

  // whenever specyList changes, notify subscribers
  notifyContactModelChanges(changes: any) {
    this.specyModelSubject.next(changes);
  }

  constructor(private _recordService: SpeciesSubtypesRecordService, private _companyBaseService: SpecySubtypeBaseService, private _utilsService: UtilsService,
    private _detailsService: SpeciesSubtypesDetailsService) {
    this.specyList = [];
    this.initIndex(this.specyList);
  }


  public getModelRecordList() {
    return this.specyList;
  }

  /**
   * Sets the data model. Converts the data model to the form model
   * @param value
   */
  public setModelRecordList(value) {
    this.specyList = value;
    this.notifyContactModelChanges({...this.specyList});
  }


  getEmptyContactModel(): SpecyAndSubType {
    let specyAndSubType: SpecyAndSubType = this._companyBaseService.getEmptySpecySubtypeModel();
    return specyAndSubType;
  }

  public getReactiveModel(fb: FormBuilder): FormGroup {
    return fb.group({
      species_subtypes: fb.array([])
    });
  }

  createContactFormRecord(fb: FormBuilder) {
    const formRecord = this._recordService.getReactiveModel(fb);
    const nextId = this.getNextIndex();
    formRecord.controls['id'].setValue(nextId);
    return formRecord;
  }


  private contactFormToData(record: FormGroup, contactModel: SpecyAndSubType, lang: string, languageList: ICode[]) {
    this._recordService.mapFormModelToDataModel(record, contactModel, lang, languageList );
  }

  public createFormRecordList(modelDataList: SpecyAndSubType[], fb: FormBuilder, formRecordList, isInternal) {
    for (let i = 0; i < modelDataList.length; i++) {
      const formRecord = this._recordService.getReactiveModel(fb);
      this.contactDataToForm(modelDataList[i], formRecord);
      formRecordList.push(formRecord);
    }
  }

  private contactDataToForm(contactModel: SpecyAndSubType, record: FormGroup) {
    this._recordService.mapDataModelFormModel(contactModel, record);
    return (record);
  }

  public saveRecord(formRecord: FormGroup, lang:string, languageList: ICode[], contactSatusList: ICode[]) {
    let modelList = this.getModelRecordList();
    let id:number;
    let contactModel: SpecyAndSubType = null;

    if (formRecord.controls['isNew'].value) {
      // this.setRecordId(formRecord, this.getNextIndex());
      formRecord.controls['isNew'].setValue(false);
      contactModel = this.getEmptyContactModel();
      modelList.push(contactModel);
      this.contactFormToData(formRecord, contactModel, lang, languageList);
    } else {
      contactModel = this.getModelRecord(formRecord.controls['id'].value);
      if (!contactModel) {
        contactModel = this.getEmptyContactModel();
        modelList.push(contactModel);
      }
      this.contactFormToData(formRecord, contactModel, lang, languageList);
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

  updateUIDisplayValues(formRecordList: FormArray){
    // update Contact Record seqNumber
    this.updateFormRecordListSeqNumber(formRecordList);

    formRecordList.controls.forEach( (element: FormGroup) => {
      const specyDetailFormRecord = element.controls['speciesSubtypeDetail'] as FormGroup;
    });
  }

   /**
   * Used to create record ids
   * @type {number}
   * @private
   */
   private _indexValue = -1;


   /**
    * Parses the current data and finds the largest ID
    * @public
    */
   public initIndex(recordList) {
     this.resetIndex();
     for (let record of recordList) {
      // Cast variables to ensure we're comparing Number types
      const castedRecordId = Number(record.id);
      const castedIndexValue = Number(this._indexValue);
       if (castedRecordId > castedIndexValue) {
         this._indexValue = record.id;
       }
     }
     // console.log("The index value "+  this._indexValue)
   }

   /**
    * Gets the next record id
    * @returns {number}
    */
   getNextIndex() {
     this._indexValue++;
     // console.log("In list service get id "+ this._indexValue);
     return this._indexValue;
   }

   /**
    * Resets the index to the base value. Used for record ids
    */
   public resetIndex() {
     this._indexValue = -1;
   }

   /**
    * Gets the current id value to use for a record
    * @returns {number}
    */
   getCurrentIndex() {

     return this._indexValue;
   }

   /**
    * Sets the record id to a value
    * @param {number} value
    */
   public setIndex(value: number) {
     this._indexValue = value;
   }

   public updateFormRecordListSeqNumber(formRecordList: FormArray){
     let seq = 0;
     formRecordList.controls.forEach( (element: FormGroup) => {
       // console.log(element);
       element.controls['seqNumber'].setValue(seq + 1);
       seq ++;
     });
   }

   /**
    * if formRecordIdToExpand is passed in, expand that record and collapse all other records;
    * otherwise, collapse all records
    *
    * @param formRecordList
    * @param formRecordIdToExpand optional
    */
   public collapseFormRecordList(utilsService: UtilsService, formRecordList: FormArray, formRecordIdToExpand?: number){
     formRecordList.controls.forEach( (element: FormGroup) => {
       // console.log(element);
       if ( !utilsService.isEmpty(formRecordIdToExpand) && (Number(element.controls['id'].value) === formRecordIdToExpand) ) {
         element.controls['expandFlag'].setValue(true);
       } else {
         element.controls['expandFlag'].setValue(false);
       }
     });
   }

  public getModelRecordListFromForm(formArray: FormArray): SpecyAndSubType[] {

    if (!formArray || formArray.length === 0) {
      return [];
    }

    return formArray.controls.map((ctrl) => {
      const fg = ctrl as FormGroup;

      return {
        id: fg.get('id')?.value ?? null,
        species: fg.get('speciesSubtypeDetail.species')?.value ?? null,
        subtype: fg.get('speciesSubtypeDetail.subtype')?.value ?? null,
        isUsedForTreatmentOfFoodProducingAnimals:
          fg.get('speciesSubtypeDetail.isUsedForTreatmentOfFoodProducingAnimals')?.value ?? null,

        withdrawal_time: {
          days: fg.get('speciesSubtypeDetail.days')?.value ?? null,
          hours: fg.get('speciesSubtypeDetail.hours')?.value ?? null
        }
      };
    });
  }


}
