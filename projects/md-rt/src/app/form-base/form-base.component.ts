import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, Input, QueryList, HostListener, ViewEncapsulation, AfterViewInit, SimpleChanges, Type } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { XSLT_PREFIX, ROOT_TAG } from '../app.constants';
import {  ICode, ConvertResults, FileConversionService, CheckSumService, UtilsService, CHECK_SUM_CONST, ConverterService, YES, VersionService, FileIoModule, ErrorModule, PipesModule, EntityBaseService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { TransactionBaseService } from './transaction-base.service';
import { FormDataLoaderService } from '../container/form-data-loader.service';
import { ApplicationInfo, DeviceTransactionEnrol, Enrollment, Requester, TransFees } from '../models/Enrollment';

@Component({
  selector: 'app-form-base',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, FileIoModule, ErrorModule, PipesModule, AppFormModule],
  providers: [FileConversionService, TransactionBaseService, FormDataLoaderService, UtilsService, VersionService, CheckSumService, ConverterService, EntityBaseService],
  templateUrl: './form-base.component.html',
  styleUrls: ['./form-base.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FormBaseComponent implements OnInit, AfterViewInit {
  public errors;
  @Input() lang;
  @Input() helpTextSequences;
  // @ViewChild(RequesterListComponent, {static: false}) requesterListChild: RequesterListComponent;

  private _transactionDetailErrors = [];
  private _requesterErrors = [];
  private _transFeeErrors = [];
  // public transactionForm: FormGroup;  // todo: do we need it? could remove?
  public errorList = [];
  public rootTagText = ROOT_TAG; 
  private xslName: string;
  
  public userList = [];
  public showErrors: boolean;
  public isSolicitedFlag: boolean;
  public title = '';
  public headingLevel = 'h2';

  public enrollModel : Enrollment;
  public transactionInfoModel : ApplicationInfo;; 

  public requesterModel: Requester[];
  public transFeeModel: TransFees;
  // public transFeeModel = TransactionBaseService.getEmptyTransactionFeeModel();
  public fileServices: FileConversionService;
  public helpIndex: { [key: string]: number };

  /* public customSettings: TinyMce.Settings | any;*/
  constructor(
    private cdr: ChangeDetectorRef,
    private _baseService: TransactionBaseService,
    private _fileService: FileConversionService, private _utilsService: UtilsService, private _globalService: GlobalService,
    private _versionService: VersionService,
    private _checkSumService: CheckSumService,
    private _converterService: ConverterService
  ) {
    this.userList = [];
    this.showErrors = false;
    this.isSolicitedFlag = false;
    this.fileServices = new FileConversionService();
    this.xslName = XSLT_PREFIX.toUpperCase() + this._versionService.getApplicationMajorVersion(this._globalService.$appVersion) + '.xsl';
  }

  ngOnInit() {
    // if (!this.transactionForm) {
    //   this.transactionForm = this._baseService.getReactiveModel();
    // }
    // this.userList = await (this.dataLoader.getRequesters(this.translate.currentLang));


    try {
      if (!this._globalService.getEnrollment()) {
        // this._loggerService.log("form.base", "onInit", "enrollement doesn't exist, create a new one");
        this.enrollModel = this._baseService.getEmptyEnrol();
        this._globalService.setEnrollment(this.enrollModel);
      } else {
        this.enrollModel = this._globalService.getEnrollment();
        // console.log("onInit", "get enrollement from globalservice", JSON.stringify(this.enrollModel, null, 2));
      }

      const transactionEnroll: DeviceTransactionEnrol = this.enrollModel[this.rootTagText];
      this._init(transactionEnroll);

      this.helpIndex = this._globalService.getHelpIndex();

    } catch (e) {
      console.error(e);
    }      
  }

  ngAfterViewInit(): void {
    document.location.href = '#def-top';
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ Processing errors in ApplicationInfo base compo
    this.errorList = [];
    // concat the two array
    this.errorList = this._transactionDetailErrors.concat(this._requesterErrors.concat(this._transFeeErrors));
    // .concat(this._theraErrors);
    // this.cdr.detectChanges(); // doing our own change detection
  }

  processDetailErrors(errorList) {
    this._transactionDetailErrors = errorList;
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

  processIsSolicitedFlag(isSolicited) {
    if (!isSolicited) {
      this.requesterModel = [];
    }
    this.isSolicitedFlag = isSolicited;
  }

  public hideErrorSummary() {
    return (this.showErrors && this.errorList && this.errorList.length > 0);
  }

  public saveXmlFile() {
    // if (!this.requesterListChild || this.requesterListChild && this.requesterListChild.requesterListForm.pristine && this.requesterListChild.requesterListForm.valid ) {
    //   this._updatedAutoFields();
    //   this.showErrors = true;
    //   this._saveXML();
    // } else {
    //   if (this.lang === GlobalsService.ENGLISH) {
    //     alert('Please save the unsaved input data before generating XML file.');
    //   } else {
    //     alert('Veuillez sauvegarder les données d\'entrée non enregistrées avant de générer le fichier XML.');
    //   }

    // }
  }

  public saveWorkingCopyFile() {
    const result = this._prepareForSaving(false);
    const fileName = this._buildfileName();
    this._fileService.saveJsonToFile(result, fileName, null);
  }

  private _prepareForSaving(xmlFile: boolean): Enrollment {
    const output: Enrollment = {
       'DEVICE_TRANSACTION_ENROL': {
         'software_version': this._globalService.$appVersion,
         'application_info': this.transactionInfoModel,
         'requester_of_solicited_information': {
            'requester': null, //this._deleteText(this.requesterModel)
          },
          'transFees': this.transFeeModel
        }
    };

    // update the last_saved_date
    output.DEVICE_TRANSACTION_ENROL.application_info.last_saved_date = this._utilsService.getFormattedDate('yyyy-MM-dd-hhmm')

    return output;
  }

  private _buildfileName() {
    const date_generated = this._utilsService.getFormattedDate('yyyy-MM-dd-hhmm');
    return 'rt-' + this.transactionInfoModel.dossier_id + '-' + date_generated;

  }

  public processFile(fileData: ConvertResults) {
    const enrollment : Enrollment = fileData.data;
     console.log('processing file.....');
     const transactionEnroll: DeviceTransactionEnrol = enrollment[this.rootTagText];
     this._init(transactionEnroll);
  }

  isSolicited() {
    // return (this.isSolicitedFlag || this.transactionModel.is_solicited_info === GlobalsService.YES);
  }

  // private _updatedSavedDate() {
  //   const today = new Date();
  //   // const pipe = new DatePipe('en-US');
  //   // this.transactionModel.last_saved_date = pipe.transform(today, 'yyyy-MM-dd-hhmm');
  // }

  // private _updatedAutoFields() {
  //   this._updatedSavedDate();
  //   // const version: Array<any> = this.transactionModel.enrol_version.split('.');
  //   // version[0] = (Number(version[0]) + 1).toString();
  //   // this.transactionModel.enrol_version = this.transactionModel.enrol_version; //version[0] + '.' + version[1];
  // }

  private _deleteText(dataModel) {
    const dataCopy = JSON.parse(JSON.stringify(dataModel));
    dataCopy.forEach (item => {
      delete item.requester_text;
    });
    return dataCopy;
  }

  private _insertTextfield() {
    // this.requesterModel.forEach (item => {
    //   item.requester_text = this.lang === GlobalsService.ENGLISH ? item.requester._label_en : item.requester._label_fr;
    //   item.id = Number(item.id);
    // });
  }

  public preload() {
    // console.log("Calling preload")
  }

  public updateChild() {
    // console.log("Calling updateChild")
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
      $event.returnValue = true;
  }

  _saveXML() {
    // if ( this.errorList && this.errorList.length < 1 ) {
    //   const result = {
    //     'DEVICE_TRANSACTION_ENROL': {
    //       'application_info': this.transactionModel,
    //       'requester_of_solicited_information': {
    //         'requester': this._deleteText(this.requesterModel)
    //       },
    //       'transFees': this.transFeeModel
    //     }
    //   };
    //   const fileName = 'rt-' + this.transactionModel.dossier_id + '-' + this.transactionModel.last_saved_date;
    //   console.log('save ...');
    //   this.fileServices.saveXmlToFile(result, fileName, true, this.xslName);
    //   return ;
    // }
    document.location.href = '#topErrorSummaryId';
  }

  private _init(transactionEnroll: DeviceTransactionEnrol){
    this.transactionInfoModel = transactionEnroll.application_info;  

    // const req = fileData.data.DEVICE_TRANSACTION_ENROL.requester_of_solicited_information.requester;
    // if (req) {
    //   this.requesterModel = (req instanceof Array) ? req : [req];
    //   this._insertTextfield();
    // }
    // this.transFeeModel = fileData.data.DEVICE_TRANSACTION_ENROL.transFees;
  }
}
