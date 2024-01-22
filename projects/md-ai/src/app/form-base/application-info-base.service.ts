import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { EntityBaseService, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { ApplicationInfo, Enrollment, Device, BiologicalMaterial } from '../models/Enrollment';
// import {GlobalsService} from '../globals/globals.service';
// import {ValidationService} from '../validation.service';
// import {ListService} from '../list-service';

@Injectable()
export class ApplicationInfoBaseService {


  constructor(private _fb: FormBuilder, private _entityBaseService: EntityBaseService, private _utilsService: UtilsService) {
  }

  /**
   * Gets the reactive forms Model for generalInfo details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) {
      return null;
    }
    return fb.group({
      // enrolVersion: '0.0',
      // lastSavedDate: '',
      // companyId: ['', [Validators.required, Validators.min(6)]],
      // dossierId: ['', [Validators.required, Validators.min(7)]],
      // mdsapNum: [null, Validators.required],
      // mdsapOrg: [null, Validators.required],
      // licenceAppType: [null, Validators.required],
      // activityType: [null, Validators.required],
      // deviceClass: [null, Validators.required],
      // isIvdd: [null, Validators.required],
      // isHomeUse: [null, Validators.required],
      // isCarePoint: [null, Validators.required],
      // isEmitRadiation: [null, Validators.required],
      // hasDrug: [null, Validators.required],
      // hasDinNpn: [null, []],
      // din: ['', [Validators.required, Validators.min(8)]],
      // npn: ['', [Validators.required, Validators.min(8)]],
      // drugName: [null, Validators.required],
      // activeIngredients: [null, Validators.required],
      // manufacturer: [null, Validators.required],
      // hasCompliance: [null, Validators.required],
      // complianceUsp: [false, []],
      // complianceGmp: [false, []],
      // complianceOther: [false, []],
      // otherPharmacopeia: [null, Validators.required],
      // provisionMdrIT: [false, []],
      // provisionMdrSA: [false, []],
      // applicationNum: ['', []],
      // sapReqNum: ['', []],
      // declarationConformity : [null, Validators.required],
      // hasRecombinant: [null, Validators.required],
      // isAnimalHumanSourced : [null, Validators.required],
      // hasMaterial: [null, Validators.required],
      // isListedIddTable: [null, Validators.required]
    });
  }

  public getEmptyEnrol(): Enrollment {
    const enrollment: Enrollment = {
      DEVICE_APPLICATION_INFO: {
        software_version: '',
        application_info: this.getEmptyApplicationInfoModel(),
        devices: undefined, // TODO DIANA - Is this undefined? Search for list of objects
        biological_materials: undefined, // TODO DIANA - Is this undefined? Search for list of objects
      }
    };

    return enrollment;
  }

  public getEmptyApplicationInfoModel(): ApplicationInfo {
    return (
      {
        last_saved_date: '',
        company_id: '',
        dossier_id: '',
        mdsap_number: '',
        mdsap_org: this._entityBaseService.getEmptyIdTextLabel(),
        licence_application_type: this._entityBaseService.getEmptyIdTextLabel(),
        regulatory_activity_type: this._entityBaseService.getEmptyIdTextLabel(),
        device_class: this._entityBaseService.getEmptyIdTextLabel(),
        is_ivdd: '',
        is_home_use: '',
        is_care_point_use: '',
        is_emit_radiation: '',
        has_drug: '',
        has_din_npn: this._entityBaseService.getEmptyIdTextLabel(),
        din: '',
        npn: '',
        drug_name: '',
        active_ingredients: '',
        manufacturer: '',
        compliance: this._entityBaseService.getEmptyIdTextLabel(),
        other_pharmacopeia: '',
        provision_mdr_it:  '',
        provision_mdr_sa: '',
        application_number: '',
        sap_request_number:'',
        interim_order_authorization: '',
        authorization_id: '',
        declaration_conformity:  '',
        has_recombinant: '',
        is_animal_human_sourced: '',
        is_listed_idd_table: '',
        priority_review: '',
        is_diagnosis_treatment_serious: ''
      }
    )
  }

 
}
