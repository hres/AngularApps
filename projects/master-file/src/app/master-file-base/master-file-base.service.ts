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
      isSolicitedInfo: [null, Validators.required],
      notApplicable: [false, []],
      contactInfoConfirm: [null, Validators.required],
      certifyAccurateComplete: [null, Validators.required],
      fullName: [null, Validators.required],
      submitDate: [null, Validators.required],
      consentPrivacy: [null, Validators.required]
    });
  }

  public static getEmptyMasterFileFeeModel() {
    return (
      {
		  are_there_access_letters: null,
		  number_of_access_letters: '',
		  who_responsible_fee: '',
		  account_number: '',
		  cra_business_number: ''
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
        org_manufacture_lic: '',
        mf_holder_address: {
          company_name: '',
          address: '',
          city: '',
          country: {
            __text: '',
            _id: '',
            _label_en: '',
            _label_fr: ''
          },
          prov_lov: {
            __text: '',
            _id: '',
            _label_en: '',
            _label_fr: ''
          },
          prov_text: '',
          postal: ''
        },
        mf_holder_contact: {
          fist__name: '',
          last_name: '',
          language: '',
          job_title: '',
          phone_number: '',
          phone_extension: '',
          fax_number: '',
          email: ''
        },
        agent_not_applicable: '',
        agent_address: {
          company_name: '',
          address: '',
          city: '',
          country: {
            __text: '',
            _id: '',
            _label_en: '',
            _label_fr: ''
          },
          prov_lov: {
            __text: '',
            _id: '',
            _label_en: '',
            _label_fr: ''
          },
          prov_text: '',
          postal: ''
        },
        agent_contact: {
          fist__name: '',
          last_name: '',
          language: '',
          job_title: '',
          phone_number: '',
          phone_extension: '',
          fax_number: '',
          email: ''
        },
        contact_info_confirm: '',
        fee_details: {
          are_there_access_letters: '',
          number_of_access_letters: '',
          who_responsible_fee: '',
          account_number: '',
          cra_business_number: ''
        },
        certify_accurate_complete: '',
        full_name: '',
        submit_date: ''
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
	      street_address: '',
	      city: '',
	      country: undefined,
	      province_lov: undefined,
	      province_text: '',
	      postal_code: ''
      }
    );
  }

  /**
   * Gets an empty contact model
   *
   */
  private static getEmptyContactModel() {

    return (
      {
        first_name: '',
        last_name: '',
        language_correspondance: '',
        job_title: '',
        phone_number: '',
        phone_extension: '',
        fax_number: '',
        email: ''
      }
    );
  }

  public static getEmptyTransactionEnrol(): TransactionEnrol {
    const TransactionEnrol: TransactionEnrol = {
      template_type: 'PHARMA',
      software_version: GlobalsService.SOFTWARE_VERSION,
      enrol_version: '0.0',
      last_saved_date: undefined,  // todo: to map into form model ???
      data_checksum: '',
      ectd: this.getEmptyEctd(),
      is_activity_changes: '',
     // regulatory_activity_address: undefined,
     // regulatory_activity_contact: undefined,
     // confirm_regulatory_contact: '',
      holder_name_address: {
          company_name: '',
          street_address: '',
          city: '',
          country: {
            __text: '',
            _id: '',
            _label_en: '',
            _label_fr: ''
          },
          province_lov: {
            __text: '',
            _id: ''
          },
          province_text: '',
          postal_code: ''
      },
      holder_contact: this.getEmptyContactModel(),    // call the private method to initialize it instead of repeating it
      agent_not_applicable: undefined,
      agent_name_address: {
          company_name: '',
          street_address: '',
          city: '',
          country: {
            __text: '',
            _id: '',
            _label_en: '',
            _label_fr: ''
          },
          province_lov: {
            __text: '',
            _id: ''
          },
          province_text: '',
          postal_code: ''
      },
      agent_contact: {
          first_name: '',
          last_name: '',
          language_correspondance: '',
          job_title: '',
          phone_number: '',
          phone_extension: '',
          fax_number: '',
          email: ''
      },
      contact_info_confirm: '',
      fee_details: {
        are_there_access_letters: '',
        number_of_access_letters: '',
        who_responsible_fee: '',
        account_number: '',
        cra_business_number: ''
      },
        certify_accurate_complete: undefined,
        full_name: '',
        submit_date: ''

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
      dossier_type: { _id: 'D25' },
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
