import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  HostListener,
  ViewChildren,
  QueryList,
  signal,
  computed,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FileConversionService,
  CheckSumService,
  UtilsService,
  ConverterService,
  VersionService,
  FileIoModule,
  ErrorModule,
  PipesModule,
  EntityBaseService,
  HelpSequence,
  ControlMessagesComponent,
  ConvertResults,
  CHECK_SUM_CONST,
  ICode,
  IIdTextLabel,
} from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import {
  FILE_OUTPUT_PREFIX,
  FILE_OUTPUT_SEPERATOR,
  ROOT_TAG,
  START_CHECKSUM_VERSION,
  VERSION_TAG_PATH,
} from '../app.constants';
import { FormBaseService } from './form-base.service';
import {
  Ectd,
  HcUse,
  FeeDetails,
  CertDetails,
  Transaction,
  TransactionEnrol,
  IApplicant,
  IPatent,
  IMedicalInformation,
  IAttestationInfomation,
  ICspInfomation,
} from '../models/transaction';
import { INameAddress, IContact, EntityBasePbvService } from '@hpfb/pbv';
import { PatentComponent } from '../patent/patent.component';
import { DrugUseComponent } from '../drug-use/drug-use.component';
import { NoticeOfComplianceComponent } from '../notice-of-compliance/notice-of-compliance.component';
import { environment } from '../../environments/environment';
import { NewDrugSubmissionInformationComponent } from '../new-drug-submission-information/new-drug-submission-information.component';
import { MedicinalIngredientsComponent } from '../medicinal-ingredients/medicinal-ingredients.component';
import { FeesComponent } from '../fees/fees.component';
import { CertificationComponent } from '../certification/certification.component';
import { TimeOfApplicationComponent } from '../time-of-application/time-of-application.component';
import { ApplicantComponent } from '../applicant/applicant.component';
import { HcUseOnlyComponent } from '../health-canada-only/health-canada-only.component';
import { AttestationComponent } from '../attestation/attestation.component';
import { CertSuppProtectComponent } from '../cert-supp-protect/cert-supp-protect.component';
import {
  CANADA,
  USA,
} from '../../../../../projects/hpfb/sdk/ui/common.constants';

@Component({
  selector: 'app-form-base',
  standalone: true,
  templateUrl: './form-base.component.html',
  styleUrls: ['./form-base.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    FileConversionService,
    UtilsService,
    VersionService,
    CheckSumService,
    ConverterService,
    EntityBaseService,
    FormBaseService,
    EntityBasePbvService,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FileIoModule,
    ErrorModule,
    AppFormModule,
  ],
})
export class FormBaseComponent implements OnInit, AfterViewInit {
  public errors;
  lang: string;
  helpIndex: HelpSequence;
  devEnv: boolean;
  byPassCheckSum: boolean;
  saveWorkCopyTime: number;
  isInternal: boolean;

  @ViewChildren(ControlMessagesComponent)
  msgList: QueryList<ControlMessagesComponent>;

  @ViewChild(PatentComponent) patentComponent: PatentComponent;
  @ViewChild(DrugUseComponent) drugUseComponent: DrugUseComponent;
  @ViewChild(NoticeOfComplianceComponent)
  noticeOfComplianceComponent: NoticeOfComplianceComponent;
  @ViewChild(NewDrugSubmissionInformationComponent)
  newDrugSubmissionInformationComponent: NewDrugSubmissionInformationComponent;
  @ViewChild(MedicinalIngredientsComponent)
  medicinalIngredientsComponent: MedicinalIngredientsComponent;
  @ViewChild(TimeOfApplicationComponent)
  timeOfApplicationComponent: TimeOfApplicationComponent;

  @ViewChild(FeesComponent) feesComponent: FeesComponent;
  @ViewChild(ApplicantComponent) applicantComponent: ApplicantComponent;
  @ViewChild(HcUseOnlyComponent) healthCanadaComponent: HcUseOnlyComponent;

  @ViewChild(CertificationComponent)
  certificationComponent: CertificationComponent;
  @ViewChild(AttestationComponent) attestationComponent: AttestationComponent;
  @ViewChild(CertSuppProtectComponent)
  certSuppProtectComponent: CertSuppProtectComponent;

