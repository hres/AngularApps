import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Observable,
  catchError,
  combineLatest,
  map,
  throwError,
  shareReplay,
  tap,
  filter,
} from 'rxjs';
import { ConverterService, DataMapping, FC_TYPE_ICODE, FC_TYPE_ID, FC_TYPE_INPUT, ICode, ICodeAria, ICodeDefinition, IParentChildren, OP_TYPE_IDTEXTLABEL, OP_TYPE_TEXT, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { Ectd, TransactionEnrol } from '../models/transaction';

@Injectable()
export class RegulatoryInformationService {

  constructor(private _converterService: ConverterService) {}

  showDateAndRequesterTxDescs: string[] = ['12','13', '14'];

  public static getRegularInfoForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   return fb.group({
     dossierId: [
       null,
       [Validators.required, ValidationService.dossierIdValidator],
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

  regInfoDataMappings: DataMapping[] = [
    new DataMapping(
      'dossierId',
      FC_TYPE_INPUT,
      'dossier_id',
      OP_TYPE_TEXT
    ),
    new DataMapping(
      'masterFileName',
      FC_TYPE_INPUT,
      'product_name',
      OP_TYPE_TEXT
    ),
    new DataMapping(
      'masterFileNumber',
      FC_TYPE_INPUT,
      'lifecycle_record.master_file_number',
      OP_TYPE_TEXT
    ),
    new DataMapping(
      'masterFileType',
      FC_TYPE_ICODE,
      'lifecycle_record.regulatory_activity_type',
      OP_TYPE_IDTEXTLABEL
    ),
    new DataMapping(
      'masterFileUse',
      FC_TYPE_ICODE,
      'lifecycle_record.master_file_use',
      OP_TYPE_IDTEXTLABEL
    ),
    new DataMapping(
      'descriptionType',
      FC_TYPE_ID,
      'lifecycle_record.sequence_description_value',
      OP_TYPE_IDTEXTLABEL
    ),
    new DataMapping(
      'requestDate',
      FC_TYPE_INPUT,
      'lifecycle_record.sequence_from_date',
      OP_TYPE_TEXT
    ),
    new DataMapping(
      'requester',
      FC_TYPE_INPUT,
      'lifecycle_record.requester_of_solicited_information',
      OP_TYPE_TEXT
    ),    
    new DataMapping(
      'reqRevision',
      FC_TYPE_INPUT,
      'lifecycle_record.revise_trans_desc_request',
      OP_TYPE_TEXT
    ),    
    new DataMapping(
      'revisedDescriptionType',
      FC_TYPE_ID,
      'lifecycle_record.revised_trans_desc',
      OP_TYPE_IDTEXTLABEL
    ),    
    
  ];

  public mapFormModelToDataModel(
    formRecord: FormGroup,
    dataModel: Ectd,
    lang: string, descriptionTypeList:ICodeDefinition[]
  ): void {    
    for (let mapping of this.regInfoDataMappings) {
      this._converterService.convertFormDataToOutputModel(
        mapping,
        formRecord,
        dataModel,
        lang,
        descriptionTypeList
      );
    }

    // save concatenated data to the dataModel
    // transaction_description: include display value Transaction description with additional details summarized added (date, etc)
    // if (dataModel.lifecycle_record.sequence_description_value?._id) {    
    //   if (this.showDateAndRequesterTxDescs.includes(dataModel.lifecycle_record.sequence_description_value._id)) {    
    //     dataModel.lifecycle_record.transaction_description = {
    //       '_label_en':concat(dataModel.lifecycle_record.sequence_description_value._label_en, "dated", dataModel.lifecycle_record.sequence_from_date),
    //       '_label_fr':concat(dataModel.lifecycle_record.sequence_description_value._label_fr, "daté du", dataModel.lifecycle_record.sequence_from_date)
    //     }      
    //   } else {
    //     dataModel.lifecycle_record.transaction_description = {
    //       '_label_en':concat(dataModel.lifecycle_record.sequence_description_value._label_en, dataModel.lifecycle_record.sequence_from_date),
    //       '_label_fr':concat(dataModel.lifecycle_record.sequence_description_value._label_fr, dataModel.lifecycle_record.sequence_from_date)
    //     }  
    //   }
    //   if (isFrench(lang)) {
    //     dataModel.lifecycle_record.transaction_description.__text = dataModel.lifecycle_record.transaction_description._label_fr;
    //   }else{
    //     dataModel.lifecycle_record.transaction_description.__text = dataModel.lifecycle_record.transaction_description._label_en;
    //   }
    // }
    // HPFBFORMS-192, Master File Name, allow any case in form but when saving to XML put in upper case
    // const masterFileNameMapping = findDataMappingByFormControlName(this.regInfoDataMappings, 'masterFileName');
    // if (masterFileNameMapping == null) {
    //   console.log("couldn't find masterFileNameMapping");
    // } else {
    //   if (dataModel[masterFileNameMapping.outputDataName]) {
    //     dataModel[masterFileNameMapping.outputDataName] = dataModel[masterFileNameMapping.outputDataName].toUpperCase();
    //   }
    // }
  }

  public mapDataModelToFormModel(
    dataModel: Ectd,
    formRecord: FormGroup,
    lang: string
  ): void {
    // loop through all mappings to set form values from the data model
    for (let mapping of this.regInfoDataMappings) {
      this._converterService.convertOutputModelToFormData(
        mapping,
        formRecord,
        dataModel,
        lang
      );
    }

    // loop through all mappings again to deal with  those form controls whose value is an object
    // it will use the object id, which is set to the from control by previous looping, to find the object from the object subscription and then assign the object to the form control
    for (let mapping of this.regInfoDataMappings) {
      if (mapping.outputDataType === OP_TYPE_IDTEXTLABEL) {
        const control = formRecord.controls[
          mapping.formControlName
        ] as FormControl;
        const controlName = mapping.formControlName;

        // if (controlName === 'masterFileType') {
        //   updateControlValue(controlName, control,  this.mfTypeOptions$ );
        // } else if (controlName === 'masterFileUse') {
        //   updateControlValue(controlName, control, this.mfUseOptions$);
        // }
      }
    }
  }

}
