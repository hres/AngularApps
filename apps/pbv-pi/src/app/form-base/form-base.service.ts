import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { EntityBaseService, UtilsService } from '@hpfb/sdk/ui';
import { ROOT_TAG } from '../app.constants';
import { DrugProductEnrol, ProductInformation } from '../models/ProductInformation';

@Injectable()
export class FormBaseService {

  constructor(
    private _entityBaseService: EntityBaseService, private _utilsService: UtilsService, private _globalService: GlobalService) {
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
      check_sum: ''
    };
    
    return drugProductEnrol;
  }
}