  private _patentInformationErrors = [];
  private _drugUseErrors = [];
  private _noticeOfComplianceErrors = [];
  private _newDrugSubmissionInfoErrors = [];
  private _medicinalIngredientsForErrors = [];
  private _timingOfApplicantForErrors = [];
  private _attestationsForErrors = [];
  private _feesForErrors = [];
  private _certificationForErrors = [];
  private _applicantErrors = [];
  private _healthCanadaOnlyErrors = [];

  public rtForm: FormGroup;
  public errorList = [];
  public showErrors: boolean;

  public headingLevel = 'h2';

  public rootTagText = ROOT_TAG;
  public versionTagPath = VERSION_TAG_PATH;
  public startCheckSumVersionNum = START_CHECKSUM_VERSION;

  public enrollModel: Transaction;
  public transactionEnrollModel: TransactionEnrol;
  public certModel: CertDetails;
  public hcUseModel: HcUse;
  public transFeeModel: FeeDetails;
  public applicantModel: IApplicant;
  public billingModel: IApplicant;
  public addressModel: INameAddress;
  public contactModel: IContact;

  countryOptions: ICode[] = [];
  public addressBillingModel: INameAddress;
  public contactBillingModel: IContact;

  public drugUseModel: string;
  public medicinalIngredient: string;
  public productName: string;
  public patentModel: IPatent;
  public timingOfApplicantModel: string;
  public nocModel: string;
  public newDrugSubmissionModel: string;
  public hcuseOnlyModel: HcUse;
  public feePaymentModel: FeeDetails;
  public attestationModel: IAttestationInfomation;
  public cspiModel: ICspInfomation;
  private fileName:string;

  constructor(
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _baseService: FormBaseService,
    private _globalService: GlobalService,
    private _utilsService: UtilsService,
    private fileServices: FileConversionService,
    private _versionService: VersionService,
    private _checkSumService: CheckSumService,
    private datepipe: DatePipe
  ) {
    this.showErrors = false;
  }

  ngOnInit() {
    if (!this.rtForm) {
      this.rtForm = this._baseService.getReactiveModel(this._fb);
    }
    try {
      if (!this._globalService.enrollment) {
        // console.log("onInit", "enrollement doesn't exist, create a new one");
        this.enrollModel = this._baseService.getEmptyEnrol();
        this._globalService.enrollment = this.enrollModel;
      } else {
        this.enrollModel = this._globalService.enrollment;
        // console.log("onInit", "get enrollement from globalservice");
      }

      this.transactionEnrollModel = this.enrollModel[this.rootTagText];

      this._initModels(this.transactionEnrollModel);

      this.lang = this._globalService.currLanguage;
      this.countryOptions = this._globalService.countryList;
      this.helpIndex = this._globalService.helpIndex;
      this.devEnv = this._globalService.devEnv;
      this.byPassCheckSum = this._globalService.byPassChecksum;
      this.isInternal = environment.isInternal;
    } catch (e) {
      console.error(e);
    }
  }

  ngAfterViewInit(): void {

    document.location.href = '#def-top';

    this.msgList.changes.subscribe((errorObjs) => {
      let temp = [];
      this._updateErrorList(errorObjs);
      this.processErrors();
    });
    this.msgList.notifyOnChanges();
  }

  private _updateErrorList(errorObjs) {}

  processErrors() {
    // console.log('@@@@@@@@@@@@ processErrors');
    this.errorList = [];
    this.errorList = this.errorList.concat(this._applicantErrors);
    this.errorList = this.errorList.concat(this._patentInformationErrors);
    this.errorList = this.errorList.concat(this._newDrugSubmissionInfoErrors);
    this.errorList = this.errorList.concat(this._noticeOfComplianceErrors);
    this.errorList = this.errorList.concat(this._drugUseErrors);
    this.errorList = this.errorList.concat(this._timingOfApplicantForErrors);
    this.errorList = this.errorList.concat(this._medicinalIngredientsForErrors);

    this.errorList = this.errorList.concat(this._attestationsForErrors);

    this.errorList = this.errorList.concat(this._feesForErrors);
    this.errorList = this.errorList.concat(this._certificationForErrors);
    this.cdr.detectChanges(); // doing our own change detection
  }

