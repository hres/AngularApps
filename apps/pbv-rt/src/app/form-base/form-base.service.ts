import {Injectable} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Ectd, TransactionEnrol, Transaction, FeeDetails, LifecycleRecord, Mitigation } from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { EntityBaseService, UtilsService } from '@hpfb/sdk/ui';
import { AddressDetailsService, ContactDetailsService, EntityBasePbvService } from '@hpfb/pbv';
import { RegulatoryInformationService } from '../regulatory-information/regulatory-information.service';
import { TransactionDetailsService } from '../transaction-details/transaction-details.service';
import { FeesService } from '../fees/fees.service';
import { RegulatoryContactService } from '../regulatory-contact/regulatory-contact.service';

@Injectable()
export class FormBaseService {

  constructor(
    private _entityBaseService: EntityBaseService, private _utilsService: UtilsService, private _globalService: GlobalService,
    private _regulatoryInfoService: RegulatoryInformationService, private _transactionDetailsService: TransactionDetailsService,
    private _feesService: FeesService,
    private _regulatoryContactService: RegulatoryContactService,
    private _addressDetailsService: AddressDetailsService,
    private _contactDetailsService: ContactDetailsService,
    private _entityBasePbvService: EntityBasePbvService) {
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

  public getEmptyTransactionEnrol(): TransactionEnrol {
    const TransactionEnrol: TransactionEnrol = {
      template_type: 'PHARMA',
      date_saved: undefined,
      software_version: '',
      form_language: '',
      check_sum: '',
      ectd: this.getEmptyEctd(),
      fee_details: this.getEmptyFeesModel(),
      is_third_party: '',
      company_name: '',
      regulatory_activity_address: this._entityBasePbvService.getEmptyAddressDetailsModel(),
      regulatory_activity_contact: this._entityBasePbvService.getEmptyContactModel(),
      confirm_regulatory_contact: '',
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

  public mapRegulatoryInfoFormToOutput(outputTransactionEnrol: TransactionEnrol, regulatoryInfoFormGroupValue: any): void{
    this._regulatoryInfoService.mapFormModelToDataModel(regulatoryInfoFormGroupValue, outputTransactionEnrol);
    this._transactionDetailsService.mapFormModelToDataModel(regulatoryInfoFormGroupValue, outputTransactionEnrol.ectd.lifecycle_record);
  }



  public mapFeesFormToOutput(feeDetail: FeeDetails, feeFormGroupValue: any): void{
    this._feesService.mapFormModelToDataModel(feeFormGroupValue, feeDetail);    
  }

  public mapRegContactInfoToOutput(outputTransactionEnrol: TransactionEnrol, contactInfoFormGroupValue: any, addressFormGroupValue : any, contactFormGroupValue : any): void {
    this._regulatoryContactService.mapFormModelToDataModel(contactInfoFormGroupValue, outputTransactionEnrol, addressFormGroupValue, contactFormGroupValue);
  }
}
