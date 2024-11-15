import { Component, computed, EventEmitter, inject, Input, OnInit, Output, signal, Signal, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, ControlMessagesComponent, ICode, ICodeDefinition, UtilsService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FeesService } from './fees.service';
import { FeeDetails, TransactionEnrol } from '../models/transaction';
import { MITIGATION_TYPE } from '../app.constants';
import { AppSignalService } from '../signal/app-signal.service';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FeesComponent extends BaseComponent implements OnInit{

  lang: string;
  public showFieldErrors: boolean = false;
  public feesForm: FormGroup;

  @Input() showErrors: boolean;
  @Input() dataModel: FeeDetails;
  @Output() errorList = new EventEmitter(true);

  submissionClassOptions: ICodeDefinition[] = [];
  yesNoList: ICode[] = [];

  mitigationTypeOptions: ICode[] = [];

  private _signalService = inject(AppSignalService)
  mitigationTypeSignal = this._signalService.getMitigationType();
  showGovOrg: Signal<boolean> = computed(() => {return this.mitigationTypeSignal() === MITIGATION_TYPE.GOVERMENT_ORGANIZATION;});
  showISAD: Signal<boolean> = computed(() => {return this.mitigationTypeSignal() === MITIGATION_TYPE.ISAD;});
  showFundedInstitution: Signal<boolean> = computed(() => {return this.mitigationTypeSignal() === MITIGATION_TYPE.FUNDED_INSTITUTION;});
  showSmallBusiness: Signal<boolean> = computed(() => {return this.mitigationTypeSignal() === MITIGATION_TYPE.SMALL_BUSINESS;});
  showUrgentHealthNeed: Signal<boolean> = computed(() => {return this.mitigationTypeSignal() === MITIGATION_TYPE.URGENT_HEALTH_NEED;});

  constructor(private _feesService: FeesService, private _fb: FormBuilder, 
    private _utilsService: UtilsService, private _globalService: GlobalService) {
    super();
    this.showFieldErrors = false;
  }
  
  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.submissionClassOptions = this._globalService.submissionClasses;
    this.mitigationTypeOptions = this._globalService.mitigationTypes;
    this.yesNoList = this._globalService.yesnoList;

    this._getFeesForm()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
    }
    if (changes['dataModel']) {
      const dataModelCurrentValue = changes['dataModel'].currentValue as FeeDetails;
      this.dataModel = dataModelCurrentValue;
      this._feesService.mapDataModelToFormModel(
        dataModelCurrentValue,
        <FormGroup>this._getFeesForm());
    }
  }

  private _getFeesForm(){
    if (!this.feesForm) {
      this.feesForm = FeesService.getFeesForm(this._fb);
    }
    return this.feesForm;
  }

  onSubmissionClassSelected(selectedSubmissionClass: string){
    this.feesForm.controls['subDescription'].setValue(this._utilsService.getCodeDefinitionByIdByLang(selectedSubmissionClass, this.submissionClassOptions, this.lang));
  }

  onMitigationTypeSelected(selectedMitigationType: string) {
    this._signalService.setMitigationType(selectedMitigationType);
    const valuesToReset = ['certifyFundedInstitution','certifyGovOrg','certifySmallBusiness','certifyUrgentHealthNeed','certifyISAD','small_business_fee_application'];
    this._resetControlValues(valuesToReset);
  }

  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    this.errorList.emit(errors);
  }

  getFormValue() {
    return this.feesForm.value;
  }

  private _resetControlValues(controlNames: string[]) {
    for (let i = 0; i < controlNames.length; i++) {
      this._utilsService.resetControlsValues(this.feesForm.controls[controlNames[i]]);
    }
  }
}
