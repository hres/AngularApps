import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EntityBaseService, UtilsService } from '@hpfb/sdk/ui';
import { ApplicationInfo, Enrollment, Device, BiologicalMaterial, BiologicalMaterialData } from '../models/Enrollment';
import { ApplicationInfoDetailsService } from '../application-info-details/application-info.details.service';
import { GlobalService } from '../global/global.service';
import { DeviceService } from '../inter-device/device.service';
import { MaterialService } from '../bio-material/material.service';

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

  public getEmptyEnrol(): Enrollment {
    const enrollment: Enrollment = {
      DEVICE_APPLICATION_INFO: {
        template_version: '',
        form_language: '',
        application_info: this.getEmptyApplicationInfoModel(),
        devices: {device: []},
        material_info: this.getEmptyMaterialInfoModel()
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
        priority_review: '',
        is_diagnosis_treatment_serious: null
      }
    )
  }

  public getEmptyDeviceModel() : Device {
    return (
      {
        device_id: null,
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
    this._applicationInfoDetailsService.mapFormModelToDataModel(aiDetailsForm, aiModel, this._globalService.lang());

    if (devicesForm) {
      for (let i = 0; i < devicesForm.length; i++) {
        let deviceModel: Device = this.getEmptyDeviceModel();
        this._deviceService.mapFormModelToOutputModel(devicesForm[i].deviceInfo, deviceModel);
        deviceModel.device_id = devicesForm[i].id;
        deviceModelList.push(deviceModel);
      }
    }

    if (materialDetailsForm) {
      materialInfoModel = this.getEmptyMaterialInfoModel();
      this._materialService.mapMaterialInfoModelToOutput(materialDetailsForm, materialInfoModel);

      if (materialsForm) {
        for (let i = 0; i < materialsForm.length; i++) {
          let materialModel: BiologicalMaterial = this.getEmptyMaterialModel();
          this._materialService.mapMaterialModelToOutputModel(materialsForm[i].materialInfo, materialModel);
          materialModel.material_id = materialsForm[i].id;
          materialModelList.push(materialModel);
        }

        materialInfoModel.biological_materials = {material : materialModelList};
      }
    }

    const output: Enrollment = {
      'DEVICE_APPLICATION_INFO': {
        'template_version': this._globalService.$appVersion,
        'form_language': this._globalService.getCurrLanguage(),
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
