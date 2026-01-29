import { Injectable } from '@angular/core';
import { ConverterService, UtilsService} from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { DrugProductEnrol } from '../models/ProductInformation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PbvValidationService } from '@hpfb/pbv';
import { data } from 'jquery';

@Injectable()
export class ProductInformationService {

  constructor(private _globalService: GlobalService, private _converterService: ConverterService, private _utilsService: UtilsService) {}

  public static getProductInfoForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   return fb.group({
    dossierType: [null, [Validators.required]],
    dossierId: [null, [Validators.required, PbvValidationService.pharmabioDossierIdValidator]],
    companyId: [null, [Validators.required, Validators.minLength(5)]],
    productName: [null, [Validators.required]],
    properName: [null, [Validators.required]],
    isAdminSub: [null],
    subType: [null, [Validators.required]],
    manufacturer: [null],
    mailing: [null],
    thisActivity: [null],
    importer: [null],
    drugUse: [null, [Validators.required]],
   });
  }

  public mapFormModelToDataModel(formValue: any, dataModel: DrugProductEnrol): void {
    const lang = this._globalService.currLanguage;
    dataModel.dossier_type = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.dossierTypes, formValue['dossierType'], lang);
    dataModel.dossier_id = formValue['dossierId'];
    dataModel.company_id = formValue['companyId'];
    dataModel.product_name = formValue['productName'];
    dataModel.proper_name = formValue['properName'];
    dataModel.is_admin_sub = formValue['isAdminSub'];
    dataModel.sub_type = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.subTypeList, formValue['subType'], lang);
    dataModel.manufacturer = formValue['manufacturer'] == true ? 'Y': undefined;
    dataModel.mailing = formValue['mailing'] == true ? 'Y': undefined;
    dataModel.this_activity = formValue['thisActivity'] == true ? 'Y': undefined;
    dataModel.importer = formValue['importer'] == true ? 'Y': undefined;
    dataModel.drug_use = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.drugUse, formValue['drugUse'], lang);
  }

  public mapDataModelToFormModel(dataModel: DrugProductEnrol, formRecord: FormGroup): void {
    if(dataModel.dossier_type?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.dossier_type);
      formRecord.controls['dossierType'].setValue(id? id : null);
    } else {
      formRecord.controls['dossierType'].setValue(null);
    }
    formRecord.controls['dossierId'].setValue(dataModel.dossier_id);
    formRecord.controls['companyId'].setValue(dataModel.company_id);
    formRecord.controls['productName'].setValue(dataModel.product_name);
    formRecord.controls['properName'].setValue(dataModel.proper_name);
    formRecord.controls['isAdminSub'].setValue(dataModel.is_admin_sub);
    if(dataModel.sub_type?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.sub_type);
      formRecord.controls['subType'].setValue(id? id : null);
    } else {
      formRecord.controls['subType'].setValue(null);
    }
    formRecord.controls['manufacturer'].setValue(dataModel.manufacturer=='Y'?true:false);
    formRecord.controls['mailing'].setValue(dataModel.mailing=='Y'?true:false);
    formRecord.controls['thisActivity'].setValue(dataModel.this_activity=='Y'?true:false);
    formRecord.controls['importer'].setValue(dataModel.importer=='Y'?true:false);

    if(dataModel.drug_use?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.drug_use);
      formRecord.controls['drugUse'].setValue(id? id : null);
    } else {
      formRecord.controls['drugUse'].setValue(null);
    }
  }
}