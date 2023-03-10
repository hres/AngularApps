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
  // public masterFileModel =
  //   MasterFileBaseService.getEmptyMasterFileDetailsModel();
  public transactionEnrollModel = MasterFileBaseService.getEmptyTransactionEnrol();
  public ectdModel = this.transactionEnrollModel.ectd;
  public mfAddressModel = MasterFileBaseService.getEmptyAddressDetailsModel();
  public agentAddressModel =
    MasterFileBaseService.getEmptyAddressDetailsModel();
  public mfContactModel = MasterFileBaseService.getEmptyContactModel();
  public agentContactModel = MasterFileBaseService.getEmptyContactModel();
  public requesterModel = [];
  public countryList = [];
  public provinceList = [];
  public stateList = [];
  // public transFeeModel = [];
  public transFeeModel = MasterFileBaseService.getEmptyMasterFileFeeModel();
  public fileServices: FileConversionService;
  public xslName =
    GlobalsService.STYLESHEETS_1_0_PREFIX +
    GlobalsService.MASTER_FILE_OUTPUT_PREFIX +
    '_1_0.xsl'; // todo version mumber

  /* public customSettings: TinyMce.Settings | any;*/
  constructor(
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dataLoader: MasterFileDataLoaderService,
    private http: HttpClient,
    private translate: TranslateService
  ) {
    dataLoader = new MasterFileDataLoaderService(this.http);
    this.userList = [];
    this.countryList = [];
    this.provinceList = [];
    this.stateList = [];
    this.showErrors = false;
    this.isSolicitedFlag = false;
    this.fileServices = new FileConversionService();
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
    // this._updatedSavedDate();
    // const result = {
    //   TRANSACTION_ENROL: {
    //     application_info: this.masterFileModel,
    //     requester_of_solicited_information: {
    //       requester: this._deleteText(this.requesterModel),
    //     },
    //     mf_holder_address: this.mfAddressModel,
    //     mf_holder_contact: this.mfContactModel,
    //     agent_address: this.agentAddressModel,
    //     agent_contact: this.agentContactModel,
    //     transFees: this.transFeeModel,
    //   },
    // };
    const result = this._prepareForSaving(false);
    const fileName = this._generateFileName();
    this.fileServices.saveJsonToFile(result, fileName, null);
  }

  public processFile(fileData: ConvertResults) {
    console.log('processing file.....');
    console.log(fileData);
    this.transactionEnrollModel = fileData.data.TRANSACTION_ENROL;
    this.ectdModel = this.transactionEnrollModel.ectd;
    // const req =
    //   fileData.data.TRANSACTION_ENROL.requester_of_solicited_information
    //     .requester;
    // if (req) {
    //   this.requesterModel = req instanceof Array ? req : [req];
    //   this._insertTextfield();
    // }
    // this.transFeeModel = fileData.data.TRANSACTION_ENROL.transFees;
  }

  // isSolicited() {
  //   return (
  //     this.isSolicitedFlag ||
  //     this.masterFileModel.is_solicited_info === GlobalsService.YES
  //   );
  // }

  private _updatedSavedDate() {
    const today = new Date();
    const pipe = new DatePipe('en-US');
    this.transactionEnrollModel.date_saved = pipe.transform(
      today,
      'yyyy-MM-dd-hhmm'
    );
  }

  // private _updatedAutoFields() {
  //   this._updatedSavedDate();
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
      // const result = {
      //   TRANSACTION_ENROL: {
      //     application_info: this.masterFileModel,
      //     requester_of_solicited_information: {
      //       requester: this._deleteText(this.requesterModel),
      //     },
      //     mf_holder_address: this.mfAddressModel,
      //     mf_holder_contact: this.mfContactModel,
      //     agent_address: this.agentAddressModel,
      //     agent_contact: this.agentContactModel,
      //     transFees: this.transFeeModel,
      //   },
      // };
      // const fileName =
      //   'rt-' +
      //   this.masterFileModel.dossier_id +
      //   '-' +
      //   this.masterFileModel.last_saved_date;
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

    this._updatedSavedDate();

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
      this.transactionEnrollModel.date_saved;
    return fileName;
  }
}