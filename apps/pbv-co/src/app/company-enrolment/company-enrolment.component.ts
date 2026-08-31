import { ChangeDetectorRef, Component, computed, EventEmitter, inject, Input, OnInit, Output, signal, Signal, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, ControlMessagesComponent, ICode, CheckboxOption, ICodeDefinition, UtilsService, HelpSequence, ConverterService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AppSignalService } from '../signal/app-signal.service';
import { CompanyEnrolmentService } from './company-enrolment.service';
import { CompanyEnrol } from '../models/Company';
import { ENROLMENT_STATUS } from '../app.constants';
import { data } from 'jquery';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company-enrolment',
  templateUrl: './company-enrolment.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class CompanyEnrolmentComponent extends BaseComponent implements OnInit{

  public lang: string;
  helpIndex: HelpSequence;
  public showFieldErrors: boolean = false;

  public companyEnrolmentForm: FormGroup;
  @Input() showErrors: boolean;
  @Input() dataModel: CompanyEnrol;
  @Input() isInternal: boolean;
  @Input() disableForm: boolean;
  @Output() errorList = new EventEmitter(true);
  @Output() enableForm = new EventEmitter(false);

  public disableAmendButton: boolean = true;
  public showAmendButton: boolean = false;
  public showAmendNote: boolean = false;
  @Output() saveRecord = new EventEmitter<{
    recModel: FormGroup;
    status: string;
  }>();
  amendRecordPopupID: string = "amendRecordPopupID";
  popupTrigger: HTMLElement = null;
  amendHeading: string = '';
  private _initialized: boolean = false;;

  constructor(private _companyEnrolmentService: CompanyEnrolmentService,
              private _fb: FormBuilder,
              private _utilsService: UtilsService,
              private _globalService: GlobalService,
              private _converterService : ConverterService,
              private _cdr: ChangeDetectorRef,
              private _translateService : TranslateService) {
    super();
    this.showFieldErrors = false;
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    const enrolmentStatusesList = this._globalService.enrolmentStatusList;

    this._getCompanyEnrolmentForm();
    this._companyEnrolmentService.setEnrolmentStatus(this.companyEnrolmentForm, this.companyEnrolmentForm.controls['enrolmentStatus'].value, enrolmentStatusesList, this.lang, false);
    this._initialized = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);

    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
    }

    if (changes['dataModel']) {
      const dataModelCurrentValue = changes['dataModel'].currentValue as CompanyEnrol;
      this.setDisableAmendButtonFlag(dataModelCurrentValue, this.isInternal);

      if (!isFirstChange) {
        this._companyEnrolmentService.mapDataModelToFormModel(dataModelCurrentValue, <FormGroup>this._getCompanyEnrolmentForm());
      }
      this.activateAmendButton(dataModelCurrentValue);
    }

    if (this.disableForm) {
      this.disableFormGroup();
    } else {
      this.enableFormGroup();
        // ✅ ADD THIS BLOCK (5 lines)
        // if (this._initialized) {
        //   setTimeout(() => {
        //     this.showFieldErrors = true;
        //     const reasonControl = this.companyEnrolmentForm.get('reasonForFiling');
        //     if (reasonControl?.invalid) {
        //       reasonControl.markAsTouched();
        //       reasonControl.updateValueAndValidity();
        //     }
        //     this._cdr.detectChanges();
        //   }, 0);
        // }
      }




  }

  private setDisableAmendButtonFlag(dataModel: CompanyEnrol, isInternal: boolean) : void{
    if (dataModel.software_version < this._globalService.appVersion) {
      const appType = String(dataModel.application_type)?.toUpperCase();
      if (appType === ENROLMENT_STATUS.FINAL || appType === ENROLMENT_STATUS.APPROVED){
        this.showAmendButton = !isInternal;
      }
    } else {
      this.showAmendButton = (dataModel.application_type._id === ENROLMENT_STATUS.FINAL && !isInternal);
    }
  }

  private _getCompanyEnrolmentForm(){
    if (!this.companyEnrolmentForm) {
      this.companyEnrolmentForm = CompanyEnrolmentService.getEnrolmentForm(this._fb);
    }

    return this.companyEnrolmentForm;
  }

  protected override emitErrors(errors: ControlMessagesComponent[]): void {

    const fixedErrors = errors.map(error => {
      if (error) {
          const translationKey = error?.label || '';
          const fieldLabel = this.getFieldLabel(translationKey);
          error.label = fieldLabel;
          error.currentError = this.lang==='en'?'This field is required.':'Ce champ est obligatoire.';
      }
      return error;
  });

   this.errorList.emit(fixedErrors);
  }

  activateAmendButton(dataModel: CompanyEnrol) {
    if (dataModel) {
      if (!this.isInternal && dataModel.application_type._id === ENROLMENT_STATUS.FINAL) {
        this.disableAmendButton = false;
      } else if (dataModel.application_type._id === ENROLMENT_STATUS.NEW) {
        this.disableAmendButton = true;
      } else if (dataModel.software_version < this._globalService.appVersion) {
        const appType = String(dataModel.application_type)?.toUpperCase();
          if (appType === ENROLMENT_STATUS.FINAL || appType === ENROLMENT_STATUS.APPROVED) {
            this.disableAmendButton = false;
          }
        }
    }
  }

  setAmendState() {
    const enrolmentStatusesList = this._globalService.enrolmentStatusList;
    this.disableAmendButton = true;
    this.dataModel.application_type = this._converterService.findAndConverCodeToIdTextLabel(enrolmentStatusesList, ENROLMENT_STATUS.AMEND, this.lang);
    this._companyEnrolmentService.setEnrolmentStatus(this.companyEnrolmentForm, ENROLMENT_STATUS.AMEND, enrolmentStatusesList, this.lang, true)
    this.showAmendNote = true;
    this._resetControlValues(["reasonForFiling"]);
    this.enableForm.emit(true);
  }

  getFormValue() {
    return this.companyEnrolmentForm.value;
  }

  disableFormGroup() {
    if (this.companyEnrolmentForm) {
      this.companyEnrolmentForm.disable();
    }
  }

  enableFormGroup() {
    if (this.companyEnrolmentForm) {
      this.companyEnrolmentForm.enable();
    }
  }

  private _resetControlValues(controlNames: string[]) {
    for (let i = 0; i < controlNames.length; i++) {
      this._utilsService.resetControlsValues(this.companyEnrolmentForm.controls[controlNames[i]]);
    }
  }



  openConfirmationPopup(popupId: string) {
    const popupSelector = "#" + popupId;
    jQuery(popupSelector).trigger("open.wb-overlay");

    // Wait for overlay to render to focus on Close button once it is shown on the UI
    setTimeout(() => {
      const btn = document.querySelector(`${popupSelector} button.overlay-close`) as HTMLButtonElement;
      if (btn) {
        btn.focus();
      }
    }, 100);
  }


  handleClosedPopup() {
    setTimeout(() => {
      this.popupTrigger.focus();
    })
  }

 // ==================== THE FIX when using angular 22====================

 private getFieldLabel(translationKey: string): string {
  if (!translationKey) return 'This field';

  // Use the translation service to get the actual label
  const translated = this._translateService.instant(translationKey);

  // If translation returns the key itself, it means translation is not available
  if (translated === translationKey) {
      // Fallback: extract from key
      let cleanLabel = translationKey;
      if (cleanLabel.includes('.')) {
          const parts = cleanLabel.split('.');
          let lastPart = parts[parts.length - 1];
          lastPart = lastPart.replace(/([A-Z])/g, ' $1').trim();
          cleanLabel = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
      }
      return cleanLabel || 'This field';
  }

  return translated;
}

}
