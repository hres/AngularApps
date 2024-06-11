import {Component, OnInit, Input, ViewEncapsulation, AfterViewInit, ChangeDetectorRef, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileConversionService, CheckSumService, UtilsService, ConverterService, VersionService, FileIoModule, ErrorModule, PipesModule, EntityBaseService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppFormModule } from '../app.form.module';
import { FilereaderInstructionComponent } from "../filereader-instruction/filereader-instruction.component";
import { ROOT_TAG } from '../app.constants';
import { RegulatoryInformationComponent } from "../regulatory-information/regulatory-information.component";
import { MasterFileBaseService } from './master-file-base.service';
import { Ectd, Transaction, TransactionEnrol} from '../models/transaction';

@Component({
    selector: 'app-form-base',
    standalone: true,
    templateUrl: './form-base.component.html',
    styleUrls: ['./form-base.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [FileConversionService, UtilsService, VersionService, CheckSumService, ConverterService, EntityBaseService, MasterFileBaseService],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, FileIoModule, ErrorModule, PipesModule, AppFormModule, FilereaderInstructionComponent, RegulatoryInformationComponent]
})
export class FormBaseComponent implements OnInit, AfterViewInit {
processFile($event: any) {
throw new Error('Method not implemented.');
}
  public errors;
  @Input() lang;
  @Input() helpTextSequences;

  public helpIndex: { [key: string]: number }; // todo CompanyBaseService.getHelpTextIndex();
  public masterFileForm: FormGroup;
  public rootTagText = ROOT_TAG; 
  public showErrors: boolean;
  public errorList = [];
  public headingLevel = 'h2';

  private _regulatoryInfoErrors = [];

  private appVersion: string;
  private xslName: string;

  public enrollModel : Transaction;
  public transactionEnrollModel: TransactionEnrol;
  public ectdModel: Ectd;

  @ViewChild(RegulatoryInformationComponent) regulatoryInfoComponent: RegulatoryInformationComponent;
 
  constructor(private _baseService: MasterFileBaseService, private _globalService: GlobalService, private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {

  }
  
  ngAfterViewInit(): void {
    document.location.href = '#def-top';
  }
  ngOnInit(): void {
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

      this.helpIndex = this._globalService.helpIndex;
      this.masterFileForm = this.fb.group({}); 

    } catch (e) {
      console.error(e);
    }
  }

  public hideErrorSummary() {
    return this.showErrors && this.errorList && this.errorList.length > 0;
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ processErrors');
    this.errorList = [];
    // concat the error arrays
    this.errorList = this.errorList.concat(this._regulatoryInfoErrors);

    this.cdr.detectChanges(); // doing our own change detection
  }

  processRegulatoryInfoErrors(errorList) {
    this._regulatoryInfoErrors = errorList;
    this.processErrors();
  }

  public setShowContactFeesFlag(flag) {   //ling todo in signal
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
  
  public saveXmlFile() {
	  this.showErrors = true;
    this.processErrors();

    if (this.errorList && this.errorList.length > 0) {
      document.location.href = '#topErrorSummary';
    } else {
      // const result: Enrollment = this._prepareForSaving(true);
      // const fileName: string = this._buildfileName(result);
      // const xslName: string = XSLT_PREFIX.toUpperCase() + this._versionService.getApplicationMajorVersionWithUnderscore(this._globalService.$appVersion) + '.xsl';
      // this._fileService.saveXmlToFile(result, fileName, true, xslName);
    }
  }

  public saveWorkingCopyFile() {
    // const result: Enrollment = this._prepareForSaving(false);
    // const fileName: string = this._buildfileName(result);
    // this._fileService.saveJsonToFile(result, fileName, null);
  }


  // signal stuff
  selectedTxDescriptionValue: string = '';

  handler1(e:any):void {
    console.log("descriptionTypeChanged==>", e, "todo need to toggle the contact/fee rendering here");

  }

}