import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConverterService, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { Ectd, TransactionEnrol } from '../models/transaction';
import { GlobalService } from '../global/global.service';

@Injectable()
export class FeesService {

  constructor(private _globalService: GlobalService, private _converterService: ConverterService, private _utilsService: UtilsService) {}

  // showDateAndRequesterTxDescs: string[] = ['12','13', '14'];

  public static getFeesForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   return fb.group({
     subClass: [null, [Validators.required]],
     mitigationType:[null],
     certifyGovOrg: [null, [Validators.required]],
     certifyISAD: [null, [Validators.required]],
     certifyFundedInstitution: [null, [Validators.required]],
     certifySmallBusiness: [null, [Validators.required]],
     smallBusinessFeeApp: [null, [Validators.required]],
     certifyUrgentHealthNeed: [null, [Validators.required]]
   });
  }

  public mapFormModelToDataModel(formValue: any, dataModel: TransactionEnrol): void {
    const lang = this._globalService.currLanguage;

    dataModel.fee_details.submission_class = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.submissionClasses, formValue['subClass'], lang);
  }

  public mapDataModelToFormModel(dataModel: TransactionEnrol, formRecord: FormGroup): void {
    formRecord.controls['subClass'].setValue(dataModel.fee_details.submission_class);
    // formRecord.controls['dossierId'].setValue(dataModel.ectd.dossier_id);
    // formRecord.controls['productName'].setValue(dataModel.ectd.product_name);
    // formRecord.controls['isPriority'].setValue(dataModel.is_priority);
    // formRecord.controls['isNOC'].setValue(dataModel.is_noc);
    // formRecord.controls['isAdminSubmission'].setValue(dataModel.is_admin_sub);
    // if(dataModel.sub_type?._id){
    //   const id = this._utilsService.getIdFromIdTextLabel(dataModel.sub_type);
    //   formRecord.controls['adminSubType'].setValue(id? id : null);
    // } else {
    //   formRecord.controls['adminSubType'].setValue(null);
    // }
    // formRecord.controls['isFees'].setValue(dataModel.is_fees);
  }

}
