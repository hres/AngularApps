import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { EntityBaseService, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { ApplicationInfo, Enrollment, Device, BiologicalMaterial, BiologicalMaterialData } from '../models/Enrollment';
import { ApplicationInfoDetailsService } from '../application-info-details/application-info.details.service';
import { GlobalService } from '../global/global.service';
import { DeviceService } from '../inter-device/device.service';
import { MaterialService } from '../bio-material/material.service';
// import {GlobalsService} from '../globals/globals.service';
// import {ValidationService} from '../validation.service';
// import {ListService} from '../list-service';

@Injectable()
export class ApplicationInfoBaseService {


  constructor(private _fb: FormBuilder, 
              private _entityBaseService: EntityBaseService, 
              private _globalService: GlobalService,
              private _utilsService: UtilsService,
              private _applicationInfoDetailsService : ApplicationInfoDetailsService,
              private _deviceService : DeviceService,
              private _materialService : MaterialService) {
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
        template_version: '',
        application_info: this.getEmptyApplicationInfoModel(),
        devices: {device: []},
        material_info: this.getEmptyMaterialInfoModel()
        // biological_materials: null, // TODO DIANA - Is this undefined? Search for list of objects
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
        regulatory_activity_lead: this._getRegulatoryActivityLead(),
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
        compliance: null,
        other_pharmacopeia: '',
        provision_mdr_it:  '',
        provision_mdr_sa: '',
        application_number: '',
        sap_request_number:'',
        interim_order_authorization: '',
        authorization_id: '',
        declaration_conformity:  '',
        // has_recombinant: '',
        // is_animal_human_sourced: '',
        // is_listed_idd_table: '',
        priority_review: '',
        is_diagnosis_treatment_serious: null
      }
    )
  }

  public getEmptyDeviceModel() : Device {
    return (
      {
        id: null,
        device_name: '',
        device_authorized: '',
        licence_number: '',
        device_application_submitted: '',
        device_application_number: '',
        device_explain: ''
      }
    )
  }

  public getEmptyMaterialInfoModel() : BiologicalMaterialData {
    return (
      {
        has_recombinant: '',
        is_animal_human_sourced: '',
        is_listed_idd_table: '',
        biological_materials: {material: []}
      }
    )
  }

  public getEmptyMaterialModel(): BiologicalMaterial {
    return (
      {
        material_id:                null,
        material_name:              '',
        device_name:                '',
        origin_country:             this._entityBaseService.getEmptyIdTextLabel(),
        family_of_species:          this._entityBaseService.getEmptyIdTextLabel(),
        tissue_substance_type:      this._entityBaseService.getEmptyIdTextLabel(),
        tissue_type_other_details:  '',
        derivative:                 this._entityBaseService.getEmptyIdTextLabel(),
        derivative_other_details:   ''
      }
    )
  }


  private _getRegulatoryActivityLead() {
    return this._utilsService.createIIdTextLabelObj('B14-20160301-08', 'Medical Device Directorate', 'Direction des instruments médicaux');
  }

  mapFormToOutput(aiDetailsForm, devicesForm, materialDetailsForm, materialsForm) {
    let deviceModelList = [];
    let materialModelList = [];
    let materialInfoModel : BiologicalMaterialData = null;
    
    let aiModel: ApplicationInfo = this.getEmptyApplicationInfoModel();
    console.log("printing ai form..", aiDetailsForm);
    this._applicationInfoDetailsService.mapFormModelToDataModel(aiDetailsForm, aiModel, this._globalService.lang());
    console.log("printing ai model after mapping...", aiModel);

    if (devicesForm) {
      for (let i = 0; i < devicesForm.length; i++) {
        console.log("print device from", devicesForm[i]);
        let deviceModel: Device = this.getEmptyDeviceModel();
        this._deviceService.mapFormModelToOutputModel(devicesForm[i].deviceInfo, deviceModel);
        deviceModelList.push(deviceModel);
      }
    }
    console.log("printing device model list...", deviceModelList);

    if (materialDetailsForm) {
      materialInfoModel = this.getEmptyMaterialInfoModel();
      console.log("printing material info form...", materialDetailsForm);
      this._materialService.mapMaterialInfoModelToOutput(materialDetailsForm, materialInfoModel);

      if (materialsForm) {
        for (let i = 0; i < materialsForm.length; i++) {
          console.log("print material from", materialsForm[i]);
          let materialModel: BiologicalMaterial = this.getEmptyMaterialModel();
          this._materialService.mapMaterialModelToOutputModel(materialsForm[i].materialInfo, materialModel);
          materialModelList.push(materialModel);
        }

        materialInfoModel.biological_materials = {material : materialModelList};
      }
    }

    const output: Enrollment = {
      'DEVICE_APPLICATION_INFO': {
        'template_version': this._globalService.$appVersion,
        'application_info': aiModel,
        'devices': {device : deviceModelList},
        'material_info' : materialInfoModel
       }
   };

   // update the last_saved_date
   output.DEVICE_APPLICATION_INFO.application_info.last_saved_date = this._utilsService.getFormattedDate('yyyy-MM-dd-hhmm')

   return output;
  }

 
}
