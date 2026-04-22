import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { EntityBaseService, UtilsService } from '@hpfb/sdk/ui';
import { ROOT_TAG } from '../app.constants';
import { DrugProductEnrol, Ingredient, ProductInformation } from '../models/ProductInformation';
import { ProductInformationService } from '../product-information/product-information.service';
import { IngredientFormulationItemService } from '../ingredient-formulation/ingredient-formulation-item/ingredient-formulation-item.service';
@Injectable()
export class FormBaseService {

  constructor(
    private _entityBaseService: EntityBaseService, private _utilsService: UtilsService, private _globalService: GlobalService,
    private _productInfoService: ProductInformationService,
    private _ingredFormItemService: IngredientFormulationItemService) {
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
      is_schedule_claim: undefined,
      disinfectant_types:undefined,
      proposedIndicationOfUseDosage:'',
      formulation_details: undefined,
      ingredients_testing: undefined
      };

    return drugProductEnrol;
  }

  public getEmptyIngredientRecord() : Ingredient {
    const ingredient :  Ingredient = {
      id : null,
      role : this._entityBaseService.getEmptyIdTextLabel(),
      ingredient_name : '',
      proprietary_attestation : '',
      proprietary_information : '',
      // Add text for propriety here;
      variant_name : '',
      purpose : '',
      cas_number : '',
      ingred_standard : '',
      strength : '',
      operator : this._entityBaseService.getEmptyIdTextLabel(),
      value : '',
      lower_limit : '',
      upper_limit : '',
      units : this._entityBaseService.getEmptyIdTextLabel(),
      units_other : '',
      per : this._entityBaseService.getEmptyIdTextLabel(),
      per_value : '',
      per_units : this._entityBaseService.getEmptyIdTextLabel(),
      per_units_other_details :'',
      is_base_calc : '',
      is_nanomaterial : '',
      nanomaterial : this._entityBaseService.getEmptyIdTextLabel(),
      nanomaterial_details : '',
      is_animal_human_material : ''
    }

    return ingredient;
  }
  

  public mapProductInfoFormToOutput(outputDrugProductEnrol: DrugProductEnrol, productInfoFormGroupValue: any): void{
    this._productInfoService.mapFormModelToDataModel(productInfoFormGroupValue, outputDrugProductEnrol);
  }

  public mapIngredientFormulationFormToOutput(drugProductEnrol : DrugProductEnrol, ingredFormValue : any) : void {
    const lang = this._globalService.currLanguage;
    let ingredientModelList = [];
    if (ingredFormValue) {
      for (let i = 0; i < ingredFormValue.length; i++) {
        let ingredModel: Ingredient = this.getEmptyIngredientRecord();
        // TODO: Call function to map company roles
        this._ingredFormItemService.mapFormModelToDataModel(ingredFormValue[i], ingredModel);
        ingredientModelList.push(ingredModel);
      }
    }

    drugProductEnrol.ingredients_testing = ingredientModelList;
  }
}
