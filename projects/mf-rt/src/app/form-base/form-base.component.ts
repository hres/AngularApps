import {Component, OnInit, ViewEncapsulation, AfterViewInit, ChangeDetectorRef, ViewChild, HostListener, ViewChildren, QueryList, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileConversionService, CheckSumService, UtilsService, ConverterService, VersionService, FileIoModule, ErrorModule, PipesModule, EntityBaseService, HelpIndex, ControlMessagesComponent, ConvertResults, CHECK_SUM_CONST } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { FilereaderInstructionComponent } from "../filereader-instruction/filereader-instruction.component";
import { ADDR_CONT_TYPE, MASTER_FILE_OUTPUT_PREFIX, ROOT_TAG, START_CHECKSUM_VERSION, VERSION_TAG_PATH } from '../app.constants';
import { RegulatoryInformationComponent } from "../regulatory-information/regulatory-information.component";
import { MasterFileBaseService } from './master-file-base.service';
import { Ectd, FeeDetails, INameAddress, IContact, Transaction, TransactionEnrol} from '../models/transaction';
import { AddressDetailsComponent } from '../address/address.details/address.details.component';
import { MasterFileFeeComponent } from '../master-file-fee/master-file-fee.component';
import { CertificationComponent } from '../certification/certification.component';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';

