import { Injectable } from '@angular/core';
import { ConverterService, UtilsService} from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { DrugProductEnrol, SchemaClaimGroup } from '../models/ProductInformation';
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
    dossierId: [null],
    companyId: [null, [Validators.required, Validators.minLength(5)]],
    productName: [null, [Validators.required]],
    properName: [null, [Validators.required]],
    isAdminSub: [null],
    subType: [null, [Validators.required]],
    manufacturer: [null],
    mailing: [null],
    thisActivity: [null],
    importer: [null],
    isSchedule: [null],
    isInclude: [null],
    isOnDrugList: [null],
    isRegulated: [null],
    isOnDrug: [null],
    isNonPrescriptioScheduleApplied: [null],
    isDrugPermitted: [null],
    dosAge: [null, [Validators.required]],
    drugUse: [null, [Validators.required]],
    schedule_claim_group:this.getScheduleClaimfoForm(fb)
   });

  }

  public static getScheduleClaimfoForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   return fb.group({
    isAcute_Alcoholism: [null],
      isAcute_inflammatory_and_debilitating_arthiritis: [null],
      isAteriosclerosis: [null],
      isCancer: [null],
      isDementia: [null],
      isGangrene: [null],
      isHepatitis: [null],
      isObesity:  [null],
      isSexually_transmitted_disease:[null],
      isThyroid_disease: [null],
      isAcute_anxiety_state: [null],
      isAcute_psychotic_conditions: [null],
      isAcute_infectious_respiratory_syndromes: [null],
      isAddiction_except_nicotine_addiction: [null],
      isAppendicitis: [null],
      isCongestive_heart_failure: [null],
      isDepression: [null],
      isGlaucoma: [null],
      isHypertension: [null],
      isRheumatic_fever: [null],
      isStrangulated_hernia: [null],
      isUlcer_of_gastro_intestinal_tract: [null],
      isAsthma:[null],
      isConvulsions: [null],
      isDiabetes: [null],
      isHaematologic_bleeding_disorders: [null],
      isNausea_and_vomiting_of_pregnancy: [null],
      isSepticemia: [null],
      isThrombotic_and_embolic_disorder: [null],
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
    dataModel.isSchedule = formValue['isSchedule'] == true ? 'Y': undefined;
    dataModel.isInclude = formValue['isInclude'] == true ? 'Y': undefined;
    dataModel.isOnDrugList = formValue['isOnDrugList'] == true ? 'Y': undefined;
    dataModel.isRegulated = formValue['isRegulated'] == true ? 'Y': undefined;
    dataModel.isOnDrug = formValue['isOnDrug'] == true ? 'Y': undefined;
    dataModel.isNonPrescriptioScheduleApplied = formValue['isNonPrescriptioScheduleApplied'] == true ? 'Y': undefined;
    if (formValue['isNonPrescriptioScheduleApplied'] == true){

    dataModel.schedule_claim_group.isThrombotic_and_embolic_disorder=formValue['schedule_claim_group']['isThrombotic_and_embolic_disorder'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isCancer=formValue['schedule_claim_group']['isCancer'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isAcute_anxiety_state=formValue['schedule_claim_group']['isAcute_anxiety_state'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isAcute_Alcoholism=formValue['schedule_claim_group']['isAcute_Alcoholism'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isAcute_inflammatory_and_debilitating_arthiritis=formValue['schedule_claim_group']['isAcute_inflammatory_and_debilitating_arthiritis'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isAteriosclerosis=formValue['schedule_claim_group']['isAteriosclerosis'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isDementia=formValue['schedule_claim_group']['isDementia'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isGangrene=formValue['schedule_claim_group']['isGangrene'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isHepatitis=formValue['schedule_claim_group']['isHepatitis'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isObesity=formValue['schedule_claim_group']['isObesity'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isSexually_transmitted_disease=formValue['schedule_claim_group']['isSexually_transmitted_disease'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isThyroid_disease=formValue['schedule_claim_group']['isThyroid_disease']  == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isAcute_anxiety_state=formValue['schedule_claim_group']['isAcute_anxiety_state']  == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isAcute_infectious_respiratory_syndromes=formValue['schedule_claim_group']['isAcute_infectious_respiratory_syndromes'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isAddiction_except_nicotine_addiction=formValue['schedule_claim_group']['isAddiction_except_nicotine_addiction']  == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isAcute_inflammatory_and_debilitating_arthiritis=formValue['schedule_claim_group']['isAcute_inflammatory_and_debilitating_arthiritis'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isAppendicitis=formValue['schedule_claim_group']['isAppendicitis']  == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isCongestive_heart_failure=formValue['schedule_claim_group']['isCongestive_heart_failure'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isDepression=formValue['schedule_claim_group']['isDepression'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isGlaucoma=formValue['schedule_claim_group']['isGlaucoma'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isHypertension=formValue['schedule_claim_group']['isHypertension']  == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isRheumatic_fever=formValue['schedule_claim_group']['isRheumatic_fever'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isStrangulated_hernia=formValue['schedule_claim_group']['isStrangulated_hernia']  == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isUlcer_of_gastro_intestinal_tract=formValue['schedule_claim_group']['isUlcer_of_gastro_intestinal_tract'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isAsthma=formValue['schedule_claim_group']['isAsthma'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isConvulsions=formValue['schedule_claim_group']['isConvulsions']  == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isDiabetes=formValue['schedule_claim_group']['isDiabetes'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isHaematologic_bleeding_disorders=formValue['isHaematologic_bleeding_disorders.isCancer'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isNausea_and_vomiting_of_pregnancy=formValue['schedule_claim_group']['isNausea_and_vomiting_of_pregnancy'] == true ? 'Y': undefined;
    dataModel.schedule_claim_group.isSepticemia=formValue['schedule_claim_group']['isSepticemia']  == true ? 'Y': undefined;



    }else{
      dataModel.schedule_claim_group=null;
    }
    dataModel.isDrugPermitted = formValue['isDrugPermitted'] == true ? 'Y': undefined;
    dataModel.dosAge = formValue['dosAge'];
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
    formRecord.controls['isSchedule'].setValue(dataModel.isSchedule=='Y'?true:false);
    formRecord.controls['isInclude'].setValue(dataModel.isInclude=='Y'?true:false);
    formRecord.controls['isOnDrugList'].setValue(dataModel.isOnDrugList=='Y'?true:false);
    formRecord.controls['isRegulated'].setValue(dataModel.isRegulated=='Y'?true:false);
    formRecord.controls['isNonPrescriptioScheduleApplied'].setValue(dataModel.isNonPrescriptioScheduleApplied=='Y'?true:false);
    formRecord.controls['isOnDrug'].setValue(dataModel.isOnDrug=='Y'?true:false);
    formRecord.controls['isDrugPermitted'].setValue(dataModel.isDrugPermitted=='Y'?true:false);
    formRecord.controls['dosAge'].setValue(dataModel.dosAge);


    if(dataModel.drug_use?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.drug_use);
      formRecord.controls['drugUse'].setValue(id? id : null);
    } else {
      formRecord.controls['drugUse'].setValue(null);
    }

  }


    protected getEmptyScheduledClaim(){

      const schedulesOfClaimsApplied: SchemaClaimGroup = {
        isAcute_Alcoholism: '',
        isAcute_inflammatory_and_debilitating_arthiritis: '',
        isAteriosclerosis: '',
        isCancer: '',
        isDementia: '',
        isGangrene: '',
        isHepatitis: '',
        isObesity:  '',
        isSexually_transmitted_disease:'',
        isThyroid_disease: '',
        isAcute_anxiety_state: '',
        isAcute_psychotic_conditions: '',
        isAcute_infectious_respiratory_syndromes: '',
        isAddiction_except_nicotine_addiction: '',
        isAppendicitis: '',
        isCongestive_heart_failure: '',
        isDepression: '',
        isGlaucoma: '',
        isHypertension: '',
        isRheumatic_fever: '',
        isStrangulated_hernia: '',
        isUlcer_of_gastro_intestinal_tract: '',
        isAsthma:'',
        isConvulsions: '',
        isDiabetes: '',
        isHaematologic_bleeding_disorders: '',
        isNausea_and_vomiting_of_pregnancy: '',
        isSepticemia: '',
        isThrombotic_and_embolic_disorder: '',

    }
  return schedulesOfClaimsApplied;
  }
}