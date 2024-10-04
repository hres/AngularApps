import {Component, OnInit, ViewEncapsulation, AfterViewInit, ChangeDetectorRef, ViewChild, HostListener, ViewChildren, QueryList, signal, computed, inject, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileConversionService, CheckSumService, UtilsService, ConverterService, VersionService, FileIoModule, ErrorModule, PipesModule, EntityBaseService, HelpIndex, ControlMessagesComponent, ConvertResults, CHECK_SUM_CONST } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { DOSSIER_TYPE, FILE_OUTPUT_PREFIX, ROOT_TAG, START_CHECKSUM_VERSION, VERSION_TAG_PATH } from '../app.constants';
import { FormBaseService } from './form-base.service';
import { Ectd, FeeDetails, INameAddress, IContact, Transaction, TransactionEnrol} from '../models/transaction';
import { AppSignalService } from '../signal/app-signal.service';
import { RegulatoryInformationComponent } from '../regulatory-information/regulatory-information.component';

@Component({
    selector: 'app-form-base',
    standalone: true,
    templateUrl: './form-base.component.html',
    styleUrls: ['./form-base.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [FileConversionService, UtilsService, VersionService, CheckSumService, ConverterService, EntityBaseService, FormBaseService],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, FileIoModule, ErrorModule, PipesModule, AppFormModule]
})
export class FormBaseComponent implements OnInit, AfterViewInit {
  public errors;
  lang: string;
  helpIndex: HelpIndex;
  devEnv: boolean;
  byPassCheckSum: boolean;

  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  
  @ViewChild(RegulatoryInformationComponent) regulatoryInfoComponent: RegulatoryInformationComponent;
  // @ViewChildren(AddressDetailsComponent) addressComponents: QueryList<AddressDetailsComponent>;
  // @ViewChild(MasterFileFeeComponent) feeComponent: MasterFileFeeComponent;
  // @ViewChildren(ContactDetailsComponent) contactDetailsComponents: QueryList<ContactDetailsComponent>;
  // @ViewChild(CertificationComponent) certificationComponent: CertificationComponent;

  private _regulatoryInfoErrors = [];
  // private _transFeeErrors = [];
  // private _addressErrors = [];
  // private _contactErrors = [];
  // private _agentAddressErrors = [];
  // private _agentContactErrors = [];
  // private _contactConfirmError = [];
  // private _certficationErrors = [];
  public rtForm: FormGroup; 
  public errorList = [];
  public showErrors: boolean;
  
  public headingLevel = 'h2';

  public rootTagText = ROOT_TAG;
  public versionTagPath = VERSION_TAG_PATH;
  public startCheckSumVersionNum = START_CHECKSUM_VERSION;

  public enrollModel : Transaction;
  public transactionEnrollModel: TransactionEnrol;
  public ectdModel: Ectd;
  // public holderAddressModel: INameAddress;
  // public agentAddressModel: INameAddress;
  // public holderContactModel: IContact; 
  // public agentContactModel: IContact;
  public transFeeModel: FeeDetails;

  // public notApplicable: boolean = false;
  // public holder: string = ADDR_CONT_TYPE.HOLDER;
  // public agent: string = ADDR_CONT_TYPE.AGENT;

  // noContactTxDescs: string[] = ['12', '14']; //Contact Information section is not shown for these Transaction Descriptions
  // noFeeTxDescs: string[] = ['1', '3', '5', '8', '9', '12', '14', '20']; //Fee section is not shown for these Transaction Descriptions
 
  
  private _signalService = inject(AppSignalService)

  // dossier type related signals
  readonly selectedDossierType: Signal<string> = this._signalService.getSelectedDossierType();
  isVeterinaryDossierType: Signal<boolean> =  computed(() => this.selectedDossierType() === DOSSIER_TYPE.VETERINARY);
  isPharmaOrBioDossierType: Signal<boolean> = computed(() => this.selectedDossierType() === DOSSIER_TYPE.PHARMACEUTICAL_HUMAN || this.selectedDossierType() === DOSSIER_TYPE.BIOLOGIC_HUMAN);

  // computed signal for rendering "Fees" section
  showFees: Signal<boolean> = computed(() => {
    return this._utilsService.isEmpty(this.selectedDossierType()) ? true : this.isPharmaOrBioDossierType();
  });

  constructor(
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private  _baseService: FormBaseService, private _globalService: GlobalService, private _utilsService: UtilsService,
    private fileServices: FileConversionService, private _versionService: VersionService, private _checkSumService: CheckSumService
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
      // console.log('oninit', JSON.stringify(this.transactionEnrollModel, null, 2));

      this._initModels(this.transactionEnrollModel);

      this.lang = this._globalService.currLanguage;
      this.helpIndex = this._globalService.helpIndex;
      this.devEnv = this._globalService.devEnv;
      this.byPassCheckSum = this._globalService.byPassChecksum;
    } catch (e) {
      console.error(e);
    }
  }

  ngAfterViewInit(): void {
    document.location.href = '#def-top';

    this.msgList.changes.subscribe(errorObjs => {
      let temp = [];
      this._updateErrorList(errorObjs);
      this.processErrors();
    });
    this.msgList.notifyOnChanges();
  }

  private _updateErrorList(errorObjs) {

  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ processErrors');
    this.errorList = [];
    // concat the error arrays
    this.errorList = this.errorList.concat(this._regulatoryInfoErrors);

    // if (this.showContact()) {
    //   this.errorList = this.errorList.concat(
    //     this._addressErrors.concat(this._contactErrors)
    //   );
    //   if(!this.notApplicable)
    //     this.errorList = this.errorList.concat(
    //       this._agentAddressErrors.concat(this._agentContactErrors)
    //     );
    //   this.errorList = this.errorList.concat(this._contactConfirmError);
    // }

    // if (this.showFees()) {
    //   this.errorList = this.errorList.concat(this._transFeeErrors);
    // }

    // this.errorList = this.errorList.concat(this._certficationErrors);

    this.cdr.detectChanges(); // doing our own change detection
  }

  processRegulatoryInfoErrors(errorList) {
    this._regulatoryInfoErrors = errorList;
    this.processErrors();
  }

  // processContactErrors(errorList) {
  //   this._contactErrors = errorList;
  //   this.processErrors();
  // }

  // processTransFeeErrors(errorList) {
  //   this._transFeeErrors = errorList;
  //   this.processErrors();
  // }

  // processCertificationErrors(errorList) {
  //   this._certficationErrors = errorList;
  //   this.processErrors();
  // }

  // processAddressErrors(errorList) {
  //   this._addressErrors = errorList;
  //   this.processErrors();
  // }

  // processAgentAddressErrors(errorList) {
  //   this._agentAddressErrors = errorList;
  //   this.processErrors();
  // }

  // processAgentContactErrors(errorList) {
  //   this._agentContactErrors = errorList;
  //   this.processErrors();
  // }

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
    const fileName = this._generateFileName(result[ROOT_TAG]);
    this.fileServices.saveJsonToFile(result, fileName, null);
  }

  public processFile(fileData: ConvertResults) {
    // console.log(fileData);
    if (fileData.data !== null) {
      this.transactionEnrollModel = fileData.data.TRANSACTION_ENROL;
      this._initModels(this.transactionEnrollModel);
      // this.setSelectedTxDesc(this.ectdModel.lifecycle_record?.sequence_description_value?._id);
      // this._baseService.mapDataModelToFormModel(this.transactionEnrollModel.contact_info, this.rtForm);
      // this.agentInfoOnChange();
    }
  }
  
  private _initModels(trans: TransactionEnrol) {
    this.ectdModel = trans.ectd;
    // if (trans.contact_info != null) {
    //   this.holderAddressModel = trans.contact_info.holder_name_address;
    //   this.holderContactModel = trans.contact_info.holder_contact;
    //   this.agentAddressModel = trans.contact_info.agent_name_address;
    //   this.agentContactModel = trans.contact_info.agent_contact;
    // }
    if (trans.fee_details != null) {
      this.transFeeModel = trans.fee_details;
    }
  }

  public preload() {
    // console.log("Calling preload")
  }

  // public setSelectedTxDesc(val: string) {
  //   // console.log("setSelectedTxDesc==>", val);
  //   // set the value of selectedTxDescSignal and showContact/showFees will be computed
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

  //   if (!this.showFees()) {
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
      const result: Transaction = this._prepareForSaving(true);
      const fileName = this._generateFileName(result[ROOT_TAG]);
      const xsltVersion = this._versionService.getApplicationMajorVersionWithUnderscore(this._globalService.appVersion)
      const xslName = FILE_OUTPUT_PREFIX.toUpperCase() + '_RT_' + xsltVersion + '.xsl';

      this.fileServices.saveXmlToFile(result, fileName, true, xslName);
      return;
    }
    document.location.href = '#topErrorSummaryId';
  }

  private _prepareForSaving(xmlFile: boolean): Transaction {

    const newTransactionEnrol: TransactionEnrol = this._baseService.getEmptyTransactionEnrol();

    // regulatoryInfo and certification are always rendered, their mappings to output data should always be executed
    const regulatoryInfoFormGroupValue = this.regulatoryInfoComponent.getFormValue();
    this._baseService.mapRequiredFormsToOutput(newTransactionEnrol, regulatoryInfoFormGroupValue);

    // // contactInfo and fee are conditional rendered, do their mappings to output data only when applicable
    // if (this.showContact()) {
    //   newTransactionEnrol.contact_info.agent_not_applicable = this.rtForm.controls['notApplicable'].value;
    //   newTransactionEnrol.contact_info.contact_info_confirm = this.rtForm.controls['contactInfoConfirm'].value;
    //   console.log(newTransactionEnrol.contact_info.agent_not_applicable, newTransactionEnrol.contact_info.contact_info_confirm);

    //   const addressesFormGroupValue = this.addressComponents.map((comp: AddressDetailsComponent) => ({
    //     addrType: comp.addrType,
    //     value: comp.getFormValue()
    //   })); 
    //   const contactsFormGroupValue = this.contactDetailsComponents.map((comp: ContactDetailsComponent) => ({
    //     contactType: comp.contactType,
    //     value: comp.getFormValue()
    //   })); 

    //   this._baseService.mapAddressFormContactFormToOutput(newTransactionEnrol.contact_info, addressesFormGroupValue, contactsFormGroupValue);

    // } else {
    //   newTransactionEnrol.contact_info = null;
    // }

    // if (this.showFees()) {
    //   const feeFormGroupValue = this.feeComponent.getFormValue();
    //   this._baseService.mapFeeFormToOutput(newTransactionEnrol.fee_details, feeFormGroupValue);
    // } else {
    //   newTransactionEnrol.fee_details = null;
    // }

    newTransactionEnrol.date_saved = this._utilsService.getFormattedDate('yyyy-MM-dd-hhmm');
    newTransactionEnrol.software_version = this._globalService.appVersion;
    newTransactionEnrol.form_language = this._globalService.currLanguage;

    const output: Transaction = {
      TRANSACTION_ENROL: newTransactionEnrol
    };

    if (xmlFile) {
      // add and calculate check_sum if it is xml
      output.TRANSACTION_ENROL[CHECK_SUM_CONST]  = "";   // this is needed for generating the checksum value
      output.TRANSACTION_ENROL[CHECK_SUM_CONST]  = this._checkSumService.createHash(output);
    }

    console.log('_prepareForSaving ~ output', JSON.stringify(output, null, 2));

    return output;
  }

  private _generateFileName(transactionEnrol: TransactionEnrol): string {
    let fileName =
      FILE_OUTPUT_PREFIX + "-" +
      transactionEnrol.ectd.dossier_id +
      '-' +
      transactionEnrol.date_saved;
    return fileName;
  }

  // public agentInfoOnChange() {
  //   this.notApplicable = this.rtForm.controls['notApplicable'].value;
  //   // console.log ("this.notApplicable=",this.notApplicable, typeof this.notApplicable);

  //   if (this.notApplicable) {
  //     this.agentAddressModel = this._baseService.getEmptyAddressDetailsModel();
  //     this.agentContactModel = this._baseService.getEmptyContactModel();
  //     this._agentAddressErrors = null;
  //     this._agentContactErrors = null;
  //   }

  //   this.processErrors();
  // }

  public onChanged(e, controlName) {
    if (e?.target?.checked === false) {
      this.rtForm.controls[controlName].reset();
    }
  }

}