  processHealthCanadaOnlyErrors(errorList) {
    this._healthCanadaOnlyErrors = errorList;
    this.processErrors();
  }

  processPatentInfoErrors(errorList) {
    this._patentInformationErrors = errorList;
    this.processErrors();
  }

  processDrugUseErrors(errorList) {
    this._drugUseErrors = errorList;
    this.processErrors();
  }

  processNoticeOfComplianceErrors(errorList) {
    this._noticeOfComplianceErrors = errorList;
    this.processErrors();
  }

  processNewDrugSubmissionInfoErrors(errorList) {
    this._newDrugSubmissionInfoErrors = errorList;
    this.processErrors();
  }

  processMedicinalIngredientsErrors(errorList) {
    this._medicinalIngredientsForErrors = errorList;
    this.processErrors();
  }

  processAttestationsErrors(errorList) {
    this._attestationsForErrors = errorList;
    this.processErrors();
  }

  processFeesErrors(errorList) {
    this._feesForErrors = errorList;
    this.processErrors();
  }

  processTimingOfApplicantErrors(errorList) {
    this._timingOfApplicantForErrors = errorList;
    this.processErrors();
  }

  processCertificationErrors(errorList) {
    this._certificationForErrors = errorList;
    this.processErrors();
  }

  processApplicantErrors(errorList) {
    this._applicantErrors = errorList;
    this.processErrors();
  }



  public hideErrorSummary() {
    return this.showErrors && this.errorList && this.errorList.length > 0;
  }

  public saveXmlFile() {
    this.showErrors = true;
    this.processErrors();
    this._saveXML();
  }

  public saveWorkingCopyFile() {
    const result: Transaction = this._prepareForSaving(false);
    const fileName = this._generateFileName(result.CERTIFICATE_SUPPLEMENTARY_PROTECTION.enrolment_version);
      this.fileServices.saveJsonToFile(result, fileName, null);
      this.saveWorkCopyTime = Date.now();
  }

  public processFile(fileData: ConvertResults) {
    // console.log(fileData);
    if (fileData.data !== null) {
      this.transactionEnrollModel =
        fileData.data.CERTIFICATE_SUPPLEMENTARY_PROTECTION;
      this._initModels(this.transactionEnrollModel);
      // this.setSelectedTxDesc(this.ectdModel.lifecycle_record?.sequence_description_value?._id);
      // this._baseService.mapDataModelToFormModel(this.transactionEnrollModel.contact_info, this.rtForm);
      // this.agentInfoOnChange();
    }
  }

  private _initModels(trans: TransactionEnrol) {
    this.cspiModel = this._baseService.getCerSuppProtect();
    this.cspiModel.dateLastSaved = trans.date_saved;
    this.cspiModel.enrollVersion = trans.enrolment_version;

    if (trans.application_info != null) {
      this.attestationModel = this._baseService.getAttestation();
      this.drugUseModel = trans.application_info.drug_use;
      this.patentModel = trans.application_info.patent_info;
      this.timingOfApplicantModel = trans.application_info.time_application;
      this.nocModel = trans.application_info.noc_date;
      this.newDrugSubmissionModel = trans.application_info.control_number;
      this.attestationModel.attestationAsApplicant =
        trans.application_info.applicant_statement;
      this.attestationModel.attestationAsSubmission.timely_submission_statement =
        trans.timely_submission_info.timely_submission_statement;
      this.attestationModel.attestationAsSubmission.marketing_application_date =
        trans.timely_submission_info.marketing_application_date;
      this.attestationModel.attestationAsSubmission.marketing_country =
        trans.timely_submission_info.marketing_country;
    }

    this.hcuseOnlyModel = trans.health_canada_only;
    this.feePaymentModel = trans.advanced_payment;
    this.certModel = trans.certification;

    if (trans.advanced_payment != null) {
      this.transFeeModel = trans.advanced_payment;
    }

    this.applicantModel = this._baseService.getEmptyApplicant();
    const singleApplicant = trans.applicant;
    console.log(Array.isArray(trans.applicant));
    if (!Array.isArray(trans.applicant)) {
      const singleApplicant: IApplicant[] = [];
      const objs = Object.entries(trans.applicant);
      singleApplicant.push(trans.applicant);
      trans.applicant = singleApplicant;
    }
    if (trans.applicant && trans.applicant.length > 0) {
      const applicant = trans.applicant[0]; // Assuming the first applicant is the main applicant
      this.applicantModel = applicant;
      if (trans.applicant[0].contact) {
        this.contactModel = trans.applicant[0].contact;
      }
      if (trans.applicant[0].address) {
        this.addressModel = trans.applicant[0].address;
      }

      // Initialize the billing contact and address models if available
      if (trans.applicant.length > 1) {
        const billingApplicant = trans.applicant[1]; // Assuming the second applicant is the billing applicant
        this.billingModel = billingApplicant;
        if (billingApplicant.contact) {
          this.contactBillingModel = billingApplicant.contact;
        }
        if (billingApplicant.address) {
          this.addressBillingModel = billingApplicant.address;
        }
      }
    }
  }
  public preload() {
    // console.log("Calling preload")
  }

