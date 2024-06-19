import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConverterService, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { Ectd } from '../models/transaction';
import { GlobalService } from '../global/global.service';

@Injectable()
export class RegulatoryInformationService {

  constructor(private _globalService: GlobalService, private _converterService: ConverterService, private _utilsService: UtilsService) {}

  showDateAndRequesterTxDescs: string[] = ['12','13', '14'];

  public static getRegularInfoForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   return fb.group({
     dossierId: [
       null,
       [Validators.required, ValidationService.masterFileDossierIdValidator],
     ],
     masterFileName: [null, Validators.required],
     masterFileNumber: [null, ValidationService.masterFileNumberValidator],
     masterFileType: [null, Validators.required],
     masterFileUse: [null, Validators.required],
     descriptionType: [null, Validators.required],
     requestDate: [null, Validators.required],
     requester: [null, Validators.required],
     reqRevision: [null, Validators.required],
     revisedDescriptionType: [null, Validators.required],
   });
  }

  public mapFormModelToDataModel(formValue: any, dataModel: Ectd): void {

    const lang = this._globalService.currLanguage;

    dataModel.dossier_id = formValue['dossierId'];
    dataModel.product_name = formValue['masterFileName'];
    dataModel.lifecycle_record.master_file_number = formValue['masterFileNumber'];
    dataModel.lifecycle_record.regulatory_activity_type = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.mfTypes, formValue['masterFileType'], lang);
    dataModel.lifecycle_record.master_file_use = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.mfUses, formValue['masterFileUse'], lang);
    dataModel.lifecycle_record.sequence_description_value = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.txDescs, formValue['descriptionType'], lang);
    dataModel.lifecycle_record.sequence_from_date = formValue['requestDate'];
    dataModel.lifecycle_record.requester_of_solicited_information = formValue['requester'];
    dataModel.lifecycle_record.revise_trans_desc_request = formValue['reqRevision'];
    dataModel.lifecycle_record.revised_trans_desc = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.txDescs, formValue['revisedDescriptionType'], lang);
    
    // save concatenated data to the dataModel
    // transaction_description: include display value Transaction description with additional details summarized added (date, etc)
    if (dataModel.lifecycle_record.sequence_description_value?._id) {    
      console.log(dataModel.lifecycle_record.sequence_description_value._id, typeof dataModel.lifecycle_record.sequence_description_value._id)
      if (this.showDateAndRequesterTxDescs.includes(dataModel.lifecycle_record.sequence_description_value._id)) {    
        dataModel.lifecycle_record.transaction_description = {
          '_label_en':this._utilsService.concat(dataModel.lifecycle_record.sequence_description_value._label_en, "dated", dataModel.lifecycle_record.sequence_from_date),
          '_label_fr':this._utilsService.concat(dataModel.lifecycle_record.sequence_description_value._label_fr, "daté du", dataModel.lifecycle_record.sequence_from_date)
        }      
      } else {
        dataModel.lifecycle_record.transaction_description = {
          '_label_en':this._utilsService.concat(dataModel.lifecycle_record.sequence_description_value._label_en, dataModel.lifecycle_record.sequence_from_date),
          '_label_fr':this._utilsService.concat(dataModel.lifecycle_record.sequence_description_value._label_fr, dataModel.lifecycle_record.sequence_from_date)
        }  
      }
      if (this._utilsService.isFrench(lang)) {
        dataModel.lifecycle_record.transaction_description.__text = dataModel.lifecycle_record.transaction_description._label_fr;
      }else{
        dataModel.lifecycle_record.transaction_description.__text = dataModel.lifecycle_record.transaction_description._label_en;
      }
    }

    // HPFBFORMS-192, Master File Name, allow any case in form but when saving to XML put in upper case
    dataModel.product_name = dataModel.product_name.toUpperCase();
  }

  public mapDataModelToFormModel(dataModel: Ectd, formRecord: FormGroup): void {
    formRecord.controls['dossierId'].setValue(dataModel.dossier_id);
    formRecord.controls['masterFileName'].setValue(dataModel.product_name);
    formRecord.controls['masterFileNumber'].setValue(dataModel.lifecycle_record.master_file_number);

    if(dataModel.lifecycle_record.regulatory_activity_type?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.lifecycle_record.regulatory_activity_type);
      formRecord.controls['masterFileType'].setValue(id? id : null);
    } else {
      formRecord.controls['masterFileType'].setValue(null);
    }

    if(dataModel.lifecycle_record.master_file_use?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.lifecycle_record.master_file_use);
      formRecord.controls['masterFileUse'].setValue(id? id : null);
    } else {
      formRecord.controls['masterFileUse'].setValue(null);
    }

    if(dataModel.lifecycle_record.sequence_description_value?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.lifecycle_record.sequence_description_value);
      formRecord.controls['descriptionType'].setValue(id? id : null);
    } else {
      formRecord.controls['descriptionType'].setValue(null);
    }

    formRecord.controls['requestDate'].setValue(dataModel.lifecycle_record.sequence_from_date);
    formRecord.controls['requester'].setValue(dataModel.lifecycle_record.requester_of_solicited_information);
    formRecord.controls['reqRevision'].setValue(dataModel.lifecycle_record.revise_trans_desc_request);

    if (dataModel.lifecycle_record.revised_trans_desc?._id) {
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.lifecycle_record.revised_trans_desc);
      formRecord.controls['revisedDescriptionType'].setValue(id? id : null);
    } else {
      formRecord.controls['revisedDescriptionType'].setValue(null);
    }
    
  }

}
