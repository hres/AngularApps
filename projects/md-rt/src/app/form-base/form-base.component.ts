import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, Input, QueryList, HostListener, ViewEncapsulation, AfterViewInit, SimpleChanges, Type } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { XSLT_PREFIX, ROOT_TAG } from '../app.constants';
import {  ConvertResults, FileConversionService, CheckSumService, UtilsService, CHECK_SUM_CONST, ConverterService, YES, VersionService, FileIoModule, ErrorModule, PipesModule, EntityBaseService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { TransactionBaseService } from './transaction-base.service';
import { FormDataLoaderService } from '../container/form-data-loader.service';
import { ApplicationInfo, DeviceTransactionEnrol, Enrollment, TransFees } from '../models/Enrollment';
import { TransactionDetailsComponent } from '../transaction-details/transaction.details.component';
import { TransactionFeeComponent } from '../transaction-fee/transaction.fee.component';

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
  lang: string;
  helpIndex: { [key: string]: number }; 

  private _transactionDetailErrors = [];
  private _transFeeErrors = [];
  public transactionForm: FormGroup;
  public showErrors: boolean;
  public errorList = [];
  public rootTagText = ROOT_TAG; 
    
  public headingLevel = 'h2';

  public enrollModel : Enrollment;
  public transactionInfoModel : ApplicationInfo;; 
  public transFeeModel: TransFees;
  public fileServices: FileConversionService;

  @ViewChild(TransactionDetailsComponent) detailsComponent: TransactionDetailsComponent;
  @ViewChild(TransactionFeeComponent) feeComponent: TransactionFeeComponent;

  constructor(
    private cdr: ChangeDetectorRef, private fb: FormBuilder,
    private _baseService: TransactionBaseService,
    private _fileService: FileConversionService, private _globalService: GlobalService,
    private _versionService: VersionService,
    private _checkSumService: CheckSumService
  ) {

    this.showErrors = false;    
    this.fileServices = new FileConversionService();
  }

  ngOnInit() {
    this.lang = this._globalService.getCurrLanguage();
    this.helpIndex = this._globalService.getHelpIndex();
    
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
    // console.log('@@@@@@@@@@@@ processErrors');
    this.errorList = [];
    // concat the error arrays
    this.errorList = this.errorList.concat(this._transactionDetailErrors.concat(this._transFeeErrors));

    this.cdr.detectChanges(); // doing our own change detection
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
	  this.showErrors = true;
    this.processErrors();

    if (this.errorList && this.errorList.length > 0) {
      document.location.href = '#topErrorSummary';
    } else {
      const result: Enrollment = this._prepareForSaving(true);
      const fileName: string = this._buildfileName(result);
      const xslName: string = XSLT_PREFIX.toUpperCase() + this._versionService.getApplicationMajorVersionWithUnderscore(this._globalService.$appVersion) + '.xsl';
      this._fileService.saveXmlToFile(result, fileName, true, xslName);
    }
  }

  public saveWorkingCopyFile() {
    const result: Enrollment = this._prepareForSaving(false);
    const fileName: string = this._buildfileName(result);
    this._fileService.saveJsonToFile(result, fileName, null);
  }

  private _prepareForSaving(xmlFile: boolean): Enrollment {
    const detailsFormGroupValue = this.detailsComponent.transDetailsForm.value;
    const feeFormGroupValue = this.feeComponent.transFeeForm.value;

    const output: Enrollment = this._baseService.mapFormToOutput(detailsFormGroupValue, feeFormGroupValue);

    if (xmlFile) {
      // add and calculate check_sum if it is xml
      output.DEVICE_TRANSACTION_ENROL[CHECK_SUM_CONST] = "";   // this is needed for generating the checksum value
      output.DEVICE_TRANSACTION_ENROL[CHECK_SUM_CONST] = this._checkSumService.createHash(output);
    }

    return output;
  }

  private _buildfileName(output: Enrollment): string {
    return 'rt-' + output.DEVICE_TRANSACTION_ENROL.application_info.dossier_id + '-' + output.DEVICE_TRANSACTION_ENROL.application_info.last_saved_date;
  }

  public processFile(fileData: ConvertResults) {
    const enrollment : Enrollment = fileData.data;
    //  console.log('processing file.....');
     const transactionEnroll: DeviceTransactionEnrol = enrollment[this.rootTagText];
     this._init(transactionEnroll);
  }

  // public preload() {
  //   // console.log("Calling preload")
  // }

  // public updateChild() {
  //   // console.log("Calling updateChild")
  // }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
      $event.returnValue = true;
  }

  private _init(transactionEnroll: DeviceTransactionEnrol){
    this.transactionInfoModel = transactionEnroll.application_info;  
    this.transFeeModel = transactionEnroll.transFees;
  }
}