  // public setSelectedTxDesc(val: string) {
  //   // console.log("setSelectedTxDesc==>", val);
  //   // set the value of selectedTxDescSignal and showContact/showFee will be computed
  //   this.selectedTxDescSignal.set(val);

  //   if (!this.showContact()) {
  //     this.holderAddressModel = this._baseService.getEmptyAddressDetailsModel();
  //     this.holderContactModel = this._baseService.getEmptyContactModel();
  //     this.agentAddressModel = this._baseService.getEmptyAddressDetailsModel();
  //     this.agentContactModel = this._baseService.getEmptyContactModel();
  //     this._addressErrors = [];
  //     this._agentAddressErrors = [];
  //     this._contactErrors = [];
  //     this._agentContactErrors = [];
  //   }

  //   if (!this.showFee()) {
  //     this.transFeeModel = this._baseService.getEmptyMasterFileFeeModel();
  //     this._transFeeErrors = [];
  //   }

  //   this.processErrors();
  // }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  _saveXML() {
    if (this.errorList && this.errorList.length < 1) {
      const result: Transaction = this._prepareForSaving(true) as Transaction;
      const fileName = this._generateFileName(result.CERTIFICATE_SUPPLEMENTARY_PROTECTION.enrolment_version);
      const xsltVersion =
        this._versionService.getApplicationMajorVersionWithUnderscore(
          this._globalService.appVersion
        );
      const xslName =
        FILE_OUTPUT_PREFIX.toUpperCase() + '_RT_' + xsltVersion + '.xsl';

      this.fileServices.saveXmlToFile(result, fileName, true, xslName);
      return;
    }
    document.location.href = '#topErrorSummaryId';
  }

  private _prepareForSaving(xmlFile: boolean): Transaction {
    const newTransactionEnrol: TransactionEnrol =
      this._baseService.getEmptyTransactionEnrol();

    //get Patent information data

    const patentInformation = this.patentComponent.getFormValue();
    this._baseService.mapPatentFormsToOutput(
      newTransactionEnrol,
      patentInformation
    );

    const drugUseFormInfor = this.drugUseComponent.getFormValue();
    this._baseService.mapDrugUseFormsToOutput(
      newTransactionEnrol,
      drugUseFormInfor
    );

    const noticeOfComplianceFormInfo =
      this.noticeOfComplianceComponent.getFormValue();
    this._baseService.mapNOCFormsToOutput(
      newTransactionEnrol,
      noticeOfComplianceFormInfo
    );

    const newDrugSubmissionINfo =
      this.newDrugSubmissionInformationComponent.getFormValue();
    this._baseService.mapNewDrugSubmissionInformationFormsToOutput(
      newTransactionEnrol,
      newDrugSubmissionINfo
    );

    const fees = this.feesComponent.getFormValue();
    this._baseService.mapFeesFormsToOutput(newTransactionEnrol, fees);

    const medicinalIngredients =
      this.medicinalIngredientsComponent.getFormValue();
    this._baseService.mapMedicinalIngredientsFormsToOutput(
      newTransactionEnrol,
      medicinalIngredients
    );

    const timingOfApplicant = this.timeOfApplicationComponent.getFormValue();
    this._baseService.mapTimingOfApplicantFormsToOutput(
      newTransactionEnrol,
      timingOfApplicant
    );

    if (this.isInternal) {
      const healthCanadaOnly = this.healthCanadaComponent.getFormValue();
      this._baseService.mapHealthCanadaOnlyFormsToOutput(
        newTransactionEnrol,
        healthCanadaOnly
      );
    }
    const certification = this.certificationComponent.getFormValue();
    this._baseService.mapCertificationFormsToOutput(
      newTransactionEnrol,
      certification
    );

    const applicantInfo = this.applicantComponent.getFormValue();
    const applicantAddressFormGroupValue =
      this.applicantComponent.getApplicantAddressFormValue();
    const applicantContactFormGroupValue =
      this.applicantComponent.getApplicantContactFormValue();
    const billingAddressFormGroupValue =
      this.applicantComponent.getBillingAddressFormValue();
    const billingContactFormGroupValue =
      this.applicantComponent.getBillingContactFormValue();
    this._baseService.mapApplicantInfoToOutput(
      newTransactionEnrol,
      applicantInfo,
      applicantAddressFormGroupValue,
      applicantContactFormGroupValue,
      billingAddressFormGroupValue,
      billingContactFormGroupValue
    );

    const attestationInfo = this.attestationComponent.getFormValue();
    this._baseService.mapAttestationFormsToOutput(
      newTransactionEnrol,
      attestationInfo,
      this.lang,
      this.countryOptions
    );

    this._baseService.mapCertificateOfSupplementaryProtectionFormsToOutput(
      newTransactionEnrol,
      this.cspiModel,
      this._baseService.certSuppProtectForm
    );

    newTransactionEnrol.software_version = this._globalService.appVersion;
    newTransactionEnrol.form_language = this._globalService.currLanguage;

    const output: Transaction = {
      CERTIFICATE_SUPPLEMENTARY_PROTECTION: newTransactionEnrol,
    };

    if (xmlFile) {
      // add and calculate check_sum if it is xml
      output.CERTIFICATE_SUPPLEMENTARY_PROTECTION[CHECK_SUM_CONST] = ''; // this is needed for generating the checksum value
      output.CERTIFICATE_SUPPLEMENTARY_PROTECTION[CHECK_SUM_CONST] =
        this._checkSumService.createHash(output);
    }

    console.log('_prepareForSaving ~ output', JSON.stringify(output, null, 2));

    return output;
  }

  private _generateFileName(enrolment_version:string): string {
    let fileName = FILE_OUTPUT_PREFIX + FILE_OUTPUT_SEPERATOR + enrolment_version;
    let newfielname = fileName.replace(".", FILE_OUTPUT_SEPERATOR);
    return newfielname
  }

  public onChanged(e, controlName) {
    if (e?.target?.checked === false) {
      this.rtForm.controls[controlName].reset();
    }
  }

  private convertAddress(addressModel: INameAddress) {
    if (addressModel.country._id == undefined && addressModel.country.__text) {
      //it is to handle address in old form.

      let newCountry = this._globalService.countryIdMappingList.find(
        (item) => item.id === addressModel.country.__text
      );
      if (newCountry != null) {
        addressModel.country._id = newCountry.newid;
      }

      if (
        addressModel.country._id === 'CA' ||
        addressModel.country._id === 'US'
      ) {
        let provinceLov = String(addressModel.province_lov);
        let tempProvince: IIdTextLabel =
          this._baseService.getEmptyIIdTextLabel();
        tempProvince._id = provinceLov;
        addressModel.province_lov = tempProvince;
      } else {
        addressModel.province_text = addressModel.province_text;
      }
    }
  }

  private convertLanguage(contactBillingModel: IContact) {
    if (
      contactBillingModel.language_correspondance._id == undefined &&
      contactBillingModel.language_correspondance
    ) {
      let tempLangugae: IIdTextLabel = this._baseService.getEmptyIIdTextLabel();
      tempLangugae._id = String(contactBillingModel.language_correspondance);
      contactBillingModel.language_correspondance = tempLangugae;
    }
  }
}
