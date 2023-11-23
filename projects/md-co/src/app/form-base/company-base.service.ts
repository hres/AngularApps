import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Enrollment, GeneralInformation } from '../models/Enrollment';
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
      status: '',
      // enrolVersion: 0.0,
      lastSavedDate: '',
      companyId: ['', [Validators.required, Validators.min(5)]]
    });
  }


  public getEmptyEnrol(): Enrollment {
    const enrollment: Enrollment = {
      DEVICE_COMPANY_ENROL: {
        general_information: this.getEmptyGenInfoModel(),
        address: this.getEmptyAddressDetailsModel(),
        contacts: [],
        primary_contact: this.getEmptyPrimarycontactModel(),
        administrative_changes: this.getEmptyAdminChangesModel()
      }
    };
    
    return enrollment;
  }


  /**
   * Gets an empty Address Details Model
   *
   */
  private getEmptyAddressDetailsModel() : INameAddress{

    return (
      {
        company_name: '',     
        street_address: '',
        city: '',
        country: this._entityBaseService.getEmptyIdTextLabel(),
        province_lov: this._entityBaseService.getEmptyIdTextLabel(),
        province_text: '',
        postal_code: ''
      }
    );
  }

  /**
   * Gets an empty general info model
   *
   */
  private getEmptyGenInfoModel() : GeneralInformation{
    return (
      {
        status: '',
        enrol_version: '0.0',
        last_saved_date: '',
        company_id: '',
        amend_reasons: null,
        are_licenses_transfered: ''
      }
    );
  }

  /**
   * Gets an empty Admin Changes Model
   *
   */
  private getEmptyAdminChangesModel() {

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
  private getEmptyPrimarycontactModel() {

    return (
      {
        renewal_contact_name: '',
        finance_contact_name: ''
      }
    );
  }

  /**
   * Sets the Final Status
   *
   */
  setFinalStatus() {
    return EnrollmentStatus.Final;
  }

}
