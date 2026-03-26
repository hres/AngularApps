import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { EntityBaseService, UtilsService } from '@hpfb/sdk/ui';
import { ROOT_TAG } from '../app.constants';
import { DrugProductEnrol, ProductInformation, SchemaClaimGroup } from '../models/ProductInformation';
import { ProductInformationService } from '../product-information/product-information.service';

@Injectable()
export class FormBaseService {

  constructor(
    private _entityBaseService: EntityBaseService, private _utilsService: UtilsService, private _globalService: GlobalService,
    private _productInfoService: ProductInformationService) {
  }

  /**
   * Gets the reactive forms Model for generalInfo details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {
      return null;
    }
    return fb.group({
      certifyPrivacy: [false, Validators.required],
    });
  }

  public getEmptyEnrol(): ProductInformation{
    const enrollment:  ProductInformation = {
      DRUG_PRODUCT_ENROL: this.getEmptyDrugProductEnrol()
    };

    return enrollment;
  }

  public getEmptyDrugProductEnrol(): DrugProductEnrol {
    const drugProductEnrol: DrugProductEnrol = {
      template_type: 'PHARMA',
      date_saved: undefined,
      software_version: '',
      form_language: '',
      check_sum: '',
      company_id: '',
      dossier_id: '',
      dossier_type: undefined,
      product_name: '',
      proper_name: '',
      is_admin_sub: '',
      sub_type: undefined,
      manufacturer: '',
      mailing: '',
      this_activity: '',
      importer: '',
      isSchedule: '',
      isInclude: '',
      isOnDrugList: '',
      isRegulated: '',
      isOnDrug: '',
      isNonPrescriptioScheduleApplied: '',
      isDrugPermitted: '',
      dosAge: '',
      drug_use: undefined,

      schedule_claim_group: this.getEmptyScheduledClaim(),
    };

    return drugProductEnrol;
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

  public mapProductInfoFormToOutput(outputDrugProductEnrol: DrugProductEnrol, productInfoFormGroupValue: any): void{
    this._productInfoService.mapFormModelToDataModel(productInfoFormGroupValue, outputDrugProductEnrol);
  }
}
