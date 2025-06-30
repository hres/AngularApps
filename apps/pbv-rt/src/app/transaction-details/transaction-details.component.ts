import { Component, computed, EventEmitter, inject, Input, OnInit, Output, Signal, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, ControlMessagesComponent, HelpSequence, ICodeDefinition, LoggerService, UtilsService } from '@hpfb/sdk/ui';
import { TransactionDetailsService } from './transaction-details.service';
import { GlobalService } from '../global/global.service';
import { AppSignalService } from '../signal/app-signal.service';
import { LifecycleRecord } from '../models/transaction';
import { DOSSIER_TYPE, RA_LEAD, TXN_DESC_ACTION } from '../app.constants';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class TransactionDetailsComponent extends BaseComponent implements OnInit {

  lang: string;
  helpIndex: HelpSequence;

  // showErrors = input.required<boolean>();
  @Input() showErrors: boolean;
  @Input() dataModel: LifecycleRecord;
  @Input() newlySelDossierType: string;
  @Output() errorList = new EventEmitter(true);
 

  transctionDetailsForm: FormGroup;

  private _signalService = inject(AppSignalService);
  private _logger = inject(LoggerService)

  constructor(
    private _transactionDetailsService: TransactionDetailsService,
    private _fb: FormBuilder,
    private _utilsService: UtilsService,
    private _globalService: GlobalService
  ) {
    super();
  }

  isVet: boolean = false;
  isNOC: boolean = false;
  readonly selectedDossierTypeId: Signal<string> = this._transactionDetailsService.selectedDossierTypeId;
  readonly selectedRaLeadId: Signal<string> = this._transactionDetailsService.selectedRaLeadId;
  readonly selectedRaTypeId: Signal<string> = this._transactionDetailsService.selectedRaTypeId;
  readonly selectedTxDescId: Signal<string> = this._transactionDetailsService.selectedTxDescId;

  // Regulatory Activity Lead drodropdown list is computed based on the selected Dossier Type
  raLeadList: Signal<ICodeDefinition[]> = computed(() => {
    if (this.selectedDossierTypeId()) {
      const filteredDossierTypeAndRaLeads =
        this._globalService.dossierTypeAndRaLeadsRelationship.filter(
          (item) => item.dossierTypeId === this.selectedDossierTypeId()
        );
      this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent', 'updating raLeadList', `filteredDossierTypeAndRaLeads ->`, filteredDossierTypeAndRaLeads);

      if (filteredDossierTypeAndRaLeads.length === 1) {
        const raLeadIds = filteredDossierTypeAndRaLeads[0].raLeadIds;
        this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent',  'updating raLeadList', 'raLeadIds ->', raLeadIds);
        const filteredRaLeads = this._globalService.raLeads.filter((lead) =>
          raLeadIds.includes(lead.id)
        );
        this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent',  'updating raLeadList', `filteredRaLeads ->`, filteredRaLeads);
        return filteredRaLeads;
      } else {
        this._logger.error(this._globalService.debugEnabled, 'TransactionDetailsComponent', 'updating raLeadList', `found ${filteredDossierTypeAndRaLeads.length} filteredDossierTypeAndRaLeads`);
        return [];
      }
    } else {
      return [];
    }
  });

  // Regulatory Activity Type drodropdown list is computed based on the selected Regulatory Activity Lead
  raTypeList: Signal<ICodeDefinition[]> = computed(() => {
    if (this.selectedRaLeadId()) {
      const filteredRaLeadAndRaTypes =
        this._globalService.raLeadAndRaTypesRelationship.filter(
          (item) => item.raLeadId === this.selectedRaLeadId()
        );
      this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent', 'updating raTypeList', 'filteredRaLeadAndRaTypes ->', filteredRaLeadAndRaTypes);

      if (filteredRaLeadAndRaTypes.length === 1) {
        const raTypeIds = filteredRaLeadAndRaTypes[0].raTypeIds;
        this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent',  'updating raTypeList', 'raTypeIds ->', raTypeIds);
        const filteredRaTypes = this._globalService.raTypes.filter((type) =>
          raTypeIds.includes(type.id)
        );
        this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent',  'updating raTypeList', 'filtereRaTypes ->', filteredRaTypes);
        return filteredRaTypes;
      } else {
        this._logger.error(this._globalService.debugEnabled, 'TransactionDetailsComponent', 'updating raTypeList', `found ${filteredRaLeadAndRaTypes.length} filteredRaLeadAndRaTypes`);
        return [];
      }
    } else {
      return [];
    }
  });

  // Regulatory Transaction Description drodropdown list is computed based on the selected Regulatory Activity Lead and the selected Regulatory Activity Type
  transactionDescriptionList: Signal<ICodeDefinition[]> = computed(() => {
    if (this.selectedRaLeadId() && this.selectedRaTypeId()) {
      this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent',  
        'updating transactionDescriptionList',  'this.selectedRaLeadId()',this.selectedRaLeadId(), 'this.selectedRaTypeId()', this.selectedRaTypeId());
      // filter the raLeadRaTypeAndTxnDescrs dataset by raLeadId 
      const filteredRaLeadRaTypeAndTxnDescs =
        this._globalService.raLeadRaTypeAndTxnDescrs.filter(
          (item) =>
            item.raLeadId === this.selectedRaLeadId());

      if (filteredRaLeadRaTypeAndTxnDescs.length === 1) {
        const matrix = filteredRaLeadRaTypeAndTxnDescs[0].matrix;
        this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent',  'updating transactionDescriptionList',  'filteredRaLeadRaTypeAndTxnDescs[0].matrix ->', matrix);
        // filter matrix by raTypeId 
        const filteredMatrix = matrix.filter(
            (item) =>
              item.raTypeId === this.selectedRaTypeId());
        this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent',   'updating transactionDescriptionList',  'filteredMatrix ->', filteredMatrix);

        if (filteredMatrix.length === 1) {
          const txnDescIds = filteredMatrix[0].txnDescIds;
          // get the transaction description ICodeDefinitions by txnDescIds
          const filtereTransactionDescriptions =
            this._globalService.transactionDescriptions.filter((item) =>
              txnDescIds.includes(item.id)
            );
          this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent', 'updating transactionDescriptionList',  'filtereTransactionDescriptions ->', filtereTransactionDescriptions);
          return filtereTransactionDescriptions;
        } else {
          this._logger.error(this._globalService.debugEnabled, 'TransactionDetailsComponent', 'updating transactionDescriptionList', `found ${filteredMatrix.length} filteredMatrix `);
          return [];
        }
      } else {
        this._logger.error(this._globalService.debugEnabled, 'TransactionDetailsComponent',  'updating transactionDescriptionList', `found ${filteredRaLeadRaTypeAndTxnDescs.length} filteredRaLeadRaTypeAndTxnDescs `);
        return [];
      }
    } else {
      return [];
    }
  });

  readonly selectedRaLeadDefinition = computed(() => {
    return this._getCodeDefinition(this.raLeadList(), this.selectedRaLeadId());
  });

  readonly selectedRaTypeDefinition = computed(() => {
    return this._getCodeDefinition(this.raTypeList(), this.selectedRaTypeId());
  });

  readonly selectedTxDescDefinition = computed(()=>{
    return this._getCodeDefinition(this.transactionDescriptionList(), this.selectedTxDescId());
  })

  showDateOfRequest = this._transactionDetailsService.showDateOfRequest;
  showRequesters = this._transactionDetailsService.showRequesters;
  showStartEndDate = this._transactionDetailsService.showStartEndDate;
  showYearsOfChange = this._transactionDetailsService.showYearsOfChange;
  showYear = this._transactionDetailsService.showYear;
  showVersionNum = this._transactionDetailsService.showVersionNum;
  showBriefDescription = this._transactionDetailsService.showBriefDescription;
  showBriefDescriptionOfChange = this._transactionDetailsService.showBriefDescriptionOfChange;

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;

    if (!this.transctionDetailsForm) {
      this.transctionDetailsForm =
        this._transactionDetailsService.getTransctionDetailsForm(this._fb);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);
    // Ignore first trigger of ngOnChanges
    if (!isFirstChange) {
      if (changes['showErrors']) {
        this.showErrors = changes['showErrors'].currentValue;
      }
      if (changes['dataModel']) {
        // when uploading a file
        const dataModelCurrentValue = changes['dataModel']
          .currentValue as LifecycleRecord;
        this._transactionDetailsService.mapDataModelToFormModel(
          dataModelCurrentValue,
          <FormGroup>this.transctionDetailsForm
        );
        this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent',  `ngOnChanges uploaded values ...
          activityLead=${this.transctionDetailsForm.controls['activityLead'].value}, 
          activityType=${this.transctionDetailsForm.controls['activityType'].value}
          descriptionTyp=${this.transctionDetailsForm.controls['descriptionType'].value}`);

          this._signalService.setSelectedRaLead(this.transctionDetailsForm.controls['activityLead'].value);
          this._signalService.setSelectedRaType(this.transctionDetailsForm.controls['activityType'].value);
          this._signalService.setSelectedTxnDesc(this.transctionDetailsForm.controls['descriptionType'].value);

      } else if (changes['newlySelDossierType']) {

        this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent',  `ngOnChanges dossierTypeId ${this.newlySelDossierType} is passed in`)
        const valuesToReset = ['activityLead', 'activityType', 'descriptionType'];
        this._resetControlValues(valuesToReset);

        this.isVet = this.newlySelDossierType == DOSSIER_TYPE.VETERINARY;
        if (this.isVet) {
          this.transctionDetailsForm.controls['activityLead'].setValue(RA_LEAD.VETERINARY);
          this.onRaLeadSelected(RA_LEAD.VETERINARY);
        } else {
          this.onRaLeadSelected(this.transctionDetailsForm.controls['activityLead'].value);
        }
        this.isVet = this.newlySelDossierType == DOSSIER_TYPE.VETERINARY;
      }
    }
  }

  // emit errors to parent component
  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    const transactionDetailsErrors = this.msgList.toArray();
    this.errorList.emit(transactionDetailsErrors);
  }

  onRaLeadSelected(raLeadId: string) {
    this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent',  'onRaLeadSelected activity lead id:', raLeadId);
    this._signalService.setSelectedRaLead(raLeadId);
    // Clear RA Type and Transaction Description signals and form values
    this._signalService.setSelectedRaType("");
    this._signalService.setSelectedTxnDesc("");
    this.transctionDetailsForm.controls['activityType'].setValue("");
    this.transctionDetailsForm.controls['descriptionType'].setValue("");
  }

  onRaTypeSelected(raTypeId: string) {
    this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent',  'onRaTypeSelected activity type id:', raTypeId);
    this._signalService.setSelectedRaType(raTypeId);
    // Clear Transaction Description signals and form values
    this._signalService.setSelectedTxnDesc(""); 
    this.transctionDetailsForm.controls['descriptionType'].setValue(""); 
    this.transctionDetailsForm.controls['controlNumber'].setValue(""); 
    if(this.transctionDetailsForm.controls['activityType'].getRawValue() =="B02-20160301-038")
    {
      this.transctionDetailsForm.controls['controlNumber'].setValue("000000");
      this.isNOC = true;
    }else{
      this.transctionDetailsForm.controls['controlNumber'].setValue("");
      this.isNOC = false;
    }
  }

  onTransactionDescriptionSelected(txDescId: string) {
    this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent',  'onTransactionDescriptionSelected transaction description id:', txDescId);
    this._signalService.setSelectedTxnDesc(txDescId);
    
    this._resetActionsValues();
  }

  private _resetActionsValues() {
    let keysToKeep: string[] = [];
    if (this.showDateOfRequest()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_DATEOFREQUEST);
    } 
    if (this.showStartEndDate()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_STARTENDDATE);
    } 
    if (this.showRequesters()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_REQUESTERS);
    } 
    if (this.showYearsOfChange()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_YEARSOFCHANGE);
    } 
    if (this.showYear()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_YEAR);
    } 
    if (this.showVersionNum()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_VERSIONNUM);
    } 
    if (this.showBriefDescription()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_BRIEFDESCRIPTION);
    } 
    if (this.showBriefDescriptionOfChange()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_BRIEFDESCRIPTIONOFCHANGE);
    }

    // Collect all the values to remove from actionFlagFieldsMap based on these keys
    let valuesToKeep: string[] = [];
    
    keysToKeep.forEach(key => {
      valuesToKeep = valuesToKeep.concat(this._transactionDetailsService.actionFlagFieldsMap[key] || []);
    });

    // Filter out the fields that exist in valuesToKeep
    const valuesToReset = this._transactionDetailsService.actionFieldsArray.filter(field => !valuesToKeep.includes(field));
    this._logger.log(this._globalService.debugEnabled, 'TransactionDetailsComponent',  'onTransactionDescriptionSelected', '_resetActionsValues ->', valuesToReset); 
    this._resetControlValues(valuesToReset);
  }

  onblur() {
    // this._loggerService.log('input is typed');
    //this._saveData();
  }
  getFormValue() {
    return this.transctionDetailsForm.value;
  }

  checkDateValidity(inputName : string, event: any): void {
    const startDate = this.transctionDetailsForm.controls['startDate'].value;
    const endDate = this.transctionDetailsForm.controls['endDate'].value;
    const sD: Date = new Date(startDate);
    const eD: Date = new Date(endDate);

    if (startDate && sD.getTime() > eD.getTime()) {
      console.log("here");
      this.transctionDetailsForm.controls['endDate'].setErrors({'error.msg.endDate' : true});
    } else {
      this._utilsService.checkInputValidity(event, this.transctionDetailsForm.get(inputName),'invalidDate');    
    }
  } 

  private _getCodeDefinition(codeDefinitionList: ICodeDefinition[], id: string){
    return this._utilsService.getCodeDefinitionByIdByLang(id, codeDefinitionList, this.lang)
  }

  private _resetControlValues(controlNames: string[]) {
    for (let i = 0; i < controlNames.length; i++) {
      this._utilsService.resetControlsValues(this.transctionDetailsForm.controls[controlNames[i]]);
    }
  }

}
