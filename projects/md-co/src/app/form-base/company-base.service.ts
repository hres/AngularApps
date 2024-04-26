import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AdministrativeChanges, Enrollment, GeneralInformation, PrimaryContact } from '../models/Enrollment';
import { INameAddress, EntityBaseService } from '@hpfb/sdk/ui';
import { EnrollmentStatus } from '../app.constants';

@Injectable()
export class CompanyBaseService {

  constructor(private _fb: FormBuilder, private _entityBaseService: EntityBaseService) {}

  /**
   * Gets the reactive forms Model for generalInfo details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  buildForm() : FormGroup {
    return this._fb.group({
      status: EnrollmentStatus.New,
      lastSavedDate: '',
      companyId: ['', [Validators.required, Validators.min(5)]]
    });
  }


  public getEmptyEnrol(): Enrollment {
    const enrollment: Enrollment = {
      DEVICE_COMPANY_ENROL: {
        template_version: '',
        form_language: '',
        general_information: this.getEmptyGenInfoModel(),
        address: this._entityBaseService.getEmptyAddressDetailsModel(),
        contacts: {contact: []},
        primary_contact: this.getEmptyPrimarycontactModel(),
        administrative_changes: this.getEmptyAdminChangesModel(),
      }
    };
    
    return enrollment;
  }


  /**
   * Gets an empty general info model
   *
   */
  private getEmptyGenInfoModel() : GeneralInformation{
    return (
      {
        status: this._entityBaseService.getEmptyIdTextLabel(),
        enrol_version: '0.0',
        last_saved_date: '',
        company_id: '',
        amend_reasons: null,
        rationale: '',
        are_licenses_transfered: ''
      }
    );
  }

  /**
   * Gets an empty Admin Changes Model
   *
   */
  public getEmptyAdminChangesModel(): AdministrativeChanges {

    return (
      {
        all_licence_numbers: '',
        is_regulatory_change: '',
        new_company_id: '',
        new_contact_id: '',
        new_contact_name: ''
      }
    );
  }

  /**
   * Gets an empty Admin Changes Model
   *
   */
  private getEmptyPrimarycontactModel(): PrimaryContact {

    return (
      {
        renewal_contact_name: '',
        finance_contact_name: ''
      }
    );
  }

}
