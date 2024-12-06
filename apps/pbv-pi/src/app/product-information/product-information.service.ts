import { Injectable } from '@angular/core';
import { ConverterService, UtilsService} from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { DrugProductEnrol } from '../models/ProductInformation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PbvService } from '@hpfb/pbv';

@Injectable()
export class ProductInformationService {

  constructor(private _globalService: GlobalService, private _converterService: ConverterService, private _utilsService: UtilsService) {}

  public static getRegularInfoForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   return fb.group({
    dossierType: [null, [Validators.required]],
    dossierId: [null, [Validators.required, PbvService.pharmabioDossierIdValidator]],
    companyId: [null, [Validators.required, Validators.minLength(5)]],
    productName: [null, [Validators.required]],
    properName: [null, [Validators.required]],
    isAdminSub: [null],
    subType: [null],
    manufacturer: [null],
    mailing: [null],
    this_activity: [null],
    importer: [null]
   });
  }

  public mapFormModelToDataModel(formValue: any, dataModel: DrugProductEnrol): void {
    const lang = this._globalService.currLanguage;
  }

  public mapDataModelToFormModel(dataModel: DrugProductEnrol, formRecord: FormGroup): void {
    if(dataModel.dossier_type?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.dossier_type);
      formRecord.controls['dossierType'].setValue(id? id : null);
    } else {
      formRecord.controls['dossierType'].setValue(null);
    }
    }
}