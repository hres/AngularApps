import { Component, computed, EventEmitter, inject, Input, OnInit, Output, signal, Signal, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, ControlMessagesComponent, ICode, CheckboxOption, ICodeDefinition, UtilsService, HelpSequence, ConverterService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AppSignalService } from '../signal/app-signal.service';
import { CompanyEnrolmentService } from './company-enrolment.service';
import { CompanyEnrol } from '../models/Company';
import { ENROLMENT_STATUS } from '../app.constants';
import { data } from 'jquery';

@Component({
  selector: 'app-company-enrolment',
  templateUrl: './company-enrolment.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CompanyEnrolmentComponent extends BaseComponent implements OnInit{

  public lang: string;
  helpIndex: HelpSequence; 
  public showFieldErrors: boolean = false;

  public companyEnrolmentForm: FormGroup;
  @Input() showErrors: boolean;
  @Input() dataModel: CompanyEnrol;
  @Input() isInternal: boolean;
  @Output() errorList = new EventEmitter(true);

  public disableAmendButton: boolean = true;
  public showAmendButton: boolean = false;
  public showAmendNote: boolean = false;

  constructor(private _companyEnrolmentService: CompanyEnrolmentService, 
              private _fb: FormBuilder, 
              private _utilsService: UtilsService, 
              private _globalService: GlobalService,
              private _converterService : ConverterService) {
    super();
    this.showFieldErrors = false;
  }
  
  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    const enrolmentStatusesList = this._globalService.enrolmentStatusList;

    this._getCompanyEnrolmentForm();
    this._companyEnrolmentService.setEnrolmentStatus(this.companyEnrolmentForm, this.companyEnrolmentForm.controls['enrolmentStatus'].value, enrolmentStatusesList, this.lang, false);
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);

    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
    }

    if (changes['dataModel']) {
      const dataModelCurrentValue = changes['dataModel'].currentValue as CompanyEnrol;
      this.setDisableAmendButtonFlag(dataModelCurrentValue.application_type._id, this.isInternal);

      if (!isFirstChange) {
        this._companyEnrolmentService.mapDataModelToFormModel(dataModelCurrentValue, <FormGroup>this._getCompanyEnrolmentForm());
      }
      this.activateAmendButton(dataModelCurrentValue);
    }
  }

  private setDisableAmendButtonFlag(enrolStatusId: string, isInternal: boolean) : void{
    this.showAmendButton = (enrolStatusId === ENROLMENT_STATUS.FINAL && !isInternal);
  }

  private _getCompanyEnrolmentForm(){
    if (!this.companyEnrolmentForm) {
      this.companyEnrolmentForm = CompanyEnrolmentService.getEnrolmentForm(this._fb);
    }
    
    return this.companyEnrolmentForm;
  }

  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    this.errorList.emit(errors);
  }

  activateAmendButton(dataModel: CompanyEnrol) {
    if (dataModel) {
      if (!this.isInternal && dataModel.application_type._id === ENROLMENT_STATUS.FINAL) {
        this.disableAmendButton = false;
      } else if (dataModel.application_type._id === ENROLMENT_STATUS.NEW) {
        this.disableAmendButton = true;
      } else if(dataModel.software_version === '4.2.4' && ENROLMENT_STATUS.FINAL) {
        this.disableAmendButton = false;
      }
    }
  }

  setAmendState() {
    const enrolmentStatusesList = this._globalService.enrolmentStatusList;
    this.disableAmendButton = true;
    this._companyEnrolmentService.setEnrolmentStatus(this.companyEnrolmentForm, ENROLMENT_STATUS.AMEND, enrolmentStatusesList, this.lang, true)
    this.showAmendNote = true;
    this._resetControlValues(["reasonForFiling"]);
  }

  getFormValue() {
    return this.companyEnrolmentForm.value;
  }

  private _resetControlValues(controlNames: string[]) {
    for (let i = 0; i < controlNames.length; i++) {
      this._utilsService.resetControlsValues(this.companyEnrolmentForm.controls[controlNames[i]]);
    }
  }
}
