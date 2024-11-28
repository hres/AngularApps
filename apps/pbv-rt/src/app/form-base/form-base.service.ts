import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Ectd, TransactionEnrol, Transaction, IContact, INameAddress, FeeDetails, LifecycleRecord, Mitigation} from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { EntityBaseService, UtilsService } from '@hpfb/sdk/ui';
import { ROOT_TAG } from '../app.constants';
import { RegulatoryInformationService } from '../regulatory-information/regulatory-information.service';
import { TransactionDetailsService } from '../transaction-details/transaction-details.service';
import { FeesService } from '../fees/fees.service';

@Injectable()
export class FormBaseService {

  constructor(
    private _entityBaseService: EntityBaseService, private _utilsService: UtilsService, private _globalService: GlobalService,
    private _regulatoryInfoService: RegulatoryInformationService, private _transactionDetailsService: TransactionDetailsService,
    private _feesService: FeesService) {
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
      certifyPrivacy: [false, Validators.required],
    });
  }

  public getEmptyEnrol(): Transaction {
    const enrollment: Transaction = {
      TRANSACTION_ENROL: this.getEmptyTransactionEnrol()
    };
    
    return enrollment;
  }

  public getEmptyFeesModel() : FeeDetails{
    return (
      {
        submission_class: undefined,
        submission_description: undefined,
        mitigation: this.getEmptyMitigation()
      }
    );
  }

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
      date_saved: undefined,
      software_version: '',
      form_language: '',
      check_sum: '',
      ectd: this.getEmptyEctd(),
      fee_details: this.getEmptyFeesModel(),
      is_priority: '',
      is_noc: '',
      is_admin_sub: '',
      sub_type: undefined,
    };
    
    return TransactionEnrol;
  }

  private getEmptyEctd(): Ectd {
    const ectd: Ectd = {
      company_id: '',
      dossier_id: '',
      dossier_type: undefined,
      product_name: '',
      lifecycle_record: this.getEmptyLifecycleRecord(),
    };
    return ectd;
  }

  private getEmptyLifecycleRecord(): LifecycleRecord {
    const lifecycleRecord: LifecycleRecord = {
      control_number: '',
      regulatory_activity_lead: undefined,
      regulatory_activity_type: undefined,
      sequence_description_value: undefined,
      sequence_from_date: '',
      sequence_to_date: '',
      sequence_details: '',
      sequence_details_change: '',
      sequence_version: '',
      sequence_year: '',
      transaction_description: undefined,
      requester_name: '',
      requester_name2: '',
      requester_name3: '',
      requester_of_solicited_information: ''
    };

    return lifecycleRecord;
  }

  private getEmptyMitigation(): Mitigation {
    const mitigation: Mitigation = {
    certify_funded_health_institution: '',
    certify_government_organization: '',
    certify_organization: '',
    certify_urgent_health_need: '',
    certify_isad: '',
    mitigation_type: undefined,
    small_business_fee_application: ''
    };

    return mitigation;
  }

  // public getEmptyContactInfo() : ContactInfo {
  //   const contactInfo: ContactInfo = {
  //     holder_name_address: this.getEmptyAddressDetailsModel(),
  //     holder_contact: this.getEmptyContactModel(),
  //     agent_not_applicable: undefined,
  //     agent_name_address: this.getEmptyAddressDetailsModel(),
  //     agent_contact: this.getEmptyContactModel(),
  //     contact_info_confirm: false
  //   }
  //   return contactInfo;
  // }

  // public mapDataModelToFormModel(contactInfo: ContactInfo, formRecord: FormGroup) {
  //   // console.log(contactInfo.agent_not_applicable, typeof contactInfo.agent_not_applicable, this._utilsService.toBoolean(contactInfo.agent_not_applicable));
  //   formRecord.controls['notApplicable'].setValue(this._utilsService.toBoolean(contactInfo.agent_not_applicable));
  //   // user needs to check contactInfoConfirm checkbox each time they submit the form, so no need to load it from the uploaded data file
  // }

  public mapRegulatoryInfoFormToOutput(outputTransactionEnrol: TransactionEnrol, regulatoryInfoFormGroupValue: any): void{
    this._regulatoryInfoService.mapFormModelToDataModel(regulatoryInfoFormGroupValue, outputTransactionEnrol);
    this._transactionDetailsService.mapFormModelToDataModel(regulatoryInfoFormGroupValue, outputTransactionEnrol.ectd.lifecycle_record);
  }

  // public mapAddressFormContactFormToOutput(contactInfo: ContactInfo, 
  //   addressesFormGroupValue: Array<{ addrType: string, value: any }>, contactsFormGroupValue: Array<{ contactType: string, value: any }>): void{

  //   if (contactInfo.agent_not_applicable) {
  //     const holderAddress = addressesFormGroupValue.filter(address => address.addrType === ADDR_CONT_TYPE.HOLDER)[0];
  //     if (holderAddress) {
  //       this._addressDetailsService.mapFormModelToDataModel(holderAddress.value, contactInfo.holder_name_address);
  //     } else {
  //       console.error('mapAddressFormContactFormToOutput ~ No holder address found');
  //     }
  //     contactInfo.agent_name_address = null;

  //     const holderContact = contactsFormGroupValue.filter(contact => contact.contactType === ADDR_CONT_TYPE.HOLDER)[0];
  //     if (holderContact) {
  //       this._contactDetailsService.mapFormModelToDataModel(holderContact.value, contactInfo.holder_contact);
  //     } else {
  //       console.error('mapAddressFormContactFormToOutput ~ No holder contact found');
  //     }
  //     contactInfo.agent_contact = null;

  //   } else {
  //     addressesFormGroupValue.forEach(address => {
  //       if (address.addrType === ADDR_CONT_TYPE.HOLDER) {
  //         this._addressDetailsService.mapFormModelToDataModel(address.value, contactInfo.holder_name_address);
  //       } else if (address.addrType === ADDR_CONT_TYPE.AGENT) {
  //         this._addressDetailsService.mapFormModelToDataModel(address.value, contactInfo.agent_name_address);
  //       }
  //     });
  //     contactsFormGroupValue.forEach(contact => {
  //       if (contact.contactType === ADDR_CONT_TYPE.HOLDER) {
  //         this._contactDetailsService.mapFormModelToDataModel(contact.value, contactInfo.holder_contact);
  //       } else if (contact.contactType === ADDR_CONT_TYPE.AGENT) {
  //         this._contactDetailsService.mapFormModelToDataModel(contact.value, contactInfo.agent_contact);
  //       }
  //     });
  //   }
  // }

  public mapFeesFormToOutput(feeDetail: FeeDetails, feeFormGroupValue: any): void{
    this._feesService.mapFormModelToDataModel(feeFormGroupValue, feeDetail);    
  }
}
