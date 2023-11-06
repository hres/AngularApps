import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {CompanyInfoService} from './company.info.service';
import { ControlMessagesComponent, FINAL, UtilsService, LoggerService, YES, ICode, ConverterService, CheckboxOption, ICodeDefinition } from '@hpfb/sdk/ui';
import { CompanyDataLoaderService } from '../form-base/company-data-loader.service';
import { AMEND, AMEND_REASON_ADDR_CHANGE, AMEND_REASON_FACILITY_CHANGE, AMEND_REASON_NAME_CHANGE, AMEND_REASON_OTHER } from '../app.constants';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

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

  @Output() errorList = new EventEmitter(true);
  @Output() showAdminChanges = new EventEmitter(true);

  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public isAmend: boolean = false;
  public isOtherSelected: boolean = false;
  public showFieldErrors: boolean;
  public setAsComplete: boolean = false;  //ling todo remove???
  public disableAmendButton: boolean = true;
  public yesNoList: ICode[] = [];
  private amendReasonCodeList: ICodeDefinition[] = [];
  public amendReasonOptionList: CheckboxOption[] = [];

  private amendReasonCodesToShowAdminChanges:string[] = new Array(AMEND_REASON_NAME_CHANGE, AMEND_REASON_ADDR_CHANGE, AMEND_REASON_FACILITY_CHANGE) ;


  constructor(private cdr: ChangeDetectorRef, private _companyInfoService: CompanyInfoService, private _formDataLoader: CompanyDataLoaderService,
    private router: Router, private _utilsService: UtilsService, private _converterService: ConverterService, private _loggerService: LoggerService) {
    this.showFieldErrors = false;
  }

  ngOnInit() {
    if (!this.generalInfoFormLocalModel) {
      this.generalInfoFormLocalModel = this._companyInfoService.getReactiveModel();
    }

    this.detailsChanged = 0;
    this._loggerService.log('company.info', 'onInit', 'this.isInternal: ' + this.isInternal);

    
    this._formDataLoader.getKeywordList().subscribe((keywords) => {
      try {
        // this._loggerService.log('company.info', 'onInit', keywords);
        this.yesNoList = keywords.find(x => (x.name === 'yesno')).data;
        // this._loggerService.log('company.info', '' + JSON.stringify(this.yesNoList));
      } catch (e) {
        console.error(e);
        this.router.navigate(['/error']);
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
      if (changes['isInternal']) {
        if (!changes['isInternal'].currentValue) {
          this._loggerService.log('company.info', 'onInit', 'changes[\'isInternal\'] called', changes['isInternal'].currentValue); // ling todo when is this called??
          this.setAsComplete = (this.genInfoModel.status === FINAL && !changes['isInternal'].currentValue); // ling todo remove??
          this.disableAmendButton = this.setDisableAmendButtonFlag(this.genInfoModel.status, !changes['isInternal'].currentValue);
        } // && this.isInternal;
      }
      if (changes['genInfoModel']) {
        const dataModel = changes['genInfoModel'].currentValue;
        this._companyInfoService.mapDataModelToFormModel(dataModel, this.generalInfoFormLocalModel, this.amendReasonOptionList);
        this.setAsComplete = (dataModel.status === FINAL && !this.isInternal); // ling todo remove??
        this.disableAmendButton = this.setDisableAmendButtonFlag(dataModel.status, this.isInternal);
        this.isAmend = (dataModel.status === AMEND);
        this._checkAmendReasons();
      }
    }
  }

  private setDisableAmendButtonFlag(formStatus: string, isInternal: boolean) : boolean{
    return  formStatus !== FINAL || isInternal;
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
    this.genInfoModel.status = AMEND;
    this.genInfoModel.are_licenses_transfered = '';
    this._companyInfoService.mapDataModelToFormModel(this.genInfoModel, (<FormGroup>this.generalInfoFormLocalModel), this.amendReasonOptionList);
    console.log(this.helpTextSequences);
    console.log(this.helpTextSequences['rationaleInx']);
  }

  onblur() {
    // this._loggerService.log('input is typed');
    this._saveData();
  }

  private _saveData(): void{
    this._companyInfoService.mapFormModelToDataModel((<FormGroup>this.generalInfoFormLocalModel), this.genInfoModel, this.selectedAmendReasonCodes, 
      this.amendReasonCodeList, this.lang);
  }
  
  amendReasonOnChange() {
    console.log('amendReasonOnChange is called');
    this._checkAmendReasons();
    this._saveData();
  }

  private _checkAmendReasons(){
    this.isOtherSelected = this._isOther();
    const showAdminChangesFlag = this.generalInfoFormLocalModel.controls['areLicensesTransfered'].value === YES || 
      this._utilsService.isArray1ElementInArray2(this.selectedAmendReasonCodes, this.amendReasonCodesToShowAdminChanges)
    this.showAdminChanges.emit(showAdminChangesFlag);  
  }

  private _isOther() {
    return this.selectedAmendReasonCodes.indexOf(AMEND_REASON_OTHER) !== -1? true : false;
  }

  // private _hasReasonChecked() {
  //   this.generalInfoFormLocalModel.controls.amendReason.setValue(null);
  //   if (this.generalInfoFormLocalModel.controls.nameChange.value ||
  //     this.generalInfoFormLocalModel.controls.addressChange.value ||
  //     this.generalInfoFormLocalModel.controls.facilityChange.value ||
  //     this.generalInfoFormLocalModel.controls.contactChange.value ||
  //     this.generalInfoFormLocalModel.controls.otherChange.value) {
  //     this.generalInfoFormLocalModel.controls.amendReason.setValue('reasonFilled');
  //   }
  // }

  get amendReasonChkFormArray() {
    return this._companyInfoService.getAmendReasonCheckboxFormArray(this.generalInfoFormLocalModel);
  }

  // shortcut to get selectedAmendReasonCodes
  get selectedAmendReasonCodes(): string[] {
    return this._companyInfoService.getSelectedAmendReasonCodes(this.amendReasonOptionList, this.amendReasonChkFormArray);
  }

}

