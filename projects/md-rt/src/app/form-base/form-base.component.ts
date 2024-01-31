import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, Input, QueryList, HostListener, ViewEncapsulation, AfterViewInit, SimpleChanges, Type } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { XSLT_PREFIX, ROOT_TAG } from '../app.constants';
import {  ICode, ConvertResults, FileConversionService, CheckSumService, UtilsService, CHECK_SUM_CONST, ConverterService, YES, VersionService, FileIoModule, ErrorModule, PipesModule, EntityBaseService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { TransactionBaseService } from './transaction-base.service';
import { FormDataLoaderService } from '../container/form-data-loader.service';
import { ApplicationInfo, DeviceTransactionEnrol, Enrollment, TransFees } from '../models/Enrollment';

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

  private _transactionDetailErrors = [];
  private _transFeeErrors = [];
  public transactionForm: FormGroup;
  public showErrors: boolean;
  public errorList = [];
  public rootTagText = ROOT_TAG; 
  private xslName: string;
  
  public title = '';
  public headingLevel = 'h2';

  public enrollModel : Enrollment;
  public transactionInfoModel : ApplicationInfo;; 
  public transFeeModel: TransFees;
  // public transFeeModel = TransactionBaseService.getEmptyTransactionFeeModel();
  public fileServices: FileConversionService;
  public helpIndex: { [key: string]: number };

  /* public customSettings: TinyMce.Settings | any;*/
  constructor(
    private cdr: ChangeDetectorRef, private fb: FormBuilder,
    private _baseService: TransactionBaseService,
    private _fileService: FileConversionService, private _utilsService: UtilsService, private _globalService: GlobalService,
    private _versionService: VersionService,
    private _checkSumService: CheckSumService,
    private _converterService: ConverterService
  ) {

    this.showErrors = false;    
    this.fileServices = new FileConversionService();
    this.xslName = XSLT_PREFIX.toUpperCase() + this._versionService.getApplicationMajorVersion(this._globalService.$appVersion) + '.xsl';
  }

  ngOnInit() {
    // this means it's associated with a reactive form, and Angular automatically prevents the default form submission behavior
    this.transactionForm = this.fb.group({}); 

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
    // concat the error arrays
    this.errorList = this._transactionDetailErrors.concat(this._transFeeErrors);

    // this.cdr.detectChanges(); // doing our own change detection
  }

  processDetailErrors(errorList) {
    this._transactionDetailErrors = errorList;
    this.processErrors();
  }

  processTransFeeErrors(errorList) {
    this._transFeeErrors = errorList;
    this.processErrors();
  }

  public hideErrorSummary() {
    return (this.showErrors && this.errorList && this.errorList.length > 0);
  }

  public saveXmlFile() {
    this.showErrors = false;
    if (this.errorList && this.errorList.length > 0) {
      this.showErrors = true;
      document.location.href = '#topErrorSummary';
    } else {
      const result: Enrollment = this._prepareForSaving(true);
      const fileName: string = this._buildfileName(result);
      this._fileService.saveXmlToFile(result, fileName, true, this.xslName);
    }
  }

  public saveWorkingCopyFile() {
    const result: Enrollment = this._prepareForSaving(false);
    const fileName: string = this._buildfileName(result);
    this._fileService.saveJsonToFile(result, fileName, null);
  }

  private _prepareForSaving(xmlFile: boolean): Enrollment {
    const output: Enrollment = {
       'DEVICE_TRANSACTION_ENROL': {
         'template_version': this._globalService.$appVersion,
         'application_info': this.transactionInfoModel,
         'transFees': this.transFeeModel
        }
    };

    // update the last_saved_date
    output.DEVICE_TRANSACTION_ENROL.application_info.last_saved_date = this._utilsService.getFormattedDate('yyyy-MM-dd-hhmm')

    return output;
  }

  private _buildfileName(output: Enrollment): string {
    return 'rt-' + output.DEVICE_TRANSACTION_ENROL.application_info.dossier_id + '-' + output.DEVICE_TRANSACTION_ENROL.application_info.last_saved_date;

  }

  public processFile(fileData: ConvertResults) {
    const enrollment : Enrollment = fileData.data;
     console.log('processing file.....');
     const transactionEnroll: DeviceTransactionEnrol = enrollment[this.rootTagText];
     this._init(transactionEnroll);
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

  private _init(transactionEnroll: DeviceTransactionEnrol){
    this.transactionInfoModel = transactionEnroll.application_info;  
    this.transFeeModel = transactionEnroll.transFees;
  }
}
