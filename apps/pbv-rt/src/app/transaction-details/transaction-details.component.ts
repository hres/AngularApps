import { Component, computed, EventEmitter, inject, Input, input, OnInit, Output, signal, Signal, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, ControlMessagesComponent, HelpIndex, ICodeDefinition, UtilsService } from '@hpfb/sdk/ui';
import { TransactionDetailsService } from './transaction-details.service';
import { GlobalService } from '../global/global.service';
import { AppSignalService } from '../signal/app-signal.service';
import { data } from 'jquery';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class TransactionDetailsComponent extends BaseComponent implements OnInit {

  lang: string;
  helpIndex: HelpIndex; 

  // showErrors = input.required<boolean>();
  @Input() showErrors: boolean;
  @Output() errorList = new EventEmitter(true);

  transctionDetailsForm: FormGroup;

  private _signalService = inject(AppSignalService)

  constructor(private _transactionDetailsService: TransactionDetailsService, private _fb: FormBuilder, 
    private _utilsService: UtilsService, private _globalService: GlobalService) {
    super();
  }
    
  readonly selectedDossierTypeId: Signal<string> = this._signalService.getSelectedDossierType();
  readonly selectedRaLeadId = signal<string>(null);
  readonly selectedRaTypeId = signal<string>(null);
  readonly selectedTxDescId = signal<string>(null);

  // Regulatory Activity Lead drodropdown list is computed based on the selected Dossier Type
  raLeadList: Signal<ICodeDefinition[]> =  computed(() => {
    if(this.selectedDossierTypeId()){
      const filteredDossierTypeAndRaLeads = this._globalService.dossierTypeAndRaLeadsRelationship.filter(item => item.dossierTypeId === this.selectedDossierTypeId());
      const raLeadIds = filteredDossierTypeAndRaLeads.length ? filteredDossierTypeAndRaLeads[0].raLeadIds : [];
      console.log('updating raLeadList => raLeadIds', raLeadIds);
      const filteredRaLeads = this._globalService.raLeads.filter(lead => raLeadIds.includes(lead.id));
      console.log('updating raLeadList => filteredRaLeads', filteredRaLeads);
      return filteredRaLeads; 
    } else {
      return [];
    }
  });
  
  // Regulatory Activity Type drodropdown list is computed based on the selected Regulatory Activity Lead
  raTypeList: Signal<ICodeDefinition[]> =  computed(() => {
    if(this.selectedRaLeadId()){
      const filteredRaLeadAndRaTypes = this._globalService.raLeadAndRaTypesRelationship.filter(item => item.raLeadId === this.selectedRaLeadId());
      const raTypeIds = filteredRaLeadAndRaTypes.length ? filteredRaLeadAndRaTypes[0].raTypeIds : [];
      console.log('updating raTypeList => raTypeIds', raTypeIds);
      const filtereRaTypes = this._globalService.raTypes.filter(type => raTypeIds.includes(type.id));
      console.log('updating raTypeList => filtereRaTypes', filtereRaTypes);
      return filtereRaTypes; 
    } else {
      return [];
    }
  });

  // Regulatory Transaction Description drodropdown list is computed based on the selected Dossier Type and the selected Regulatory Activity Lead
  transactionDescriptionList: Signal<ICodeDefinition[]> =  computed(() => {
    console.log("updating transactionDescriptionList => this.selectedDossierTypeId()", this.selectedDossierTypeId(), "this.selectedRaTypeId()", this.selectedRaTypeId())

    if(this.selectedDossierTypeId() && this.selectedRaTypeId()) {
      // filter the dataset by selectedDossierTypeId first
      const filteredDossierTypeRaTypeAndTransactionDescriptions = this._globalService.dossierTypeRaTypeAndTransactionDescriptionsRelationship.find(dossier => dossier.dossierTypeIds.includes(this.selectedDossierTypeId()));
      console.log("updating transactionDescriptionList => filteredDossierTypeRaTypeAndTransactionDescriptions ", filteredDossierTypeRaTypeAndTransactionDescriptions);
      if (filteredDossierTypeRaTypeAndTransactionDescriptions) {
          // then filter by selectedRaTypeId
          const sequenceDescriptionIds = filteredDossierTypeRaTypeAndTransactionDescriptions.combos
              .filter(value => value.raTypeId === this.selectedRaTypeId())
              .map(value => value.sequenceDescriptionIds);

          console.log("updating transactionDescriptionList => sequenceDescriptionIds", sequenceDescriptionIds);

          const filtereTransactionDescriptions = this._globalService.transactionDescriptions.filter(item => sequenceDescriptionIds[0].includes(item.id));
          console.log('updating transactionDescriptionList => filtereTransactionDescriptions', filtereTransactionDescriptions);
          return filtereTransactionDescriptions; 
      } else {
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

  private _getCodeDefinition(codeDefinitionList: ICodeDefinition[], code: string){
    const codeDefinition = this._utilsService.findCodeDefinitionById(codeDefinitionList, code);
    return this._utilsService.getCodeDefinitionByLang(codeDefinition, this.lang);
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    // this.leadList = this._globalService.raLeads;
    
    if (!this.transctionDetailsForm) {
      this.transctionDetailsForm = this._transactionDetailsService.getTransctionDetailsForm(this._fb);
    }
    
  }

  // emit errors to parent component
  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    const transactionDetailsErrors = this.msgList.toArray();
    this.errorList.emit(transactionDetailsErrors);
  }

  onRaLeadSelected(raLeadId: string) {
    console.log('selected activity lead id:', raLeadId);
    this.selectedRaLeadId.set(raLeadId);
  }

  onRaTypeSelected(raTypeId: string) {
    console.log('selected activity type id:', raTypeId);
    this.selectedRaTypeId.set(raTypeId);
  }

  onSequenceDescriptionSelected(txDescId: string) {
    console.log('selected transaction description id:', txDescId);
    this.selectedTxDescId.set(txDescId);
  }

  getFormValue() {
    return this.transctionDetailsForm.value;
  }

}
