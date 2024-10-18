import { inject, Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConverterService, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { Ectd, TransactionEnrol } from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { AppSignalService } from '../signal/app-signal.service';
import { TransactionDetailsService } from '../transaction-details/transaction-details.service';

@Injectable()
export class RegulatoryInformationService {

  private _signalService = inject(AppSignalService)

  constructor(private _globalService: GlobalService, private _converterService: ConverterService, private _utilsService: UtilsService) {}

  public static getRegularInfoForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   return fb.group({
    dossierType: [null, [Validators.required]],
    dossierId: [null, [Validators.required, this.pharmabioDossierIdValidator]],
    companyId: [null, [Validators.required]],
    productName: [null, [Validators.required]],
    isPriority: [null, [Validators.required]],
    isNOC: [null, [Validators.required]],
    isAdminSubmission: [null, [Validators.required]],
    adminSubType:[null, [Validators.required]],
    isFees: [null, [Validators.required]]
   });
  }

  public mapFormModelToDataModel(formValue: any, dataModel: TransactionEnrol): void {
    const lang = this._globalService.currLanguage;

    dataModel.ectd.dossier_type = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.dossierTypes, formValue['dossierType'], lang);
    dataModel.ectd.company_id = formValue['companyId'];
    dataModel.ectd.dossier_id = formValue['dossierId'];
    dataModel.ectd.product_name = formValue['productName'];
    dataModel.is_priority = formValue['isPriority'];
    dataModel.is_noc = formValue['isNOC'];
    dataModel.is_admin_sub = formValue['isAdminSubmission'];
    dataModel.sub_type = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.adminSubTypes, formValue['adminSubType'], lang);
    dataModel.is_fees = formValue['isFees'];
  }

  public mapDataModelToFormModel(dataModel: TransactionEnrol, formRecord: FormGroup): void {
    if(dataModel.ectd.dossier_type?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.ectd.dossier_type);
      formRecord.controls['dossierType'].setValue(id? id : null);
    } else {
      formRecord.controls['dossierType'].setValue(null);
    }
    this._signalService.setSelectedDossierType(formRecord.controls['dossierType'].value)

    formRecord.controls['companyId'].setValue(dataModel.ectd.company_id);
    formRecord.controls['dossierId'].setValue(dataModel.ectd.dossier_id);
    formRecord.controls['productName'].setValue(dataModel.ectd.product_name);
    formRecord.controls['isPriority'].setValue(dataModel.is_priority);
    formRecord.controls['isNOC'].setValue(dataModel.is_noc);
    formRecord.controls['isAdminSubmission'].setValue(dataModel.is_admin_sub);
    if(dataModel.sub_type?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.sub_type);
      formRecord.controls['adminSubType'].setValue(id? id : null);
    } else {
      formRecord.controls['adminSubType'].setValue(null);
    }
    formRecord.controls['isFees'].setValue(dataModel.is_fees);
  //   formRecord.controls['masterFileNumber'].setValue(dataModel.lifecycle_record.master_file_number);

  //   if(dataModel.lifecycle_record.regulatory_activity_type?._id){
  //     const id = this._utilsService.getIdFromIdTextLabel(dataModel.lifecycle_record.regulatory_activity_type);
  //     formRecord.controls['masterFileType'].setValue(id? id : null);
  //   } else {
  //     formRecord.controls['masterFileType'].setValue(null);
  //   }

  //   if(dataModel.lifecycle_record.master_file_use?._id){
  //     const id = this._utilsService.getIdFromIdTextLabel(dataModel.lifecycle_record.master_file_use);
  //     formRecord.controls['masterFileUse'].setValue(id? id : null);
  //   } else {
  //     formRecord.controls['masterFileUse'].setValue(null);
  //   }

  //   if(dataModel.lifecycle_record.sequence_description_value?._id){
  //     const id = this._utilsService.getIdFromIdTextLabel(dataModel.lifecycle_record.sequence_description_value);
  //     formRecord.controls['descriptionType'].setValue(id? id : null);
  //   } else {
  //     formRecord.controls['descriptionType'].setValue(null);
  //   }

  //   formRecord.controls['requestDate'].setValue(dataModel.lifecycle_record.sequence_from_date);
  //   formRecord.controls['requester'].setValue(dataModel.lifecycle_record.requester_of_solicited_information);
  //   formRecord.controls['reqRevision'].setValue(dataModel.lifecycle_record.revise_trans_desc_request);

  //   if (dataModel.lifecycle_record.revised_trans_desc?._id) {
  //     const id = this._utilsService.getIdFromIdTextLabel(dataModel.lifecycle_record.revised_trans_desc);
  //     formRecord.controls['revisedDescriptionType'].setValue(id? id : null);
  //   } else {
  //     formRecord.controls['revisedDescriptionType'].setValue(null);
    // }

  }

  //TODO: to move to pharmabio library
  static pharmabioDossierIdValidator(control) {
    if (!control.value) {
      return null;
    }
    if (control.value.match(/^[a-z]{1}[0-9]{6}$/)) {
      return null;
    } else {
      return {'error.mgs.dossier.id': true};
    }
  }

}
