import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { EntityBaseService, UtilsService } from '@hpfb/sdk/ui';
import { ROOT_TAG } from '../app.constants';
import { DrugProductEnrol, ProductInformation } from '../models/ProductInformation';
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
      is_schedule_claim: undefined,
      disinfectant_types:undefined,
      proposedIndicationOfUseDosage:'',
      formulation_details: undefined,
      };

    return drugProductEnrol;
  }


  public mapProductInfoFormToOutput(outputDrugProductEnrol: DrugProductEnrol, productInfoFormGroupValue: any): void{
    this._productInfoService.mapFormModelToDataModel(productInfoFormGroupValue, outputDrugProductEnrol);
  }
}
