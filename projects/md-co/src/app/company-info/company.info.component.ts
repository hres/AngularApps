import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import {CompanyInfoService} from './company.info.service';
import { ControlMessagesComponent, FINAL, UtilsService, LoggerService, YES, ICode, ConverterService, CheckboxOption, ICodeDefinition, IIdTextLabel } from '@hpfb/sdk/ui';
import { CompanyDataLoaderService } from '../form-base/company-data-loader.service';
import { EnrollmentStatus} from '../app.constants';

@Component({
  selector: 'com-gen-info',
  templateUrl: 'company.info.component.html',
  encapsulation: ViewEncapsulation.None
})

export class CompanyInfoComponent implements OnInit, OnChanges, AfterViewInit {

  public generalInfoFormLocalModel: FormGroup;
  @Input('group') public generalInfoFormRecord: FormGroup;
  @Input() genInfoModel;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() lang: string;
  @Input() isInternal: boolean;
  @Input() helpTextSequences;
  @Input() enrollmentStatusesList;

  @Output() errorList = new EventEmitter(true);
  @Output() updatedGenInfo = new EventEmitter(true);

  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public isAmend: boolean = false;

  public showFieldErrors: boolean;

  // public disableAmendButton: boolean = true;
  public showAmendButton: boolean = false;
  public yesNoList: ICode[] = [];
  private amendReasonCodeList: ICodeDefinition[] = [];
  public amendReasonOptionList: CheckboxOption[] = [];

  constructor(private cdr: ChangeDetectorRef, private _companyInfoService: CompanyInfoService, private _formDataLoader: CompanyDataLoaderService,
    private _utilsService: UtilsService, private _converterService: ConverterService, private _loggerService: LoggerService) {
    this.showFieldErrors = false;
  }

  ngOnInit() {
    if (!this.generalInfoFormLocalModel) {
      this.generalInfoFormLocalModel = this._companyInfoService.getReactiveModel();
    }

    this.detailsChanged = 0;
    // this._loggerService.log('company.info', 'onInit', 'this.isInternal: ' + this.isInternal);

    
    this._formDataLoader.getKeywordList().subscribe((keywords) => {
      try {
        // this._loggerService.log('company.info', 'onInit', keywords);
        this.yesNoList = keywords.find(x => (x.name === 'yesno')).data;
        // this._loggerService.log('company.info', '' + JSON.stringify(this.yesNoList));
      } catch (e) {
        console.error(e);
      }
    });

    this._formDataLoader.getAmendReasonList().subscribe((data) => {
      // this._loggerService.log("company.info", "onInit", JSON.stringify(data));
      this.amendReasonCodeList = data;
      this.amendReasonOptionList = this.amendReasonCodeList.map((item) => {
        return this._converterService.convertCodeToCheckboxOption(item, this.lang);
      });
      this.amendReasonOptionList.forEach(() => this.amendReasonChkFormArray.push(new FormControl(false)));

    });

    
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      this._updateErrorList(errorObjs);
    });
    this.msgList.notifyOnChanges();
  }

  private _updateErrorList(errorObjs) {
    let temp = [];
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
    }
    this.errorList.emit(temp);
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);

    // Ignore first trigger of ngOnChanges
    if (!isFirstChange) {
          // since we can't detect changes on objects, using a separate flag
      if (changes['detailsChanged']) { // used as a change indiitemor for the model
        // console.log("the details cbange");
        if (this.generalInfoFormRecord) {
          this.setToLocalModel();

        } else {
          this.generalInfoFormLocalModel = this._companyInfoService.getReactiveModel();
          this.generalInfoFormLocalModel.markAsPristine();
        }
        if (this.generalInfoFormLocalModel ) {
          this._saveData();
        }
      }
      if (changes['showErrors']) {

        this.showFieldErrors = changes['showErrors'].currentValue;
        let temp = [];
        if (this.msgList) {
          this.msgList.forEach(item => {
            temp.push(item);
            // console.log(item);
          });
        }
        this.errorList.emit(temp);
      }
      if (changes['genInfoModel']) {
        const dataModel = changes['genInfoModel'].currentValue;
        this._companyInfoService.mapDataModelToFormModel(dataModel, this.generalInfoFormLocalModel, this.amendReasonOptionList, this.enrollmentStatusesList, this.lang);
        this.setDisableAmendButtonFlag(dataModel.status._id, this.isInternal);
        this.isAmend = (dataModel.status._id === EnrollmentStatus.Amend);
      }
      if(changes['enrollmentStatusesList']) {
        this._companyInfoService.setEnrolmentStatus((<FormGroup>this.generalInfoFormLocalModel), this.generalInfoFormLocalModel.controls['formStatus'].value, this.enrollmentStatusesList, this.lang, false);
      }
    }
  }

  private setDisableAmendButtonFlag(enrolStatusId: string, isInternal: boolean) : void{
    // this.disableAmendButton = (formStatus !== EnrollmentStatus.Final || isInternal);
    this.showAmendButton = (enrolStatusId === EnrollmentStatus.Final && !isInternal);
  }
  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.generalInfoFormLocalModel = this.generalInfoFormRecord;
    if (!this.generalInfoFormLocalModel.pristine) {
      this.generalInfoFormLocalModel.markAsPristine();
    }
  }

  public setAmendState () {
    this.isAmend = true;
    this.genInfoModel.status = this._converterService.findAndConverCodeToIdTextLabel(this.enrollmentStatusesList, EnrollmentStatus.Amend, this.lang);
    this.genInfoModel.rationale = '';
    this.genInfoModel.are_licenses_transfered = '';
    this._companyInfoService.mapDataModelToFormModel(this.genInfoModel, (<FormGroup>this.generalInfoFormLocalModel), this.amendReasonOptionList, this.enrollmentStatusesList, this.lang);
  }

  onblur() {
    // this._loggerService.log('input is typed');
    this._saveData();
  }

  private _saveData(): void{
    this._companyInfoService.mapFormModelToDataModel((<FormGroup>this.generalInfoFormLocalModel), this.genInfoModel, this.selectedAmendReasonCodes, 
      this.amendReasonCodeList, this.lang, this.enrollmentStatusesList);
  }
  
  amendReasonOnChange(){
    this._saveDataAndEmitGenInfoChangeFlag();
  }

  areLicensesBeingTransferedOnChange(){
    this._saveDataAndEmitGenInfoChangeFlag();
  }

  private _saveDataAndEmitGenInfoChangeFlag() {
    this._saveData();
    this.updatedGenInfo.emit(true);
  }

  get amendReasonChkFormArray() {
    return this._companyInfoService.getAmendReasonCheckboxFormArray(this.generalInfoFormLocalModel);
  }

  // shortcut to get selectedAmendReasonCodes
  get selectedAmendReasonCodes(): string[] {
    return this._companyInfoService.getSelectedAmendReasonCodes(this.amendReasonOptionList, this.amendReasonChkFormArray);
  }

}

