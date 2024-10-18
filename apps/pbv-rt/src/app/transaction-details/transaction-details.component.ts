import { Component, computed, EventEmitter, inject, Input, input, OnInit, Output, signal, Signal, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, ControlMessagesComponent, HelpIndex, ICodeDefinition, UtilsService } from '@hpfb/sdk/ui';
import { TransactionDetailsService } from './transaction-details.service';
import { GlobalService } from '../global/global.service';
import { AppSignalService } from '../signal/app-signal.service';
import { LifecycleRecord } from '../models/transaction';
import { TXN_DESC_ACTION } from '../app.constants';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styles: [
    `
      .legend-rep {
        font-size: 15px !important;
        font-weight: 700 !important;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TransactionDetailsComponent extends BaseComponent implements OnInit {

  lang: string;
  helpIndex: HelpIndex;

  // showErrors = input.required<boolean>();
  @Input() showErrors: boolean;
  @Input() dataModel: LifecycleRecord;
  @Output() errorList = new EventEmitter(true);

  transctionDetailsForm: FormGroup;

  private _signalService = inject(AppSignalService);

  constructor(
    private _transactionDetailsService: TransactionDetailsService,
    private _fb: FormBuilder,
    private _utilsService: UtilsService,
    private _globalService: GlobalService
  ) {
    super();
  }
    
  // readonly selectedDossierTypeId: Signal<string> = this._signalService.getSelectedDossierType();
  // readonly selectedRaLeadId = signal<string>(null);
  // readonly selectedRaTypeId = signal<string>(null);
  // readonly selectedTxDescId = signal<string>(null);

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
      console.log(
        'updating raLeadList => filteredDossierTypeAndRaLeads',
        filteredDossierTypeAndRaLeads
      );

      if (filteredDossierTypeAndRaLeads.length === 1) {
        const raLeadIds = filteredDossierTypeAndRaLeads[0].raLeadIds;
        console.log('updating raLeadList => raLeadIds', raLeadIds);
        const filteredRaLeads = this._globalService.raLeads.filter((lead) =>
          raLeadIds.includes(lead.id)
        );
        console.log('updating raLeadList => filteredRaLeads', filteredRaLeads);
        return filteredRaLeads;
      } else {
        console.error(
          `updating raLeadList => found ${filteredDossierTypeAndRaLeads.length} filteredDossierTypeAndRaLeads `
        );
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
      console.log(
        'updating raTypeList => filteredRaLeadAndRaTypes',
        filteredRaLeadAndRaTypes
      );

      if (filteredRaLeadAndRaTypes.length === 1) {
        const raTypeIds = filteredRaLeadAndRaTypes[0].raTypeIds;
        console.log('updating raTypeList => raTypeIds', raTypeIds);
        const filteredRaTypes = this._globalService.raTypes.filter((type) =>
          raTypeIds.includes(type.id)
        );
        console.log('updating raTypeList => filtereRaTypes', filteredRaTypes);
        return filteredRaTypes;
      } else {
        console.error(
          `updating raTypeList => found ${filteredRaLeadAndRaTypes.length} filteredRaLeadAndRaTypes `
        );
        return [];
      }
    } else {
      return [];
    }
  });

  // Regulatory Transaction Description drodropdown list is computed based on the selected Regulatory Activity Lead and the selected Regulatory Activity Type
  transactionDescriptionList: Signal<ICodeDefinition[]> = computed(() => {
    if (this.selectedRaLeadId() && this.selectedRaTypeId()) {
      // filter the raLeadRaTypeAndTxnDescrs dataset by raLeadId and raTypeId
      const filteredRaLeadRaTypeAndTxnDescrs =
        this._globalService.raLeadRaTypeAndTxnDescrs.filter(
          (item) =>
            item.raLeadId === this.selectedRaLeadId() &&
            item.raTypeId === this.selectedRaTypeId()
        );
      console.log(
        'updating transactionDescriptionList => this.selectedRaLeadId()',
        this.selectedRaLeadId(),
        'this.selectedRaTypeId()',
        this.selectedRaTypeId(),
        'filteredRaLeadRaTypeAndTxnDescrs ',
        filteredRaLeadRaTypeAndTxnDescrs
      );

      if (filteredRaLeadRaTypeAndTxnDescrs.length === 1) {
        // get the txnDescrIds for this raLeadId and raTypeId combination
        const transactionDescriptionIds =
          filteredRaLeadRaTypeAndTxnDescrs[0].txnDescrIds;
        console.log(
          'updating transactionDescriptionList => transactionDescriptionIds',
          transactionDescriptionIds
        );
        // filter the transactionDescriptions dataset based on the transactionDescriptionIds
        const filtereTransactionDescriptions =
          this._globalService.transactionDescriptions.filter((item) =>
            transactionDescriptionIds.includes(item.id)
          );
        console.log(
          'updating transactionDescriptionList => filtereTransactionDescriptions',
          filtereTransactionDescriptions
        );
        return filtereTransactionDescriptions;
      } else {
        console.error(
          `updating transactionDescriptionList => found ${filteredRaLeadRaTypeAndTxnDescrs.length} filteredRaLeadRaTypeAndTxnDescrs `
        );
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

  showDated = this._transactionDetailsService.showDated;
  showRequesters = this._transactionDetailsService.showRequesters;
  showStartEndDate = this._transactionDetailsService.showStartEndDate;
  showYearsOfChange = this._transactionDetailsService.showYearsOfChange;
  showYear = this._transactionDetailsService.showYear;
  showVersionNum = this._transactionDetailsService.showVersionNum;
  showBriefDescription = this._transactionDetailsService.showBriefDescription;
  showBriefDescriptionOfChange = this._transactionDetailsService.showBriefDescriptionOfChange;
/*
  // computed signal for rendering of the "Dated" field
  showDated = computed(() => {
    return this._transactionDetailsService.showDateTxnDescs.includes(
      this.selectedTxDescId()
    );
  });

  // computed signal for rendering of the "Dated" field
  showRequesters = computed(() => {
    return this._transactionDetailsService.showRequesterTxnDescs.includes(
      this.selectedTxDescId()
    );
  });

  // computed signal for rendering of the "Start Date" and "End Date" fields
  showStartEndDate = computed(() => {
    return this._transactionDetailsService.showStartEndDateTxnDescs.includes(
      this.selectedTxDescId()
    );
  });

  // computed signal for rendering of the "Years Of Change" field
  showYearsOfChange = computed(() => {
    return this._transactionDetailsService.showYearsOfChangeTxnDescs.includes(
      this.selectedTxDescId()
    );
  });

  // computed signal for rendering of the "Year" field
  showYear = computed(() => {
    return this._transactionDetailsService.showYearTxnDescs.includes(
      this.selectedTxDescId()
    );
  });

  // computed signal for rendering of the "Version" field
  showVersionNum = computed(() => {
    return this._transactionDetailsService.showVersionNumTxnDescs.includes(
      this.selectedTxDescId()
    );
  });

  // computed signal for rendering of the "Brief Description" field
  showBriefDescription = computed(() => {
    return this._transactionDetailsService.showBriefDescriptionnTxnDescs.includes(
      this.selectedTxDescId()
    );
  });

  // computed signal for rendering of the "Brief Description of Change" field
  showBriefDescriptionOfChange = computed(() => {
    return this._transactionDetailsService.showBriefDescriptionnOfChangeTxnDescs.includes(
      this.selectedTxDescId()
    );
  });
*/
  // readonly showActions = computed(() => {
  //   return (
  //     this.showDated() ||
  //     this.showRequesters() ||
  //     this.showStartEndDate() ||
  //     this.showVersionNum() ||
  //     this.showBriefDescription() ||
  //     this.showBriefDescriptionOfChange()
  //   );
  // });

  private _getCodeDefinition(codeDefinitionList: ICodeDefinition[], code: string){
    const codeDefinition = this._utilsService.findCodeDefinitionById(codeDefinitionList, code);
    return this._utilsService.getCodeDefinitionByLang(codeDefinition, this.lang);
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    // this.leadList = this._globalService.raLeads;

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
        const dataModelCurrentValue = changes['dataModel']
          .currentValue as LifecycleRecord;
        this._transactionDetailsService.mapDataModelToFormModel(
          dataModelCurrentValue,
          <FormGroup>this.transctionDetailsForm
        );
      }
      console.log(`ngOnChanges set all signals' values ...
        activityLead=${this.transctionDetailsForm.controls['activityLead'].value}, 
        activityType=${this.transctionDetailsForm.controls['activityType'].value}
        descriptionTyp=${this.transctionDetailsForm.controls['descriptionType'].value}`);

      this.onRaLeadSelected(this.transctionDetailsForm.controls['activityLead'].value);
      this.onRaTypeSelected(this.transctionDetailsForm.controls['activityType'].value);
      this.onSequenceDescriptionSelected(this.transctionDetailsForm.controls['descriptionType'].value);
    }
  }

  // emit errors to parent component
  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    const transactionDetailsErrors = this.msgList.toArray();
    this.errorList.emit(transactionDetailsErrors);
  }

  onRaLeadSelected(raLeadId: string) {
    console.log('selected activity lead id:', raLeadId);
    // this.selectedRaLeadId.set(raLeadId);
    this._signalService.setSelectedRaLead(raLeadId)
  }

  onRaTypeSelected(raTypeId: string) {
    console.log('selected activity type id:', raTypeId);
    // this.selectedRaTypeId.set(raTypeId);
    this._signalService.setSelectedRaType(raTypeId)
  }

  onSequenceDescriptionSelected(txDescId: string) {
    console.log('selected transaction description id:', txDescId);
    // this.selectedTxDescId.set(txDescId);
    this._signalService.setSelectedTxnDesc(txDescId);
    
    this._resetActionsValues();
  }

  private _resetActionsValues() {
    let keysToKeep: string[] = [];
    if (this.showDated()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_DATE);
    } else if (this.showStartEndDate()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_STARTENDDATE);
    } else if (this.showRequesters()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_REQUESTERS);
    } else if (this.showYearsOfChange()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_YEARSOFCHANGE);
    } else if (this.showYear()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_YEAR);
    } else if (this.showVersionNum()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_VERSIONNUM);
    } else if (this.showBriefDescription()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_BRIEFDESCRIPTION);
    } else if (this.showBriefDescriptionOfChange()) {
      keysToKeep.push(TXN_DESC_ACTION.SHOW_BRIEFDESCRIPTIONOFCHANGE);
    }

    // Collect all the values to remove from actionFlagFieldsMap based on these keys
    let valuesToKeep: string[] = [];
    
    keysToKeep.forEach(key => {
      valuesToKeep = valuesToKeep.concat(this._transactionDetailsService.actionFlagFieldsMap[key] || []);
    });

    // Filter out the fields that exist in valuesToKeep
    const valuesToReset = this._transactionDetailsService.actionFieldsArray.filter(field => !valuesToKeep.includes(field));
    console.log(`txn desc onchange, valuesToReset: ${valuesToReset}`); 
    this._resetControlValues(valuesToReset);
  }

  getFormValue() {
    return this.transctionDetailsForm.value;
  }

  checkDateValidity(event: any): void {
    this._utilsService.checkInputValidity(event, this.transctionDetailsForm.get('requestDate'), 'invalidDate');
  } 

  private _resetControlValues(controlNames: string[]) {
    for (let i = 0; i < controlNames.length; i++) {
      this._utilsService.resetControlsValues(this.transctionDetailsForm.controls[controlNames[i]]);
    }
  }
}
