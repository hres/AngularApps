import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Ectd, TransactionEnrol, Transaction, IContact, INameAddress, FeeDetails, LifecycleRecord, IPatent, IDrugUse} from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { EntityBaseService, UtilsService } from '@hpfb/sdk/ui';
import { ROOT_TAG } from '../app.constants';
import { BehaviorSubject } from 'rxjs';
import { PatentService } from '../patent/patent-service.service';
import { DrugUseService } from '../drug-use/drug-use.service';
import { NoticeOfComplianceService } from '../notice-of-compliance/notice-of-compliance.service';
import { NewDrugSubmissionInformationService } from '../new-drug-submission-information/new-drug-submission-information.service';
import { MedicinalIngredientsService } from '../medicinal-ingredients/medicinal-ingredients.service';
import { TimeOfApplicationService } from '../time-of-application/time-of-application.service';

@Injectable()
export class FormBaseService {


  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();
  constructor(
    private _entityBaseService: EntityBaseService, private _utilsService: UtilsService, private _globalService: GlobalService,private _patentService: PatentService, private _drugUseService: DrugUseService, private _nocService: NoticeOfComplianceService, private _newDrugSubmissionService: NewDrugSubmissionInformationService,
   private medicinalIngredientService: MedicinalIngredientsService, private timmingOfApplicantService: TimeOfApplicationService) {
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
      // notApplicable: [false, []],
      // contactInfoConfirm: [false, Validators.requiredTrue],
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
//todo
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
      fee_details: this.getEmptyMasterFileFeeModel(),
      patent: this.getEmptyPatent(),
      drugUse: '',
      nocDate: '',
      ndsNumber:'',
      medicinalIngredients:'',
      timmingOfApplicant:'',
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

  // public mapRequiredFormsToOutput(outputTransactionEnrol: TransactionEnrol, regulatoryInfoFormGroupValue: any, certificationFormGroupValue: any): void{
  //   this._regulatoryInfoService.mapFormModelToDataModel(regulatoryInfoFormGroupValue, outputTransactionEnrol.ectd);
  //   this._certificationService.mapFormModelToDataModel(certificationFormGroupValue, outputTransactionEnrol)
  // }

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

  // public mapFeeFormToOutput(feeDetail: FeeDetails, feeFormGroupValue: any): void{
  //   this._feeService.mapFormModelToDataModel(feeFormGroupValue, feeDetail);
  // }


  private getEmptyPatent(): IPatent {
    const patent: IPatent = {
      patentNumber: '',
      patentFillingDate: '',
      patendExpirationDate: '',
      patentGrandDate: ''
    };
    return patent;
  }

   public mapPatentFormsToOutput(outputTransactionEnrol: TransactionEnrol, patentInforationForm: any): void{
    this._patentService.mapFormModelToDataModel(patentInforationForm, outputTransactionEnrol.patent);

  }

  public mapDrugUseFormsToOutput(outputTransactionEnrol: TransactionEnrol, drugUseForm: any): void{
    this._drugUseService.mapFormModelToDataModel(drugUseForm, outputTransactionEnrol);

  }

  public mapNOCFormsToOutput(outputTransactionEnrol: TransactionEnrol,nocDateForm: any): void{
    this._nocService.mapFormModelToDataModel(nocDateForm, outputTransactionEnrol);
  }

  public mapNewDrugSubmissionInformationFormsToOutput(outputTransactionEnrol: TransactionEnrol,newDrugSubmissionInformationForm: any): void{
    this._newDrugSubmissionService.mapFormModelToDataModel(newDrugSubmissionInformationForm, outputTransactionEnrol);

  }

  public mapMedicinalIngredientsFormsToOutput(outputTransactionEnrol: TransactionEnrol,medicinalIngredientsForm: any): void{
    this.medicinalIngredientService.mapFormModelToDataModel(medicinalIngredientsForm, outputTransactionEnrol);

  }

  public mapTimingOfApplicantFormsToOutput(outputTransactionEnrol: TransactionEnrol,timeOfApplicationForm: any): void{
    this.timmingOfApplicantService.mapFormModelToDataModel(timeOfApplicationForm, outputTransactionEnrol);

  }
}
