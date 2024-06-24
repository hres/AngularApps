import {Component, OnInit, Input, ViewEncapsulation, AfterViewInit, ChangeDetectorRef, ViewChild, HostListener, ViewChildren, QueryList, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileConversionService, CheckSumService, UtilsService, ConverterService, VersionService, FileIoModule, ErrorModule, PipesModule, EntityBaseService, HelpIndex, ControlMessagesComponent, ConvertResults } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { FilereaderInstructionComponent } from "../filereader-instruction/filereader-instruction.component";
import { MASTER_FILE_OUTPUT_PREFIX, ROOT_TAG } from '../app.constants';
import { RegulatoryInformationComponent } from "../regulatory-information/regulatory-information.component";
import { MasterFileBaseService } from './master-file-base.service';
import { Certification, Ectd, FeeDetails, INameAddress, IContact, Transaction, TransactionEnrol} from '../models/transaction';
import { MasterFileFeeComponent } from '../master-file-fee/master-file-fee.component';

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
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  @ViewChild(RegulatoryInformationComponent) regulatoryInfoComponent: RegulatoryInformationComponent;

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
  private appVersion: string;
  private xslName: string;

  public enrollModel : Transaction;
  public transactionEnrollModel: TransactionEnrol;
  public ectdModel: Ectd;
  public holderAddressModel: INameAddress;
  public agentAddressModel: INameAddress;
  public holderContactModel: IContact; 
  public agentContactModel: IContact;
  public transFeeModel: FeeDetails;
  public certificationModel: Certification;

  public notApplicable: boolean = false;
  public holder: string = 'holder';
  public agent: string = 'agent';

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

  constructor(
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private  _baseService: MasterFileBaseService, private _globalService: GlobalService, private _utilsService: UtilsService,
    private fileServices: FileConversionService
  ) {
    this.showErrors = false;
    // this.showContactFees = [true, true];
    this.appVersion = this._globalService.appVersion;
    let xsltVersion = this.appVersion.split('.',2).join("_");
    this.xslName = MASTER_FILE_OUTPUT_PREFIX.toUpperCase() + '_RT_' + xsltVersion + '.xsl';
  }

  async ngOnInit() {
    if (!this.masterFileForm) {
      this.masterFileForm = this._baseService.getReactiveModel(this._fb);
    }
    try {

      if (!this._globalService.enrollment) {
        // this._loggerService.log("form.base", "onInit", "enrollement doesn't exist, create a new one");
        this.enrollModel = this._baseService.getEmptyEnrol();
        this._globalService.enrollment = this.enrollModel;
      } else {
        this.enrollModel = this._globalService.enrollment;
        // console.log("onInit", "get enrollement from globalservice", JSON.stringify(this.enrollModel, null, 2));
      }

      this.transactionEnrollModel = this.enrollModel[this.rootTagText];
      this.holderContactModel = this.transactionEnrollModel.contact_info.holder_contact;
      this.agentContactModel = this.transactionEnrollModel.contact_info.agent_contact;

      this.lang = this._globalService.currLanguage;
      this.helpIndex = this._globalService.helpIndex;
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

  processContactErrors(errorList) {
    this._contactErrors = errorList;
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
    const result = this._prepareForSaving(false);
    const fileName = this._generateFileName();
    this.fileServices.saveJsonToFile(result, fileName, null);
  }

  public processFile(fileData: ConvertResults) {
    console.log('processing file.....');
    console.log(fileData);
    this.transactionEnrollModel = fileData.data.TRANSACTION_ENROL;
    this.ectdModel = this.transactionEnrollModel.ectd;
    this.holderAddressModel = this.transactionEnrollModel.contact_info.holder_name_address;
    this.agentAddressModel = this.transactionEnrollModel.contact_info.agent_name_address;

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
    // if (this.showContactFees[1] === true) {
      this.transFeeModel = this.transactionEnrollModel.fee_details;
    // }

    // MasterFileBaseService.mapDataModelToFormModel(this.transactionEnrollModel, this.masterFileForm);
    this.agentInfoOnChange();
  }

  private _updateSavedDate() {
    const today = new Date();
    const pipe = new DatePipe('en-US');
    this.transactionEnrollModel.date_saved = pipe.transform(
      today,
      'yyyy-MM-dd-hhmm'
    );
  }

  private _updateSoftwareVersion() {
    this.transactionEnrollModel.software_version = this.appVersion;
  }

  public preload() {
    // console.log("Calling preload")
  }

  public setSelectedTxDesc(val: string) {
    console.log("setSelectedTxDesc==>", val);
    this.selectedTxDescSignal.set(val);
    // this.showContactFees = flag; 

    // if (this.showContactFees[0] === false) {
    //   this.holderAddressModel = MasterFileBaseService.getEmptyAddressDetailsModel();
    //   this.holderContactModel = MasterFileBaseService.getEmptyContactModel();
    //   this.agentAddressModel = MasterFileBaseService.getEmptyAddressDetailsModel();
    //   this.agentContactModel = MasterFileBaseService.getEmptyContactModel();
    //   this._addressErrors = [];
    //   this._agentAddressErrors = [];
    //   this._contactErrors = [];
    //   this._agentContactErrors = [];
    // }
    // if (this.showContactFees[1] === false) {
    //   this.transFeeModel = MasterFileBaseService.getEmptyMasterFileFeeModel();
    //   this._transFeeErrors = [];
    // }
    // this.processErrors();
  }


  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  _saveXML() {
    if (this.errorList && this.errorList.length < 1) {
      const result = this._prepareForSaving(true);
      const fileName = this._generateFileName();

      console.log('save ...');
      this.fileServices.saveXmlToFile(result, fileName, true, this.xslName);
      return;
    }
    document.location.href = '#topErrorSummaryId';
  }

  private _prepareForSaving(finalFile: boolean): Transaction {
    if (finalFile) {
      // this.masterFileModel.enrol_version = this.masterFileModel.enrol_version; // todo do we need the enrol_version field?
    }

    this._updateSavedDate();
    this._updateSoftwareVersion();

    const regulatoryInfoFormGroupValue = this.regulatoryInfoComponent.regulartoryInfoForm.value;

    // if (this.ectdModel.lifecycle_record.sequence_description_value) {
    //   this.showContactFees[0] = !this.noContactTxDescs.includes(
    //     this.ectdModel?.lifecycle_record.sequence_description_value._id);
    //   this.showContactFees[1] = !this.noFeeTxDescs.includes(
    //     this.ectdModel?.lifecycle_record.sequence_description_value._id);
    // }
    // if (this.showContactFees[0] === true) {
    //   this.transactionEnrollModel.contact_info = MasterFileBaseService.getEmptyContactInfo();
    //   this.transactionEnrollModel.contact_info.holder_name_address = this.holderAddressModel;
    //   this.transactionEnrollModel.contact_info.holder_contact = this.holderContactModel;
    //   this.transactionEnrollModel.contact_info.agent_name_address = this.agentAddressModel;
    //   this.transactionEnrollModel.contact_info.agent_contact = this.agentContactModel;
    //   this.transactionEnrollModel.contact_info.contact_info_confirm =
    //     this.masterFileForm.controls['contactInfoConfirm'].value;
    //   this.transactionEnrollModel.contact_info.agent_not_applicable = this.notApplicable;
    // } else {
    //   this.transactionEnrollModel.contact_info = null;
    // }
    // if (this.showContactFees[1] === true) {
      this.transactionEnrollModel.fee_details = this.transFeeModel;
    // } else {
    //   this.transactionEnrollModel.fee_details = null;
    // }

    // this.transactionEnrollModel.certification = this.certificationModel;

    const result: Transaction = this._baseService.mapFormToOutput(regulatoryInfoFormGroupValue);
    console.log('_prepareForSaving ~ result', JSON.stringify(result, null, 2));

    return result;
  }

  private _generateFileName(): string {
    let fileName =
      MASTER_FILE_OUTPUT_PREFIX + "-" +
      this.transactionEnrollModel.ectd.dossier_id +
      '-' +
      this.transactionEnrollModel.date_saved;
    return fileName;
  }

  public agentInfoOnChange() {
    this.notApplicable = this.masterFileForm.controls['notApplicable'].value;
    // console.log ("this.notApplicable=",this.notApplicable, typeof this.notApplicable);

    // if (this.notApplicable) {
    //   this.agentAddressModel = MasterFileBaseService.getEmptyAddressDetailsModel();
    //   this.agentContactModel = MasterFileBaseService.getEmptyContactModel();
    //   this._agentAddressErrors = null;
    //   this._agentContactErrors = null;
    // }

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
