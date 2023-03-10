import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';
import {
  Ectd,
  LifecycleRecord,
  TransactionEnrol,
  Transaction,
} from '../models/transaction';

@Injectable()
export class MasterFileBaseService {


  constructor() {
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
      softwareVersion: GlobalsService.SOFTWARE_VERSION,
      enrolVersion: '0.0',
      lastSavedDate: '',
      dossierId: [null, [Validators.required, ValidationService.dossierIdValidator]],
      dossierType: ['Medical device', []],
      manuCompanyId: [null, [Validators.required, ValidationService.companyIdValidator]],
      manuContactId: [null, [Validators.required, ValidationService.dossierContactIdValidator]],
      reguCompanyId: [null, [Validators.required, ValidationService.companyIdValidator]],
      reguContactId: [null, [Validators.required, ValidationService.dossierContactIdValidator]],
      activityLead: [null, Validators.required],
      activityType: [null, Validators.required],
      descriptionType: [null, Validators.required],
      deviceClass: [null, Validators.required],
      amendReason: [null, Validators.required],
      classChange: [false, []],
      licenceChange: [false, []],
      processChange: [false, []],
      qualityChange: [false, []],
      designChange: [false, []],
      materialsChange: [false, []],
      labellingChange: [false, []],
      safetyChange: [false, []],
      purposeChange: [false, []],
      addChange: [false, []],
      licenceNum: [null, [Validators.required, ValidationService.licenceNumValidator]],
      appNum: [null, [Validators.required, ValidationService.appNumValidator]],
      deviceName: [null, Validators.required],
      requestDate: [null, Validators.required],
      transDescription: [null, []],
      hasDdt: [false, []],
      hasAppInfo: [false, []],
      isSolicitedInfo: [null, Validators.required]
    });
  }

  public static getEmptyMasterFileFeeModel() {
    return (
      {
      has_fees: '',
      billing_company_id: '',
        billing_contact_id: ''
      }
    );
  }

  /**
   * Gets an empty Address Details Model
   *
   */
  public static getEmptyMasterFileDetailsModel() {

    return (
      {
      software_version: GlobalsService.SOFTWARE_VERSION,
      enrol_version: '0.0',
      last_saved_date: '',  // todo: to map into form model ???
      dossier_id: '',
      dossier_type: 'Medical Device',
      company_id: '',
      manufacturing_contact_id: '',
      regulatory_company_id: '',
      regulatory_contact_id: '',
      regulatory_activity_lead: '',
      regulatory_activity_type: '',
      description_type: '',
      device_class: '',
      amend_reasons: {
        classification_change: '',
        licence_change: '',
        process_change: '',
        quality_change: '',
        design_change: '',
        materials_change: '',
        labelling_change: '',
        safety_change: '',
        purpose_change: '',
        add_delete_change: ''
      },
      licence_number: '',
      application_number: '',
      device_name: '',
      request_date: '',
      master_file_description: '',
      has_ddt: '',
      has_app_info: '',
      is_solicited_info: '',
      org_manufacture_id: '',
      org_manufacture_lic: ''
      }
    );
  }

  /**
   * Gets an empty Address Details Model
   *
   */
  public static getEmptyAddressDetailsModel() {

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
   * Gets an empty contact model
   *
   */
  public static getEmptyContactModel() {

    return (
      {
      contact_id: '',
      fist__name: '',
      last_name: '',
      language: '',
      job_title: '',
      phone_number: '',
      phone_extension: '',
      fax_number: '',
        email: ''
      }
    );
  }
  /**
   * Sets the Help Text Index
   *
   */
  // public static getHelpTextIndex() {
  //   const helpTextInx = {
  //     loadFileInx: 0,
  //     tr2: 0,
  //     tr3: 0,
  //     tr2a: 0,
  //     tr2b: 0,
  //     tr2c: 0,
  //     tr4: 0,
  //     tr5: 0,
  //   };
  //   const keys = Object.keys(helpTextInx);
  //   for (let i = 0; i < keys.length; i++) {
  //     helpTextInx[keys[i]] = i + 1;
  //   }

  //   return helpTextInx;
  // }

  //
  public static getEmptyTransactionEnrol(): TransactionEnrol {
    const TransactionEnrol: TransactionEnrol = {
      template_type: 'PHARMA',
      date_saved: undefined,
      software_version: '',
      data_checksum: '',
      ectd: this.getEmptyEctd(),
      is_fees: '',
      fee_details: undefined,
      is_activity_changes: '',
      company_name: '',
      regulatory_activity_address: undefined,
      regulatory_activity_contact: undefined,
      confirm_regulatory_contact: '',
    };

    // const transaction: Transaction = {
    //   TRANSACTION_ENROL: TransactionEnrol,
    // };

    return TransactionEnrol;
  }

  private static getEmptyEctd(): Ectd {
    const ectd: Ectd = {
      company_id: 'unassigned',
      dossier_id: '',
      dossier_type: { _id: 'MF', __text: 'Master File' },
      product_name: '',
      product_protocol: '',
      lifecycle_record: MasterFileBaseService.getEmptyLifecycleRecord(),
    };
    return ectd;
  }

  private static getEmptyLifecycleRecord(): LifecycleRecord {
    const lifecycleRecord: LifecycleRecord = {
      control_number: '000000',
      master_file_number: '',
      master_file_use: undefined,
      regulatory_activity_lead: {
        _id: 'B14-20160301-07',
      },
      regulatory_activity_type: undefined,
      sequence_description_value: undefined,
      sequence_from_date: undefined,
      transaction_description: '',
      requester_of_solicited_information: '',
    };

    // console.log(
    //   'getEmptyMasterFileDetailsModel ~ lifecycleRecord',
    //   JSON.stringify(lifecycleRecord)
    // );

    return lifecycleRecord;
  }
}
