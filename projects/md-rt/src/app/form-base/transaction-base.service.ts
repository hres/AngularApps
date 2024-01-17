import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { EntityBaseService, IIdTextLabel, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { ApplicationInfo, Enrollment, TransFees } from '../models/Enrollment';
// import {GlobalsService} from '../globals/globals.service';
// import {ValidationService} from '../validation.service';
// import {ListService} from '../list-service';

@Injectable()
export class TransactionBaseService {

  constructor(private _fb: FormBuilder, private _entityBaseService: EntityBaseService, private _utilsService: UtilsService) {
  }

  public getEmptyEnrol(): Enrollment {
    const enrollment: Enrollment = {
      DEVICE_TRANSACTION_ENROL: {
        template_version: '',
        application_info: this.getEmptyApplicationInfoModel(),
        transFees: this.getEmptyTransactionFeeModel(),
      }
    };
    
    return enrollment;
  }

  public getEmptyApplicationInfoModel() : ApplicationInfo{
    return (
      {
        last_saved_date: '',
        dossier_id: '',
        dossier_type: this._getMedicalDeviceDossierType(),
        company_id: '',
        manufacturing_contact_id: '',
        regulatory_company_id: '',
        regulatory_contact_id: '',
        regulatory_activity_lead: this._getMedicalDeviceDirectorateActivityLead(),
        regulatory_activity_type: this._entityBaseService.getEmptyIdTextLabel(),
        description_type: this._entityBaseService.getEmptyIdTextLabel(),
        device_class: this._entityBaseService.getEmptyIdTextLabel(),
        amend_reasons: null,
        licence_number: '',
        application_number: '',
        device_name: '',
        request_date: '',
        transaction_description: '',
        has_ddt: '',
        has_app_info: '',
        org_manufacture_id: '',
        org_manufacture_lic: '',
        meeting_id: '',
        proposed_licence_name: '',
        request_to: '',
        brief_description: '',
        rationale: '',
        proposed_indication: '',
      }
    );
  }

  public getEmptyTransactionFeeModel() : TransFees{
    return (
      {
        has_fees: '',
        billing_company_id: '',
        billing_contact_id: ''
      }
    );
  }

  private _getMedicalDeviceDossierType(): IIdTextLabel { 
    return this._utilsService.createIIdTextLabelObj('D23', 'Medical Device', 'Instruments Médicaux');
  }

  private _getMedicalDeviceDirectorateActivityLead(): IIdTextLabel { 
    return this._utilsService.createIIdTextLabelObj('B14-20160301-08', 'Medical Device Directorate', 'Direction des instruments médicaux');
  }

}
