import { inject, Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConverterService, ENGLISH, FRENCH, ITextLabel, UtilsService, ValidationService, YES } from '@hpfb/sdk/ui';
import { Ectd, FeeDetails, Mitigation, TransactionEnrol } from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { data } from 'jquery';
import { AppSignalService } from '../signal/app-signal.service';

@Injectable()
export class FeesService {

  private _signalService = inject(AppSignalService);

  constructor(private _globalService: GlobalService, private _converterService: ConverterService, private _utilsService: UtilsService) {}

  public static getFeesForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   return fb.group({
     subClass: [null, [Validators.required]],
     subDescription: [null],
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
      dataModel.mitigation.certify_funded_health_institution = formValue['certifyFundedInstitution'];
      dataModel.mitigation.certify_government_organization = formValue['certifyGovOrg'];
      dataModel.mitigation.certify_small_business = formValue['certifySmallBusiness'];
      dataModel.mitigation.certify_urgent_health_need = formValue['certifyUrgentHealthNeed'];
      dataModel.mitigation.certify_isad = formValue['certifyISAD'];
      dataModel.mitigation.small_business_fee_application = !formValue['smallBusinessFeeApp'] ? undefined : formValue['smallBusinessFeeApp'] === 'Y' ? 'Y' : 'N';
    }
  }

  public mapDataModelToFormModel(dataModel: FeeDetails, formRecord: FormGroup): void {
    if (dataModel.submission_class?._id) {
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.submission_class);
      formRecord.controls['subClass'].setValue(id? id: null);
      const codeDefinition = this._utilsService.findCodeDefinitionById(this._globalService.submissionClasses, id);
      formRecord.controls['subDescription'].setValue(this._utilsService.getCodeDefinitionByLang(codeDefinition, this._globalService.currLanguage));
    }
    if (dataModel.mitigation?.mitigation_type?._id) {
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.mitigation.mitigation_type);
      this._signalService.setMitigationType(id);
      formRecord.controls['mitigationType'].setValue(id? id: null);
      formRecord.controls['certifyGovOrg'].setValue(dataModel.mitigation.certify_government_organization=='Y' || dataModel.mitigation.certify_government_organization? true:null);
      formRecord.controls['certifyISAD'].setValue(dataModel.mitigation.certify_isad=='Y' || dataModel.mitigation.certify_isad? true:null);
      formRecord.controls['certifyFundedInstitution'].setValue(dataModel.mitigation.certify_funded_health_institution=='Y' || dataModel.mitigation.certify_funded_health_institution? true:null);
      formRecord.controls['certifySmallBusiness'].setValue(dataModel.mitigation.certify_small_business=='Y' || dataModel.mitigation.certify_small_business? true:null);
      formRecord.controls['certifyUrgentHealthNeed'].setValue(dataModel.mitigation.certify_urgent_health_need=='Y' || dataModel.mitigation.certify_urgent_health_need? true:null);
      formRecord.controls['smallBusinessFeeApp'].setValue(dataModel.mitigation.small_business_fee_application);
    }
  }

  private mapSubmissionDescriptionToDataModel(submissionClassId: string, submissionDescription: ITextLabel, lang: string) {
    submissionDescription.__text = this._utilsService.getCodeDefinitionByIdByLang(submissionClassId, this._globalService.submissionClasses, lang);
    submissionDescription._label_en = this._utilsService.getCodeDefinitionByIdByLang(submissionClassId, this._globalService.submissionClasses, ENGLISH);
    submissionDescription._label_fr = this._utilsService.getCodeDefinitionByIdByLang(submissionClassId, this._globalService.submissionClasses, FRENCH);
  }
}
