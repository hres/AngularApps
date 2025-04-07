import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Ectd,
  HcUse,
  TransactionEnrol,
  Transaction,
  FeeDetails,
  CertDetails,
  LifecycleRecord,
  IPatent,
  IDrugUse,
  IApplicant,
  IApplicationInformation,
  ITimelySubmissionInformation,
  IMedicalInformation,
  IAttestationInfomation,
  ICspInfomation,
  } from '../models/transaction';
import { INameAddress, IContact } from '@hpfb/pbv';
import { GlobalService } from '../global/global.service';
import { EntityBaseService, IIdTextLabel, UtilsService } from '@hpfb/sdk/ui';
import { ROOT_TAG } from '../app.constants';
import { BehaviorSubject } from 'rxjs';
import { PatentService } from '../patent/patent-service.service';
import { DrugUseService } from '../drug-use/drug-use.service';
import { NoticeOfComplianceService } from '../notice-of-compliance/notice-of-compliance.service';
import { NewDrugSubmissionInformationService } from '../new-drug-submission-information/new-drug-submission-information.service';
import { MedicinalIngredientsService } from '../medicinal-ingredients/medicinal-ingredients.service';
import { TimingOfApplicationService } from '../time-of-application/time-of-application.service';
import { FeesService } from '../fees/fees.service';
import { EntityBasePbvService } from '@hpfb/pbv';
import { ApplicantService } from '../applicant/applicant-service';
import { HcUseOnlyService } from '../health-canada-only/health-canada-only.service';
import { CertificationService } from '../certification/certification.service';
import { AttestationService } from '../attestation/attestation.service';
import { AttestationTypeForSubmission } from '../attestation/AttestationEnum';
import { CertSuppProtectService } from '../cert-supp-protect/cert-supp-protect.service';

