import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Ectd, LifecycleRecord, TransactionEnrol, Transaction, ContactInfo, IContact, INameAddress, FeeDetails, Certification} from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { EntityBaseService, UtilsService } from '@hpfb/sdk/ui';
import { RegulatoryInformationService } from '../regulatory-information/regulatory-information.service';
import { MasterFileFeeService } from '../master-file-fee/master-file.fee.service';
import { ADDR_CONT_TYPE, ROOT_TAG } from '../app.constants';
import { AddressDetailsService } from '../address/address.details/address.details.service';

@Injectable()
export class MasterFileBaseService {

  constructor(private _regulatoryInfoService: RegulatoryInformationService, private _addressDetailsService: AddressDetailsService,
    private _feeService: MasterFileFeeService,
    private _entityBaseService: EntityBaseService, private _utilsService: UtilsService, private _globalService: GlobalService) {
  }

  /**
   * Gets the reactive forms Model for generalInfo details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {
      return null;
    }
    return fb.group({
      notApplicable: [false, []],
      contactInfoConfirm: [null, Validators.required],
    });
  }

  public getEmptyEnrol(): Transaction {
    const enrollment: Transaction = {
      TRANSACTION_ENROL: this.getEmptyTransactionEnrol()
    };
    
    return enrollment;
  }

  public getEmptyMasterFileFeeModel() : FeeDetails{
    return (
      {
		  are_there_access_letters: null,
		  number_of_access_letters: '',
		  who_responsible_fee: this._entityBaseService.getEmptyIdTextLabel() ,
		  account_number: '',
		  cra_business_number: ''
      }
    );
  }

   /**
   * Gets an empty Address Details Model
   *
   */
  public getEmptyAddressDetailsModel() : INameAddress{

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
  public getEmptyContactModel() : IContact{

    return (
      {
        given_name: '',
        surname: '',
        language_correspondance: undefined,
        job_title: '',
        phone_num: '',
        phone_ext: '',
        fax_num: '',
        email: ''
      }
    );
  }

  public getEmptyTransactionEnrol(): TransactionEnrol {
    const TransactionEnrol: TransactionEnrol = {
      template_type: 'PHARMA',
      software_version: '',
      date_saved: undefined,
      data_checksum: '',
      ectd: this.getEmptyEctd(),
      contact_info: this.getEmptyContactInfo(),
      fee_details: this.getEmptyMasterFileFeeModel(),
      certification: this.getCertification(),
    };
    
    return TransactionEnrol;
  }

  private getEmptyEctd(): Ectd {
    const ectd: Ectd = {
      company_id: 'unassigned',
      dossier_id: '',
      dossier_type: { _id: 'D25' },
      product_name: '',
      product_protocol: '',
      lifecycle_record: this.getEmptyLifecycleRecord(),
    };
    return ectd;
  }

  private getEmptyLifecycleRecord(): LifecycleRecord {
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
      transaction_description: undefined,
      requester_of_solicited_information: '',
      revise_trans_desc_request: '',
      revised_trans_desc: undefined,
    };

    // console.log(
    //   'getEmptyMasterFileDetailsModel ~ lifecycleRecord',
    //   JSON.stringify(lifecycleRecord)
    // );

    return lifecycleRecord;
  }

  public getEmptyContactInfo() : ContactInfo {
    const contactInfo: ContactInfo = {
      holder_name_address: this.getEmptyAddressDetailsModel(),
      holder_contact: this.getEmptyContactModel(),
      agent_not_applicable: undefined,
      agent_name_address: this.getEmptyAddressDetailsModel(),
      agent_contact: this.getEmptyContactModel(),
      contact_info_confirm: undefined
    }
    return contactInfo;
  }

  public getCertification() : Certification {
    return {
      certify_accurate_complete: undefined,
      full_name: '',
      submit_date: '',
      consent_privacy: undefined
    }
  }

  public mapDataModelToFormModel(mfDataModel, formRecord: FormGroup) {
    // console.log(mfDataModel.contact_info.agent_not_applicable, typeof mfDataModel.contact_info.agent_not_applicable);
    formRecord.controls['notApplicable'].setValue(this._utilsService.toBoolean(mfDataModel.contact_info.agent_not_applicable));

    // Resets certifcation section and contact info confirmation
    formRecord.controls['contactInfoConfirm'].setValue(undefined);
    formRecord.controls['certifyAccurateComplete'].setValue(undefined);
    formRecord.controls['fullName'].setValue('');
    formRecord.controls['submitDate'].setValue('');
    formRecord.controls['consentPrivacy'].setValue(undefined);
  }

  public mapRequiredFormsToOutput(outputTransactionEnrol: TransactionEnrol, regulatoryInfoFormGroupValue: any, certificationFormValue: any): void{
    this._regulatoryInfoService.mapFormModelToDataModel(regulatoryInfoFormGroupValue, outputTransactionEnrol.ectd);
    //todo map certificationFormValue to output data

  }

  public mapFeeFormToOutput(outputFee: TransactionEnrol, feeFormGroupValue: any): void{
    this._feeService.mapFormModelToDataModel(feeFormGroupValue, outputFee.fee_details);    
  }
}
