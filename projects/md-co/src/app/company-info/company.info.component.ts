import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {CompanyInfoService} from './company.info.service';
import { ControlMessagesComponent, FINAL, UtilsService, LoggerService, YES, ICode, ConverterService, CheckboxOption } from '@hpfb/sdk/ui';
import { CompanyDataLoaderService } from '../form-base/company-data-loader.service';
import { AMEND } from '../app.constants';
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
 // @Input() inComplete: boolean;
  @Input() isInternal: boolean;
  @Input() helpTextSequences;

  @Output() errorList = new EventEmitter(true);
  @Output() showAdminChanges = new EventEmitter(true);

  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public isAmend: boolean = false;
  public showFieldErrors: boolean;
  public setAsComplete: boolean = false;  //ling todo remove???
  public disableAmendButton: boolean = true;
  public yesNoList: ICode[] = [];
  public amendReasonList: CheckboxOption[] = [];
  private reasonFlags: Array<boolean> = [];

  constructor(private cdr: ChangeDetectorRef, private _companyInfoService: CompanyInfoService, private _formDataLoader: CompanyDataLoaderService,
    private router: Router, private _utilsService: UtilsService, private _converterService: ConverterService, private _loggerService: LoggerService) {
    this.showFieldErrors = false;
    this.reasonFlags = [false, false, false, false]; // 0: show admin section; 1,2,3: amend reasons.
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

    this._formDataLoader.getAmendReasonList().pipe(
      map(originalData => originalData.map(item => this._converterService.convertCodeToCheckboxOption(item, this.lang)))
    ).subscribe((data) => {
      // this._loggerService.log("company.info", "onInit", JSON.stringify(data));
      this.amendReasonList = data;
      this.amendReasonList.forEach(() => this.amendReasonArray.push(new FormControl(false)));
    });
  }

  get amendReasonArray() {
    return this.generalInfoFormLocalModel.controls['amendReasons'] as FormArray;
  }

  // temp for ui display/debugging
  get selectedAmendReasons(): string[] {
    return this.amendReasonList
      .filter((item, idx) => this.amendReasonArray.controls.some((control, controlIdx) => idx === controlIdx && control.value))
      .map(item => item.value);
  }

  onAmendReasonChange() {
    console.log('xxx', this.selectedAmendReasons);
    this._saveData();
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
        this._companyInfoService.mapDataModelToFormModel(dataModel, this.generalInfoFormLocalModel);
        this.setAsComplete = (dataModel.status === FINAL && !this.isInternal); // ling todo remove??
        this.disableAmendButton = this.setDisableAmendButtonFlag(dataModel.status, this.isInternal);
        this.isAmend = (dataModel.status === AMEND);
        this.amendReasonOnblur();
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

  removed(rec) {
    console.log(rec);
  }

  // showAmendMsg() {
  //
  //   if (!this.generalInfoFormLocalModel) {
  //     return false;
  //   }
  //   return this.generalInfoFormLocalModel.controls['formStatus'].value === GlobalsService.AMEND;
  // }

  // disableAmend () {
  //   return !this.isInternal;
  // }

  public setAmendState () {
    this.isAmend = true;
    this.genInfoModel.status = AMEND;
    this.genInfoModel.are_licenses_transfered = '';
    this._companyInfoService.mapDataModelToFormModel(this.genInfoModel, (<FormGroup>this.generalInfoFormLocalModel));
  }

  onblur() {
    // this._loggerService.log('input is typed');
    this._saveData();
  }

  private _saveData(): void{
    this._companyInfoService.mapFormModelToDataModel((<FormGroup>this.generalInfoFormLocalModel), this.genInfoModel, this.amendReasonList);
  }

  nameChangeOnblur() {
    this._loggerService.log('company.info', 'nameChangeOnblur is called');
    this.reasonFlags[1] = this.generalInfoFormLocalModel.controls['nameChange'].value;
    this.amendReasonOnblur();
  }

  addressChangeOnblur() {
    this._loggerService.log('company.info', 'addressChangeOnblur is called');
    this.reasonFlags[2] = this.generalInfoFormLocalModel.controls['addressChange'].value;
    this.amendReasonOnblur();
  }

  facilityChangeOnblur() {
    this._loggerService.log('company.info', 'facilityChangeOnblur is called');
    this.reasonFlags[3] = this.generalInfoFormLocalModel.controls['facilityChange'].value;
    this.amendReasonOnblur();
  }

  amendReasonOnblur() {
    this._loggerService.log('company.info', 'amendReasonOnblur is called');
    this._hasReasonChecked();
    this.reasonFlags[0] = (this.generalInfoFormLocalModel.controls['areLicensesTransfered'].value === YES) ||
      this.reasonFlags[1] || this.reasonFlags[2] || this.reasonFlags[3];
    this.onblur();
    this.showAdminChanges.emit(this.reasonFlags);
  }

  isOther() {
    return this.generalInfoFormLocalModel.controls['otherChange'].value;
  }

  private _hasReasonChecked() {
    this.generalInfoFormLocalModel.controls['amendReason'].setValue(null);
    if (this.generalInfoFormLocalModel.controls['nameChange'].value ||
      this.generalInfoFormLocalModel.controls['addressChange'].value ||
      this.generalInfoFormLocalModel.controls['facilityChange'].value ||
      this.generalInfoFormLocalModel.controls['contactChange'].value ||
      this.generalInfoFormLocalModel.controls['otherChange'].value) {
      this.generalInfoFormLocalModel.controls['amendReason'].setValue('reasonFilled');
    }
  }

}

