import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConverterService, UtilsService} from '@hpfb/sdk/ui';
import { TransactionEnrol } from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { PbvValidationService } from '@hpfb/pbv';

@Injectable()
export class RegulatoryInformationService {

  constructor(private _globalService: GlobalService, private _converterService: ConverterService, private _utilsService: UtilsService) {}

  public static getRegularInfoForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   return fb.group({
    dossierType: [null, [Validators.required]],
    dossierId: [null, [Validators.required, PbvValidationService.dossierIdValidator]],
    companyId: [null, [Validators.required, Validators.minLength(5)]],
    productName: [null, [Validators.required]],
    isPriority: [null, [Validators.required]],
    isNOC: [null, [Validators.required]],
    isAdminSubmission: [null, [Validators.required]],
    adminSubType:[null, [Validators.required]],
   });
  }

  public mapFormModelToDataModel(formValue: any, dataModel: TransactionEnrol): void {
    const lang = this._globalService.currLanguage;

    dataModel.ectd.dossier_type = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.dossierTypes, formValue['dossierType'], lang);
    dataModel.ectd.company_id = formValue['companyId'];
    dataModel.ectd.dossier_id = formValue['dossierId'];
    dataModel.ectd.product_name = (formValue['productName']||"").toUpperCase();
    dataModel.is_priority = formValue['isPriority'];
    dataModel.is_noc = formValue['isNOC'];
    dataModel.is_admin_sub = formValue['isAdminSubmission'];
    dataModel.sub_type = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.adminSubTypes, formValue['adminSubType'], lang);

  }

  public mapDataModelToFormModel(dataModel: TransactionEnrol, formRecord: FormGroup): void {
    if(dataModel.ectd.dossier_type?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.ectd.dossier_type);
      formRecord.controls['dossierType'].setValue(id? id : null);
    } else {
      formRecord.controls['dossierType'].setValue(null);
    }
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

  }

}
