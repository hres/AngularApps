import {ChangeDetectorRef, Component, OnInit, ViewChild, Input, HostListener, ViewEncapsulation, AfterViewInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// import {TranslateService} from '@ngx-translate/core';
import {MasterFileBaseService} from './master-file-base.service';
import {FileConversionService} from '../filereader/file-io/file-conversion.service';
import {ConvertResults} from '../filereader/file-io/convert-results';
import {GlobalsService} from '../globals/globals.service';
// import {AddressDetailsComponent} from '../address/address.details/address.details.component';

// import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {MasterFileDataLoaderService} from '../data-loader/master-file-data-loader.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
// import { timeout } from 'rxjs/operators';
import {RequesterListComponent} from '../requester/requester.list/requester.list.component';
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
  @ViewChild(RequesterListComponent, { static: false })
  requesterListChild: RequesterListComponent;

  private _masterFileDetailErrors = [];   // todo remove masterFileDetail related codes
  private _regulatoryInfoErrors = [];
  private _requesterErrors = [];
  private _transFeeErrors = [];
  private _addressErrors = [];
  private _contactErrors = [];
  private _agentAddressErrors = [];
  private _agentContactErrors = [];
  public masterFileForm: FormGroup; // todo: do we need it? could remove?
  public errorList = [];
  public rootTagText = 'TRANSACTION_ENROL';
  public userList = [];
  public showErrors: boolean;
  public isSolicitedFlag: boolean;
  public title = '';
  public headingLevel = 'h2';

  private appVersion: string;
  private xslName: string;

  public transactionEnrollModel = MasterFileBaseService.getEmptyTransactionEnrol();
  public ectdModel = this.transactionEnrollModel.ectd;
  //public mfAddressModel = MasterFileBaseService.getEmptyAddressDetailsModel();

  public holderAddressModel =
    MasterFileBaseService.getEmptyAddressDetailsModel();

  public agentAddressModel =
    MasterFileBaseService.getEmptyAddressDetailsModel();
  public holderContactModel = this.transactionEnrollModel.holder_contact;
  public agentContactModel = this.transactionEnrollModel.agent_contact;
  public requesterModel = [];
  public countryList = [];
  public provinceList = [];
  public stateList = [];
  // public transFeeModel = [];
  public transFeeModel = MasterFileBaseService.getEmptyMasterFileFeeModel();
  public fileServices: FileConversionService;

  public notApplicable: boolean = false;

  /* public customSettings: TinyMce.Settings | any;*/
  constructor(
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dataLoader: MasterFileDataLoaderService,
    private http: HttpClient,
    private translate: TranslateService,
    private _versionService: VersionService
  ) {
    dataLoader = new MasterFileDataLoaderService(this.http);
    this.userList = [];
    this.countryList = [];
    this.provinceList = [];
    this.stateList = [];
    this.showErrors = false;
    this.isSolicitedFlag = false;
    this.fileServices = new FileConversionService();
    this.appVersion = this._versionService.getApplicationVersion();
    this.xslName = GlobalsService.MASTER_FILE_OUTPUT_PREFIX + '_' + this.appVersion + '.xsl';
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
    // this.userList = await (this.dataLoader.getRequesters(this.translate.currentLang));
    // console.log();
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
      this._masterFileDetailErrors.concat(
        this._requesterErrors.concat(
          this._addressErrors.concat(
            this._contactErrors.concat(
              this._agentAddressErrors.concat(
                this._agentContactErrors.concat(this._transFeeErrors)
              )
            )
          )
        )
      )
    );
    // .concat(this._theraErrors);
    this.cdr.detectChanges(); // doing our own change detection
  }

  processRegulatoryInfoErrors(errorList) {
    this._regulatoryInfoErrors = errorList;
    this.processErrors();
  }

  processDetailErrors(errorList) {
    this._masterFileDetailErrors = errorList;
    this.processErrors();
  }

  processRequesterErrors(errorList) {
    this._requesterErrors = errorList;
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

  processIsSolicitedFlag(isSolicited) {
    if (!isSolicited) {
      this.requesterModel = [];
    }
    this.isSolicitedFlag = isSolicited;
  }

  public hideErrorSummary() {
    return this.showErrors && this.errorList && this.errorList.length > 0;
  }

  public saveXmlFile() {
    if (
      //todo not used, remove??
      !this.requesterListChild ||
      (this.requesterListChild &&
        this.requesterListChild.requesterListForm.pristine &&
        this.requesterListChild.requesterListForm.valid)
    ) {
      // this._updatedAutoFields();
      this.showErrors = true;
      this._saveXML();
    } else {
      if (this.lang === GlobalsService.ENGLISH) {
        alert('Please save the unsaved input data before generating XML file.');
      } else {
        alert(
          "Veuillez sauvegarder les données d'entrée non enregistrées avant de générer le fichier XML."
        );
      }
    }
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
    this.holderAddressModel = fileData.data.TRANSACTION_ENROL.holder_name_address;
    this.holderContactModel = fileData.data.TRANSACTION_ENROL.holder_contact;
    this.agentAddressModel = fileData.data.TRANSACTION_ENROL.agent_name_address;
    this.agentContactModel = fileData.data.TRANSACTION_ENROL.agent_contact;
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

  // private _updatedAutoFields() {
  //   this._updateSavedDate();
  //   // this.masterFileModel.enrol_version = this.masterFileModel.enrol_version; // todo do we need the enrol_version field?
  // }

  private _deleteText(dataModel) {
    const dataCopy = JSON.parse(JSON.stringify(dataModel));
    dataCopy.forEach((item) => {
      delete item.requester_text;
    });
    return dataCopy;
  }

  private _insertTextfield() {
    this.requesterModel.forEach((item) => {
      item.requester_text =
        this.lang === GlobalsService.ENGLISH
          ? item.requester._label_en
          : item.requester._label_fr;
      item.id = Number(item.id);
    });
  }

  public preload() {
    // console.log("Calling preload")
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

    this.transactionEnrollModel.holder_name_address = this.holderAddressModel;
    this.transactionEnrollModel.holder_contact = this.holderContactModel;
    this.transactionEnrollModel.agent_name_address = this.agentAddressModel;
    this.transactionEnrollModel.agent_contact = this.agentContactModel;
    this.transactionEnrollModel.contact_info_confirm =
      this.masterFileForm.controls['contactInfoConfirm'].value;
    this.transactionEnrollModel.fee_details = this.transFeeModel;
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
      GlobalsService.MASTER_FILE_OUTPUT_PREFIX +
      this.transactionEnrollModel.ectd.dossier_id +
      '-' +
      this.transactionEnrollModel.last_saved_date;
    return fileName;
  }

  public agentInfoOnChange() {
    this.notApplicable = this.masterFileForm.controls['notApplicable'].value;
  }
}
