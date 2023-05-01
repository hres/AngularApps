import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  Ectd,
  LifecycleRecord,
  TransactionEnrol,
  Transaction,
  ContactInfo,
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
  public static getEmptyContactModel() {

    return (
      {
        given_name: '',
        surname: '',
        language_correspondance: '',
        job_title: '',
        phone_num: '',
        phone_ext: '',
        fax_num: '',
        email: ''
      }
    );
  }

  public static getEmptyTransactionEnrol(): TransactionEnrol {
    const TransactionEnrol: TransactionEnrol = {
      template_type: 'PHARMA',
      software_version: '',
      enrol_version: '0.0',
      last_saved_date: undefined,
      data_checksum: '',
      ectd: this.getEmptyEctd(),
      contact_info: this.getEmptyContactInfo(),
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

  public static mapDataModelToFormModel(mfDataModel, formRecord: FormGroup) {

    formRecord.controls['notApplicable'].setValue(mfDataModel.agent_not_applicable);
    formRecord.controls['contactInfoConfirm'].setValue(mfDataModel.contact_info_confirm);
    formRecord.controls['certifyAccurateComplete'].setValue(mfDataModel.certify_accurate_complete);
    formRecord.controls['fullName'].setValue(mfDataModel.full_name);
    formRecord.controls['submitDate'].setValue(mfDataModel.submit_date);
  }

  public static getEmptyContactInfo() {
     const conInfo: ContactInfo = {
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
      holder_contact: this.getEmptyContactModel(),
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
        given_name: '',
        surname: '',
        language_correspondance: '',
        job_title: '',
        phone_num: '',
        phone_ext: '',
        fax_num: '',
        email: ''
      },
      contact_info_confirm: ''
    }
    return conInfo;
  }
}
