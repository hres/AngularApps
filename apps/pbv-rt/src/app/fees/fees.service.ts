import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConverterService, ENGLISH, FRENCH, ITextLabel, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { Ectd, FeeDetails, Mitigation, TransactionEnrol } from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { data } from 'jquery';

@Injectable()
export class FeesService {

  constructor(private _globalService: GlobalService, private _converterService: ConverterService, private _utilsService: UtilsService) {}

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

  public mapFormModelToDataModel(formValue: any, dataModel: FeeDetails): void {
    const lang = this._globalService.currLanguage;

    dataModel.submission_class = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.submissionClasses, formValue['subClass'], lang);
    if (dataModel.submission_class) {
      dataModel.submission_description ={} as ITextLabel;
      this.mapSubmissionDescriptionToDataModel(dataModel.submission_class._id, dataModel.submission_description, lang);
    }
    if (formValue['mitigationType']) {
      dataModel.mitigation = {} as Mitigation;
      dataModel.mitigation.mitigation_type = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.mitigationTypes, formValue['mitigationType'], lang);
      dataModel.mitigation.certify_funded_health_institution = formValue['certifyFundedInstitution'] == true ? 'Y': 'N';
      dataModel.mitigation.certify_government_organization = formValue['certifyGovOrg'] == true ? 'Y': 'N';
      dataModel.mitigation.certify_organization = formValue['certifySmallBusiness'] == true ? 'Y': 'N';
      dataModel.mitigation.certify_urgent_health_need = formValue['certifyUrgentHealthNeed'] == true ? 'Y': 'N';
      dataModel.mitigation.certify_isad = formValue['certifyISAD'] == true ? 'Y': 'N';
      dataModel.mitigation.small_business_fee_application = formValue['smallBusinessFeeApp'];
    }
  }

  public mapDataModelToFormModel(dataModel: FeeDetails, formRecord: FormGroup): void {
    formRecord.controls['subClass'].setValue(dataModel.submission_class);
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

  private mapSubmissionDescriptionToDataModel(submissionClassId: string, submissionDescription: ITextLabel, lang: string) {
    submissionDescription.__text = this._utilsService.getCodeDefinitionByIdByLang(submissionClassId, this._globalService.submissionClasses, lang);
    submissionDescription._label_en = this._utilsService.getCodeDefinitionByIdByLang(submissionClassId, this._globalService.submissionClasses, ENGLISH);
    submissionDescription._label_fr = this._utilsService.getCodeDefinitionByIdByLang(submissionClassId, this._globalService.submissionClasses, FRENCH);

  }
}
