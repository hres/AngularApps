import {ChangeDetectorRef, Component, OnInit, ViewChild, Input, HostListener, ViewEncapsulation, AfterViewInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MasterFileBaseService} from './master-file-base.service';
import {FileConversionService} from '../filereader/file-io/file-conversion.service';
import {ConvertResults} from '../filereader/file-io/convert-results';
import {GlobalsService} from '../globals/globals.service';
import {MasterFileDataLoaderService} from '../data-loader/master-file-data-loader.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import { Transaction } from '../models/transaction';
import { VersionService } from '../shared/version.service';

@Component({
  selector: 'master-file-base',
  templateUrl: './master-file-base.component.html',
  styleUrls: ['./master-file-base.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MasterFileBaseComponent implements OnInit, AfterViewInit {
  public errors;
  @Input() isInternal;
  @Input() lang;
  @Input() helpTextSequences;

  private _regulatoryInfoErrors = [];
  private _transFeeErrors = [];
  private _addressErrors = [];
  private _contactErrors = [];
  private _agentAddressErrors = [];
  private _agentContactErrors = [];
  public masterFileForm: FormGroup; // todo: do we need it? could remove?
  public errorList = [];
  public showErrors: boolean;
  public showContactFees: boolean;
  public headingLevel = 'h2';
  
  public rootTagText = 'TRANSACTION_ENROL';
  private appVersion: string;
  private xslName: string;

  public transactionEnrollModel = MasterFileBaseService.getEmptyTransactionEnrol();
  public ectdModel = this.transactionEnrollModel.ectd;
  public holderAddressModel = MasterFileBaseService.getEmptyAddressDetailsModel();
  public agentAddressModel = MasterFileBaseService.getEmptyAddressDetailsModel();
  public holderContactModel = this.transactionEnrollModel.contact_info.holder_contact;
  public agentContactModel = this.transactionEnrollModel.contact_info.agent_contact;
  public countryList = [];
  public provinceList = [];
  public stateList = [];

  public transFeeModel = MasterFileBaseService.getEmptyMasterFileFeeModel();

  public notApplicable: boolean = false;

  /* public customSettings: TinyMce.Settings | any;*/
  constructor(
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dataLoader: MasterFileDataLoaderService,
    private http: HttpClient,
    private translate: TranslateService,
    private _versionService: VersionService, 
    private fileServices: FileConversionService
  ) {
    dataLoader = new MasterFileDataLoaderService(this.http);

    this.countryList = [];
    this.provinceList = [];
    this.stateList = [];
    this.showErrors = false;
    this.showContactFees = true;
    this.appVersion = this._versionService.getApplicationVersion();
    let xsltVersion = this.appVersion.split('.',2).join(".");
    this.xslName = GlobalsService.MASTER_FILE_OUTPUT_PREFIX.toUpperCase() + '_RT_' + xsltVersion + '.xsl';
  }

  async ngOnInit() {
    if (!this.masterFileForm) {
      this.masterFileForm = MasterFileBaseService.getReactiveModel(this._fb);
    }
    this.countryList = await this.dataLoader.getCountries(
      this.translate.currentLang
    );
    this.provinceList = await this.dataLoader.getProvinces(
      this.translate.currentLang
    );
    this.stateList = await this.dataLoader.getStates(
      this.translate.currentLang
    );
  }
  ngAfterViewInit(): void {
    document.location.href = '#def-top';
    document.location.href = '#main';
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ Processing errors in ApplicationInfo base compo
    this.errorList = [];
    // concat the two array
    this.errorList = this._regulatoryInfoErrors.concat(
      this._addressErrors.concat(
        this._contactErrors.concat(
          this._agentAddressErrors.concat(
            this._agentContactErrors.concat(this._transFeeErrors)
          )
        )
      )
    );

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
    this.transFeeModel = fileData.data.TRANSACTION_ENROL.fee_details;
    this.holderAddressModel = fileData.data.TRANSACTION_ENROL.contact_info.holder_name_address;
    this.holderContactModel = fileData.data.TRANSACTION_ENROL.contact_info.holder_contact;
    this.agentAddressModel = fileData.data.TRANSACTION_ENROL.contact_info.agent_name_address;
    this.agentContactModel = fileData.data.TRANSACTION_ENROL.contact_info.agent_contact;

    MasterFileBaseService.mapDataModelToFormModel(this.transactionEnrollModel, this.masterFileForm);
  }

  private _updateSavedDate() {
    const today = new Date();
    const pipe = new DatePipe('en-US');
    this.transactionEnrollModel.last_saved_date = pipe.transform(
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

  public setShowContactFeesFlag(flag) {
    this.showContactFees = flag;

    if (this.showContactFees === false) {
      this.transFeeModel = MasterFileBaseService.getEmptyMasterFileFeeModel();
      this.holderAddressModel = MasterFileBaseService.getEmptyAddressDetailsModel();
      this.holderContactModel = MasterFileBaseService.getEmptyContactModel();
      this.agentAddressModel = MasterFileBaseService.getEmptyAddressDetailsModel();
      this.agentContactModel = MasterFileBaseService.getEmptyContactModel();
    }
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
    if (this.showContactFees) {
      this.transactionEnrollModel.contact_info.holder_name_address = this.holderAddressModel;
      this.transactionEnrollModel.contact_info.holder_contact = this.holderContactModel;
      this.transactionEnrollModel.contact_info.agent_name_address = this.agentAddressModel;
      this.transactionEnrollModel.contact_info.agent_contact = this.agentContactModel;
      this.transactionEnrollModel.fee_details = this.transFeeModel;
    }
    this.transactionEnrollModel.contact_info.contact_info_confirm =
      this.masterFileForm.controls['contactInfoConfirm'].value;
    this.transactionEnrollModel.certify_accurate_complete =
      this.masterFileForm.controls['certifyAccurateComplete'].value;
    this.transactionEnrollModel.full_name =
      this.masterFileForm.controls['fullName'].value;
    this.transactionEnrollModel.submit_date =
      this.masterFileForm.controls['submitDate'].value;

    const result: Transaction = {
      TRANSACTION_ENROL: this.transactionEnrollModel,
    };

    console.log('_prepareForSaving ~ result', JSON.stringify(result));

    return result;
  }

  private _generateFileName(): string {
    let fileName =
      GlobalsService.MASTER_FILE_OUTPUT_PREFIX + "-" + 
      this.transactionEnrollModel.ectd.dossier_id +
      '-' +
      this.transactionEnrollModel.last_saved_date;
    return fileName;
  }

  public agentInfoOnChange() {
    this.notApplicable = this.masterFileForm.controls['notApplicable'].value;
  }
}
