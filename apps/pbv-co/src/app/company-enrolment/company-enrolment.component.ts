import { Component, computed, EventEmitter, inject, Input, OnInit, Output, signal, Signal, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, ControlMessagesComponent, ICode, ICodeDefinition, UtilsService, HelpSequence } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppSignalService } from '../signal/app-signal.service';
import { CompanyEnrolmentService } from './company-enrolment.service';
import { CompanyEnrol } from '../models/Company';
import { ENROLMENT_STATUS } from '../app.constants';

@Component({
  selector: 'app-regulatory-enrolment',
  templateUrl: './company-enrolment.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CompanyEnrolmentComponent extends BaseComponent implements OnInit{

  lang: string;
  helpIndex: HelpSequence; 
  public showFieldErrors: boolean = false;
  public companyEnrolmentForm: FormGroup;

  @Input() showErrors: boolean;
  @Input() dataModel: CompanyEnrol;
  @Input() isInternal: boolean;
  @Output() errorList = new EventEmitter(true);

  private _signalService = inject(AppSignalService)

  public disableAmendButton: boolean = true;
  public showAmendNote: boolean = false;

  constructor(private _companyEnrolmentService: CompanyEnrolmentService, private _fb: FormBuilder, 
    private _utilsService: UtilsService, private _globalService: GlobalService) {
    super();
    this.showFieldErrors = false;
  }
  
  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;

    this._getRegulatoryEnrolmentForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);

    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
    }
  
    if (changes['dataModel']) {
      const dataModelCurrentValue = changes['dataModel'].currentValue as CompanyEnrol;
      this.dataModel = dataModelCurrentValue;
      if (!isFirstChange) {
        this._companyEnrolmentService.mapDataModelToFormModel(
          dataModelCurrentValue,
          <FormGroup>this._getRegulatoryEnrolmentForm());
      }
      
      this.activateAmendButton();
    }
  }

  private _getRegulatoryEnrolmentForm(){
    if (!this.companyEnrolmentForm) {
      this.companyEnrolmentForm = CompanyEnrolmentService.getEnrolmentForm(this._fb);
    }
    return this.companyEnrolmentForm;
  }

  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    this.errorList.emit(errors);
  }

  activateAmendButton() {
    if (!this.isInternal && this._signalService.isFINAL()) {
      this.disableAmendButton = false;
    } 
    this.disableAmendButton = true;
  }

  setAmendState() {
    this.showAmendNote = true;
    this._signalService.setEnrolmentStatus(ENROLMENT_STATUS.AMEND);
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