@Component({
    selector: 'app-form-base',
    standalone: true,
    templateUrl: './form-base.component.html',
    styleUrls: ['./form-base.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [FileConversionService, UtilsService, VersionService, CheckSumService, ConverterService, EntityBaseService, MasterFileBaseService],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, FileIoModule, ErrorModule, PipesModule, AppFormModule, FilereaderInstructionComponent]
})
export class FormBaseComponent implements OnInit, AfterViewInit {
  public errors;
  lang: string;
  helpIndex: HelpIndex;
  devEnv: boolean;
  byPassCheckSum: boolean;

  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  @ViewChild(RegulatoryInformationComponent) regulatoryInfoComponent: RegulatoryInformationComponent;
  @ViewChildren(AddressDetailsComponent) addressComponents: QueryList<AddressDetailsComponent>;
  @ViewChild(MasterFileFeeComponent) feeComponent: MasterFileFeeComponent;
  @ViewChildren(ContactDetailsComponent) contactDetailsComponents: QueryList<ContactDetailsComponent>;
  @ViewChild(CertificationComponent) certificationComponent: CertificationComponent;

  private _regulatoryInfoErrors = [];
  private _transFeeErrors = [];
  private _addressErrors = [];
  private _contactErrors = [];
  private _agentAddressErrors = [];
  private _agentContactErrors = [];
  private _baseErrors = [];
  private _contactConfirmError = [];
  private _certficationErrors = [];
  public masterFileForm: FormGroup; // todo: do we need it? could remove?
  public errorList = [];
  public showErrors: boolean;
  // public showContactFees: boolean[];
  public headingLevel = 'h2';

  public rootTagText = ROOT_TAG;
  public versionTagPath = VERSION_TAG_PATH;
  public startCheckSumVersionNum = START_CHECKSUM_VERSION;

  public enrollModel : Transaction;
  public transactionEnrollModel: TransactionEnrol;
  public ectdModel: Ectd;
  public holderAddressModel: INameAddress;
  public agentAddressModel: INameAddress;
  public holderContactModel: IContact; 
  public agentContactModel: IContact;
  public transFeeModel: FeeDetails;

  public notApplicable: boolean = false;
  public holder: string = ADDR_CONT_TYPE.HOLDER;
  public agent: string = ADDR_CONT_TYPE.AGENT;

  showDateAndRequesterTxDescs: string[] = ['12', '14', '13'];
  noContactTxDescs: string[] = ['12', '14']; //Contact Information section is not shown for these Transaction Descriptions
  noFeeTxDescs: string[] = ['1', '3', '5', '8', '9', '12', '14', '20']; //Fee section is not shown for these Transaction Descriptions
 
  // writable signal for the answer of "Transaction Description" field
  readonly selectedTxDescSignal = signal<string>('');
  // computed signal for rendering of the "Contact" and "Fees" sections
  showContact = computed(() => {
    return this.selectedTxDescSignal()==='' ? true : !this.noContactTxDescs.includes(this.selectedTxDescSignal());
  });
  showFee = computed(() => {
    return this.selectedTxDescSignal()==='' ? true : !this.noFeeTxDescs.includes(this.selectedTxDescSignal());
  });

  showContactFlag: boolean = true;
  showFeeFlag: boolean = true;

  constructor(
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private  _baseService: MasterFileBaseService, private _globalService: GlobalService, private _utilsService: UtilsService,
    private fileServices: FileConversionService, private _versionService: VersionService, private _checkSumService: CheckSumService
  ) {
    this.showErrors = false;
  }

  async ngOnInit() {
    if (!this.masterFileForm) {
      this.masterFileForm = this._baseService.getReactiveModel(this._fb);
    }
    try {

      if (!this._globalService.enrollment) {
        console.log("onInit", "enrollement doesn't exist, create a new one");
        this.enrollModel = this._baseService.getEmptyEnrol();
        this._globalService.enrollment = this.enrollModel;
      } else {
        this.enrollModel = this._globalService.enrollment;
        console.log("onInit", "get enrollement from globalservice");
      }

      this.transactionEnrollModel = this.enrollModel[this.rootTagText];
      console.log('oninit', JSON.stringify(this.transactionEnrollModel, null, 2));

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
    let certifTempErrors = [];
    let contactConfirmTempError = [];
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          // console.log(error);
          if (error.label === 'contactInfoConfirm') {
            contactConfirmTempError.push(error);
          } else {
            certifTempErrors.push(error);
          }
        }
      );
    }

    this._contactConfirmError = contactConfirmTempError;
    this._certficationErrors = certifTempErrors;
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ processErrors');
    this.errorList = [];
    // concat the error arrays
    this.errorList = this.errorList.concat(this._regulatoryInfoErrors);

    // if (this.showContactFees[0] === true) {
    if (this.showContact()) {
      this.errorList = this.errorList.concat(
        this._addressErrors.concat(this._contactErrors)
      );
    //   if(!this.notApplicable)
    //     this.errorList = this.errorList.concat(
    //       this._agentAddressErrors.concat(this._agentContactErrors)
    //     );
    //   this.errorList = this.errorList.concat(this._contactConfirmError);
    }

    // if (this.showContactFees[1] === true) {
    if (this.showFee()) {
      this.errorList = this.errorList.concat(this._transFeeErrors);
    }
    this.errorList = this.errorList.concat(this._certficationErrors);

    this.cdr.detectChanges(); // doing our own change detection
  }

  processRegulatoryInfoErrors(errorList) {
    this._regulatoryInfoErrors = errorList;
    this.processErrors();
  }

  processContactErrors(errorList) {
    this._contactErrors = errorList;
    this.processErrors();
  }

  processTransFeeErrors(errorList) {
    this._transFeeErrors = errorList;
    this.processErrors();
  }

  processCertificationErrors(errorList) {
    this._certficationErrors = errorList;
    this.processErrors();
  }

  processAddressErrors(errorList) {
    this._addressErrors = errorList;
    this.processErrors();
  }

  processAgentAddressErrors(errorList) {
    this._agentAddressErrors = errorList;
    this.processErrors();
  }

  processAgentContactErrors(errorList) {
    this._agentContactErrors = errorList;
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
    const fileName = this._generateFileName(result[ROOT_TAG]);
    this.fileServices.saveJsonToFile(result, fileName, null);
  }

  public processFile(fileData: ConvertResults) {
    console.log('processing file.....');
    console.log(fileData);
    this.transactionEnrollModel = fileData.data.TRANSACTION_ENROL;
    this._initModels(this.transactionEnrollModel);

    this.setSelectedTxDesc(this.ectdModel.lifecycle_record?.sequence_description_value?._id);


    // if (this.ectdModel.lifecycle_record.sequence_description_value) {
    //   this.showContactFees[0] = !this.noContactTxDescs.includes(
    //     this.ectdModel?.lifecycle_record.sequence_description_value._id);
    //   this.showContactFees[1] = !this.noFeeTxDescs.includes(
    //     this.ectdModel?.lifecycle_record.sequence_description_value._id);
    // }
    // if (this.showContactFees[0] === true) {
    //   this.holderAddressModel = fileData.data.TRANSACTION_ENROL.contact_info.holder_name_address;
    //   this.holderContactModel = fileData.data.TRANSACTION_ENROL.contact_info.holder_contact;
    //   this.agentAddressModel = fileData.data.TRANSACTION_ENROL.contact_info.agent_name_address;
    //   this.agentContactModel = fileData.data.TRANSACTION_ENROL.contact_info.agent_contact;
    // }
    // if (this.showFee()) {
    //   this.transFeeModel = this.transactionEnrollModel.fee_details;
    // }
    // this.certificationModel = this.transactionEnrollModel.certification;
    // MasterFileBaseService.mapDataModelToFormModel(this.transactionEnrollModel, this.masterFileForm);
    this._baseService.mapDataModelToFormModel(this.transactionEnrollModel.contact_info, this.masterFileForm);
    this.agentInfoOnChange();
  }

  
  private _initModels(trans: TransactionEnrol) {
    this.ectdModel = trans.ectd;
    this.holderAddressModel = trans.contact_info.holder_name_address;
    this.holderContactModel = trans.contact_info.holder_contact;
    this.agentAddressModel = trans.contact_info.agent_name_address;
    this.agentContactModel = trans.contact_info.agent_contact;
    this.transFeeModel = trans.fee_details;
  }

  public preload() {
    // console.log("Calling preload")
  }

  public setSelectedTxDesc(val: string) {
    console.log("setSelectedTxDesc==>", val);
    // set the value of selectedTxDescSignal and showContact/showFee will be computed
    this.selectedTxDescSignal.set(val);

    if (!this.showContact()) {
      this.holderAddressModel = this._baseService.getEmptyAddressDetailsModel();
      this.holderContactModel = this._baseService.getEmptyContactModel();
      this.agentAddressModel = this._baseService.getEmptyAddressDetailsModel();
      this.agentContactModel = this._baseService.getEmptyContactModel();
      this._addressErrors = [];
      this._agentAddressErrors = [];
      this._contactErrors = [];
      this._agentContactErrors = [];
    }

    if (!this.showFee()) {
      this.transFeeModel = this._baseService.getEmptyMasterFileFeeModel();
      this._transFeeErrors = [];
    }
    
    this.processErrors();
  }


  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  _saveXML() {
    if (this.errorList && this.errorList.length < 1) {
      const result: Transaction = this._prepareForSaving(true);
      const fileName = this._generateFileName(result[ROOT_TAG]);
      const xsltVersion = this._versionService.getApplicationMajorVersionWithUnderscore(this._globalService.appVersion)
      const xslName = MASTER_FILE_OUTPUT_PREFIX.toUpperCase() + '_RT_' + xsltVersion + '.xsl';

      console.log('save ...');
      this.fileServices.saveXmlToFile(result, fileName, true, xslName);
      return;
    }
    document.location.href = '#topErrorSummaryId';
  }

  private _prepareForSaving(xmlFile: boolean): Transaction {

    const newTransactionEnrol: TransactionEnrol = this._baseService.getEmptyTransactionEnrol();

    // regulatoryInfo and certification are always rendered, their mappings to output data should always be executed
    const regulatoryInfoFormGroupValue = this.regulatoryInfoComponent.getFormValue();
    const certificationFormGroupValue = this.certificationComponent.getFormValue(); 
    this._baseService.mapRequiredFormsToOutput(newTransactionEnrol, regulatoryInfoFormGroupValue, certificationFormGroupValue);

    // contactInfo and fee are conditional rendered, do their mappings to output data only when applicable
    if (this.showContact()) {
      newTransactionEnrol.contact_info.agent_not_applicable = this.masterFileForm.controls['notApplicable'].value;
      newTransactionEnrol.contact_info.contact_info_confirm = this.masterFileForm.controls['contactInfoConfirm'].value;
      console.log(newTransactionEnrol.contact_info.agent_not_applicable, newTransactionEnrol.contact_info.contact_info_confirm);

      const addressesFormGroupValue = this.addressComponents.map((comp: AddressDetailsComponent) => ({
        addrType: comp.addrType,
        value: comp.getFormValue()
      })); 
      const contactsFormGroupValue = this.contactDetailsComponents.map((comp: ContactDetailsComponent) => ({
        contactType: comp.contactType,
        value: comp.getFormValue()
      })); 

      this._baseService.mapAddressFormContactFormToOutput(newTransactionEnrol.contact_info, addressesFormGroupValue, contactsFormGroupValue);

    } else {
      newTransactionEnrol.contact_info = null;
    }

    if (this.showFee()) {
      const feeFormGroupValue = this.feeComponent.getFormValue();
      this._baseService.mapFeeFormToOutput(newTransactionEnrol.fee_details, feeFormGroupValue);
    } else {
      newTransactionEnrol.fee_details = null;
    }

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

    console.log('_prepareForSaving ~ newTransactionEnrol', JSON.stringify(output, null, 2));

    return output;
  }

  private _generateFileName(transactionEnrol: TransactionEnrol): string {
    let fileName =
      MASTER_FILE_OUTPUT_PREFIX + "-" +
      transactionEnrol.ectd.dossier_id +
      '-' +
      transactionEnrol.date_saved;
    return fileName;
  }

  public agentInfoOnChange() {
    this.notApplicable = this.masterFileForm.controls['notApplicable'].value;
    // console.log ("this.notApplicable=",this.notApplicable, typeof this.notApplicable);

    if (this.notApplicable) {
      this.agentAddressModel = this._baseService.getEmptyAddressDetailsModel();
      this.agentContactModel = this._baseService.getEmptyContactModel();
      this._agentAddressErrors = null;
      this._agentContactErrors = null;
    }

    this.processErrors();
  }

  public onChanged(e, controlName) {
    if (e?.target?.checked === false) {
      this.masterFileForm.controls[controlName].reset();
    }
  }

  checkDateValidity(event: any): void {
    this._utilsService.checkInputValidity(event, this.masterFileForm.get('submitDate'), 'invalidDate');
  }

}
