import { Component, computed, EventEmitter, inject, Input, OnInit, Output, signal, Signal, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, ControlMessagesComponent, ICode, ICodeDefinition, UtilsService, HelpSequence } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppSignalService } from '../signal/app-signal.service';
import { RegulatoryEnrolmentService } from './regulatory-enrolment.service';
import { CompanyEnrol } from '../models/Company';

@Component({
  selector: 'app-regulatory-enrolment',
  templateUrl: './regulatory-enrolment.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class RegulatoryEnrolmentComponent extends BaseComponent implements OnInit{

  lang: string;
  helpIndex: HelpSequence; 
  public showFieldErrors: boolean = false;
  public regulatoryEnrolmentForm: FormGroup;

  @Input() showErrors: boolean;
  @Input() dataModel: CompanyEnrol;
  @Output() errorList = new EventEmitter(true);

  private _signalService = inject(AppSignalService)

  constructor(private _regulatoryEnrolmentService: RegulatoryEnrolmentService, private _fb: FormBuilder, 
    private _utilsService: UtilsService, private _globalService: GlobalService) {
    super();
    this.showFieldErrors = false;
  }
  
  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
    }
    if (changes['dataModel']) {
      const dataModelCurrentValue = changes['dataModel'].currentValue as CompanyEnrol;
      this.dataModel = dataModelCurrentValue;
      this._regulatoryEnrolmentService.mapDataModelToFormModel(
        dataModelCurrentValue,
        <FormGroup>this._getRegulatoryEnrolmentForm());
    }
  }

  private _getRegulatoryEnrolmentForm(){
    if (!this.regulatoryEnrolmentForm) {
      this.regulatoryEnrolmentForm = RegulatoryEnrolmentService.getFeesForm(this._fb);
    }
    return this.regulatoryEnrolmentForm;
  }


  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    this.errorList.emit(errors);
  }

  getFormValue() {
    return this.regulatoryEnrolmentForm.value;
  }

  private _resetControlValues(controlNames: string[]) {
    for (let i = 0; i < controlNames.length; i++) {
      this._utilsService.resetControlsValues(this.regulatoryEnrolmentForm.controls[controlNames[i]]);
    }
  }
}
