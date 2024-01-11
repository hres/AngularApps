import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { EntityBaseService, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { ApplicationInfo, Enrollment, TransFees } from '../models/Enrollment';
// import {GlobalsService} from '../globals/globals.service';
// import {ValidationService} from '../validation.service';
// import {ListService} from '../list-service';

@Injectable()
export class TransactionBaseService {

  constructor(private _fb: FormBuilder, private _entityBaseService: EntityBaseService, private _utilsService: UtilsService) {
  }

  // public getReactiveModel() {
  //   return this._fb.group({
  //     // softwareVersion: GlobalsService.SOFTWARE_VERSION,
  //     enrolVersion: '0.0',
  //     lastSavedDate: '',
  //     dossierId: [null, [Validators.required, ValidationService.dossierIdValidator]],
  //     dossierType: ['Medical device', []],
  //     manuCompanyId: [null, [Validators.required, ValidationService.companyIdValidator]],
  //     manuContactId: [null, [Validators.required, ValidationService.dossierContactIdValidator]],
  //     reguCompanyId: [null, [Validators.required, ValidationService.companyIdValidator]],
  //     reguContactId: [null, [Validators.required, ValidationService.dossierContactIdValidator]],
  //     activityLead: [null, Validators.required],
  //     activityType: [null, Validators.required],
  //     descriptionType: [null, Validators.required],
  //     deviceClass: [null, Validators.required],
  //     amendReason: [null, Validators.required],
  //     classChange: [false, []],
  //     licenceChange: [false, []],
  //     processChange: [false, []],
  //     qualityChange: [false, []],
  //     designChange: [false, []],
  //     materialsChange: [false, []],
  //     labellingChange: [false, []],
  //     safetyChange: [false, []],
  //     purposeChange: [false, []],
  //     addChange: [false, []],
  //     licenceNum: [null, [Validators.required, ValidationService.licenceNumValidator]],
  //     appNum: [null, [Validators.required, ValidationService.appNumValidator]],
  //     deviceName: [null, Validators.required],
  //     requestDate: [null, Validators.required],
  //     transDescription: [null, []],
  //     hasDdt: [false, []],
  //     hasAppInfo: [false, []],
  //     isSolicitedInfo: [null, Validators.required]
  //   });
  // }

  public getEmptyEnrol(): Enrollment {
    const enrollment: Enrollment = {
      DEVICE_TRANSACTION_ENROL: {
        software_version: '',
        application_info: this.getEmptyApplicationInfoModel(),
        requester_of_solicited_information: undefined,
        transFees: this.getEmptyTransactionFeeModel(),
      }
    };
    
    return enrollment;
  }

  public getEmptyApplicationInfoModel() : ApplicationInfo{
    return (
      {
        enrol_version: '0.0',
        last_saved_date: '',
        dossier_id: '',
        dossier_type: null, //this._entityBaseService.createMedicalDeviceDossierType(),
        company_id: '',
        manufacturing_contact_id: '',
        regulatory_company_id: '',
        regulatory_activity_lead: this._entityBaseService.getEmptyIdTextLabel(),
        regulatory_activity_type: this._entityBaseService.getEmptyIdTextLabel(),
        description_type: this._entityBaseService.getEmptyIdTextLabel(),
        device_class: '',
        amend_reasons: null,
        licence_number: '',
        application_number: '',
        device_name: '',
        request_date: '',
        transaction_description: '',
        has_ddt: '',
        has_app_info: '',
        is_solicited_info: '',
        org_manufacture_id: '',
        org_manufacture_lic: '',
        meeting_id: '',
        proposed_licence_name: '',
        request_version: '',
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



}