@Injectable()
export class FormBaseService {
  public certSuppProtectForm: FormGroup;
  public passCerForm(certSuppProtectForm: FormGroup) {
    this.certSuppProtectForm = certSuppProtectForm;
  }
  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();
  constructor(
    private _patentService: PatentService,
    private _drugUseService: DrugUseService,
    private _nocService: NoticeOfComplianceService,
    private _newDrugSubmissionService: NewDrugSubmissionInformationService,
    private medicinalIngredientService: MedicinalIngredientsService,
    private timingOfApplicantService: TimingOfApplicationService,
    private applicantService: ApplicantService,
    private _entityBasePbvService: EntityBasePbvService,
    private certificationService: CertificationService,
    private feesService: FeesService,
    private hcUseOnlySerive: HcUseOnlyService,
    private attestationService: AttestationService,
    private certSuppProtectService: CertSuppProtectService
  ) {}

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
      CERTIFICATE_SUPPLEMENTARY_PROTECTION: this.getEmptyTransactionEnrol(),
    };

    return enrollment;
  }

  public getEmptyFeesModel(): FeeDetails {
    return {
      advanced_payment_fee: '',
      advanced_payment_type: '',
      advanced_payment_ack:''
    };
  }

  public getEmptyCertModel(): CertDetails {
    return {
      given_name: '',
      initials: '',
      surname: '',
      job_title: '',
      date_signed: '',
    };
  }



  public getEmptyContactModel(): IContact {
    return {
      given_name: '',
      initials: '',
      surname: '',
      language_correspondance: undefined,
      job_title: '',
      phone_num: '',
      phone_ext: '',
      fax_num: '',
      email: '',
    };
  }

  public getEmptyTransactionEnrol(): TransactionEnrol {
    const TransactionEnrol: TransactionEnrol = {
      template_type: 'PHARMA',
      enrolment_version: '',
      date_saved: undefined,
      software_version: '',
      form_language: '',
      check_sum: '',
      health_canada_only: this.getEmptyHcUse(),
      applicant: this.getEmptyArrayOfApplicants(),
      application_info: this.getApplicationInformation(),
      timely_submission_info: this.getAttestationOFSubmission(),
      advanced_payment: this.getEmptyFeesModel(),
      certification: this.getEmptyCertModel(),
    };

    return TransactionEnrol;
  }

  private getEmptyHcUse(): HcUse {
    const hcUse: HcUse = {
      company_id: '',
      application_id: '',
      date_received: '',
      hc_notes: '',
    };
    return hcUse;
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

    return lifecycleRecord;
  }

  private getEmptyPatent(): IPatent {
    const patent: IPatent = {
      patent_number: '',
      filing_date: '',
      expiry_date: '',
      granted_date: '',
    };
    return patent;
  }

  private getEmptyArrayOfApplicants(): IApplicant[] {
    return [];
  }

  public getEmptyApplicant(): IApplicant {
    const applicant: IApplicant = {
      billing_role: '',
      applicant_role: '',
      applicant_name: '',
      cra_business_number: '',
      csp_customer_number: '',
      agent_name: '',
      contact: this._entityBasePbvService.getEmptyContactModel(),
      address: this._entityBasePbvService.getEmptyAddressDetailsModel(),
    };
    return applicant;
  }



  private getApplicationInformation(): IApplicationInformation {
    const applicantInfo: IApplicationInformation = {
      patent_info: this.getEmptyPatent(),
      control_number: '',
      noc_date: '',
      drug_use: '',
      medicinal_ingredient: '',
      product_name: '',
      time_application: '',
      applicant_statement: '',
    };
    return applicantInfo;
  }

  private getAttestationOFSubmission(): ITimelySubmissionInformation {
    const timelySubmissionInformation: ITimelySubmissionInformation = {
      timely_submission_statement: '',
      marketing_application_date: '',
      marketing_country: undefined,
    };
    return timelySubmissionInformation;
  }

  public getAttestation(): IAttestationInfomation {
    const attestationMode: IAttestationInfomation = {
      attestationAsSubmission: this.getAttestationOFSubmission(),
      attestationAsApplicant: '',
    };

    return attestationMode;
  }
  public getCerSuppProtect(): ICspInfomation {
    const cerspModel: ICspInfomation = {
      dateLastSaved: '',
      enrollVersion: '',
    };

    return cerspModel;
  }

  public mapPatentFormsToOutput(
    outputTransactionEnrol: TransactionEnrol,
    patentInforationForm: any
  ): void {
    this._patentService.mapFormModelToDataModel(
      patentInforationForm,
      outputTransactionEnrol.application_info.patent_info
    );
  }

  public mapDrugUseFormsToOutput(
    outputTransactionEnrol: TransactionEnrol,
    drugUseForm: any
  ): void {
    this._drugUseService.mapFormModelToDataModel(
      drugUseForm,
      outputTransactionEnrol
    );
  }

  public mapNOCFormsToOutput(
    outputTransactionEnrol: TransactionEnrol,
    nocDateForm: any
  ): void {
    this._nocService.mapFormModelToDataModel(
      nocDateForm,
      outputTransactionEnrol
    );
  }

  public mapNewDrugSubmissionInformationFormsToOutput(
    outputTransactionEnrol: TransactionEnrol,
    newDrugSubmissionInformationForm: any
  ): void {
    this._newDrugSubmissionService.mapFormModelToDataModel(
      newDrugSubmissionInformationForm,
      outputTransactionEnrol
    );
  }

  public mapCertificationFormsToOutput(
    outputTransactionEnrol: TransactionEnrol,
    certificationForm: any
  ): void {
    this.certificationService.mapFormModelToDataModel(
      certificationForm,
      outputTransactionEnrol.certification
    );
  }

  public mapMedicinalIngredientsFormsToOutput(
    outputTransactionEnrol: TransactionEnrol,
    medicinalIngredientsForm: any
  ): void {
    this.medicinalIngredientService.mapFormModelToDataModel(
      medicinalIngredientsForm,
      outputTransactionEnrol
    );
  }

  public mapAttestationFormsToOutput(
    outputTransactionEnrol: TransactionEnrol,
    AttestationForm: any,
    lang,
    languageList
  ): void {
    this.attestationService.mapFormModelToDataModel(
      AttestationForm,
      outputTransactionEnrol,
      lang,
      languageList
    );
  }

  public mapTimingOfApplicantFormsToOutput(
    outputTransactionEnrol: TransactionEnrol,
    timingOfApplicationForm: any
  ): void {
    this.timingOfApplicantService.mapFormModelToDataModel(
      timingOfApplicationForm,
      outputTransactionEnrol
    );
  }

  public mapHealthCanadaOnlyFormsToOutput(
    outputTransactionEnrol: TransactionEnrol,
    hcUseOnlyForm: any
  ): void {
    this.hcUseOnlySerive.mapFormModelToDataModel(
      hcUseOnlyForm,
      outputTransactionEnrol.health_canada_only
    );
  }

  public mapFeesFormsToOutput(
    outputTransactionEnrol: TransactionEnrol,
    feesForm: any
  ): void {
    this.feesService.mapFormModelToDataModel(
      feesForm,
      outputTransactionEnrol.advanced_payment
    );
  }

  public mapApplicantInfoToOutput(
    outputTransactionEnrol: TransactionEnrol,
    applicantForm: any,
    applicantAddressFormGroupValue: any,
    applicantContactFormGroupValue: any,
    billingAddressFormGroupValue: any,
    billingContactFormGroupValue: any
  ): void {
    this.applicantService.mapFormModelToDataModel(
      applicantForm,
      outputTransactionEnrol,
      applicantAddressFormGroupValue,
      applicantContactFormGroupValue,
      billingAddressFormGroupValue,
      billingContactFormGroupValue,
      this.getEmptyApplicant(),
      this.getEmptyApplicant()
    );
  }

  public mapCertificateOfSupplementaryProtectionFormsToOutput(
    outputTransactionEnrol: TransactionEnrol,
    cspiModel: ICspInfomation,
    certSuppProtectForm: FormGroup
  ): void {
    this.certSuppProtectService.mapFormModelToDataModel(
      outputTransactionEnrol,
      cspiModel,
      certSuppProtectForm
    );
  }

  public getEmptyIIdTextLabel(): IIdTextLabel {
    const iIdTextLabel: IIdTextLabel = {
      _id: '',
      __text: '',
      _label_en: '',
      _label_fr: '',
    };
    return iIdTextLabel;
  }

}
