import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Address, Enrollment, GeneralInformation } from '../models/Enrollment';
// import {GlobalsService} from '../globals/globals.service';
// import {ValidationService} from '../validation.service';
// import {ListService} from '../list-service';

@Injectable()
export class CompanyBaseService {

  constructor(private _fb: FormBuilder) {}

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
  private getEmptyAddressDetailsModel() : Address{

    return (
      {
        company_name: '',     
        address: '',
        city: '',
        country: {
          '__text': '',
          '_id': '',
          '_label_en': '',
          '_label_fr': ''
        },
        prov_lov: {
          '__text': '',
          '_id': '',
          '_label_en': '',
          '_label_fr': ''
        },
        prov_text: '',
        postal: ''
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
        amend_reasons: {
          manufacturer_name_change: '',
          manufacturer_address_change: '',
          facility_change: '',
          contact_change: '',
          other_change: '',
          other_details: ''
        },
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

    return 'FINAL';
  }

  /**
   * Sets the Help Text Index
   *
   */
  getHelpTextIndex() {

    const helpTextInx = {
      loadFileInx: 0,
      compREPInx: 0,
      // busNumInx: 0,
      conStatInx: 0,
      routIdInx: 0,
      desRenewalInx: 0,
      desFinanceInx: 0,
      // repRoutIdInx: 0,
      // conNameInx: 0,
      licenseNumsInx: 0
    };
    const keys = Object.keys(helpTextInx);
    for (let i = 0; i < keys.length; i++) {
      helpTextInx[keys[i]] = i + 1;
    }

    return helpTextInx;
  }
}
