import { Component, computed, EventEmitter, Input, OnInit, Output, signal, Signal, ViewEncapsulation } from '@angular/core';
import { BaseComponent, ControlMessagesComponent, ICode, ICodeDefinition, UtilsService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FeesService } from './fees.service';
import { TransactionEnrol } from '../models/transaction';
import { MITIGATION_TYPE } from '../app.constants';

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
  @Input() dataModel: TransactionEnrol;
  @Output() errorList = new EventEmitter(true);

  submissionClassOptions: ICodeDefinition[] = [];
  selectedSubmissionClassDescription: string;
  yesNoList: ICode[] = [];

  mitigationTypeOptions: ICode[] = [];

  mitigationTypeSignal = signal<string>('');
  showGovOrg: Signal<boolean> = computed(() => {return this.mitigationTypeSignal() === MITIGATION_TYPE.GOVERMENT_ORGANIZATION;});
  showISAD: Signal<boolean> = computed(() => {return this.mitigationTypeSignal() === MITIGATION_TYPE.ISAD;});
  showFundedInstitution: Signal<boolean> = computed(() => {return this.mitigationTypeSignal() === MITIGATION_TYPE.FUNDED_INSTITUTION;});
  showSmallBusiness: Signal<boolean> = computed(() => {return this.mitigationTypeSignal() === MITIGATION_TYPE.SMALL_BUSINESS;});
  showUrgentHealthNeed: Signal<boolean> = computed(() => {return this.mitigationTypeSignal() === MITIGATION_TYPE.URGENT_HEALTH_NEED;});

  constructor(private __feesService: FeesService, private _fb: FormBuilder, 
    private _utilsService: UtilsService, private _globalService: GlobalService) {
    super();
    this.showFieldErrors = false;
  }
  
  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    
    if (!this.feesForm) {
      this.feesForm = FeesService.getFeesForm(this._fb);
    }

    this.submissionClassOptions = this._globalService.submissionClasses;
    this.mitigationTypeOptions = this._globalService.mitigationTypes;
    this.yesNoList = this._globalService.yesnoList;
  }

  onSubmissionClassSelected(selectedSubmissionClass: string){
    const codeDefinition = this._utilsService.findCodeDefinitionById(this.submissionClassOptions, selectedSubmissionClass);
    this.selectedSubmissionClassDescription = this._utilsService.getCodeDefinitionByLang(codeDefinition, this.lang);
  }

  onMitigationTypeSelected(selectedMitigationType: string) {
    this.mitigationTypeSignal.set(selectedMitigationType);
  }

  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    // the combined list of errors from both "regulatory information" and "transaction details"
    // console.log('Combined Errors List: ', errors);
    this.errorList.emit(errors);
  }

}
