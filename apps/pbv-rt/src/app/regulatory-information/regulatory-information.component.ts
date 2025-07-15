import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation, computed, signal, inject, viewChild, Signal, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { ICodeDefinition, ICode, UtilsService, BaseComponent, ControlMessagesComponent, HelpSequence, LoggerService } from '@hpfb/sdk/ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegulatoryInformationService } from './regulatory-information.service';
import { LifecycleRecord, TransactionEnrol } from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { AppSignalService } from '../signal/app-signal.service';
import { TransactionDetailsComponent } from '../transaction-details/transaction-details.component';
import { PbvValidationService } from '@hpfb/pbv';

@Component({
  selector: 'app-regulatory-information',
  templateUrl: './regulatory-information.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class RegulatoryInformationComponent extends BaseComponent implements OnInit {
  lang: string;
  helpIndex: HelpSequence; 

  @Input() showErrors: boolean;
  @Input() dataModel: TransactionEnrol;
  @Output() errorList = new EventEmitter(true);

  public regulartoryInfoForm: FormGroup;
  public lifecycleRecordModel: LifecycleRecord;

  dossierTypeOptions: ICodeDefinition[] = [];
  adminSubTypeOptions: ICodeDefinition[] = [];
  public yesNoList: ICode[] = [];
  public showFieldErrors: boolean = false;

  @ViewChild(TransactionDetailsComponent) tranDetailsChild: TransactionDetailsComponent;
  private transactionDetailsErrors = [];

  private _signalService = inject(AppSignalService)
  private _logger = inject(LoggerService)

  isPharmaBio: Signal<boolean> = this._signalService.isPharmaBio();
  isPharmaBioVet: Signal<boolean> = this._signalService.isPharmaBioVet();

  readonly selectedDossierTypeSignal = this._signalService.getSelectedDossierType();

  readonly selectedDossierTypeDefinition = computed(() => {
    if (!this.isPharmaBio()) {
      const valuesToReset = ['isPriority', 'isNOC'];
      this._resetControlValues(valuesToReset);
    }
    return this._getCodeDefinition(this._globalService.dossierTypes, this.selectedDossierTypeSignal());
  });

  adminSubmissionSelected = signal('');
  isAdminSubmission: Signal<boolean> = computed(() => {
    return this.isPharmaBioVet() && this.adminSubmissionSelected() === 'Y';
  });

  selectedAdminSubTypeDefinition: string = '';

  constructor(private _regulatoryInfoService: RegulatoryInformationService, private _fb: FormBuilder, 
    private _utilsService: UtilsService, private _globalService: GlobalService) {
    super();
    this.showFieldErrors = false;
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    
    if (!this.regulartoryInfoForm) {
      this.regulartoryInfoForm = RegulatoryInformationService.getRegularInfoForm(this._fb);
    }

    this.dossierTypeOptions = this._globalService.dossierTypes;
    this.yesNoList = this._globalService.yesnoList;
    this.adminSubTypeOptions = this._globalService.adminSubTypes;
  }

  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    // the combined list of errors from both "regulatory information" and "transaction details"
    // console.log('Combined Errors List: ', errors);
    errors = this.msgList.toArray();
    errors = errors.concat(this.transactionDetailsErrors)
    this.errorList.emit(errors);
  }

  processTransactionDetailsErrors(childErrors) {
    this.transactionDetailsErrors = childErrors;
    this._appendErrorsFromChild(childErrors);
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);
    // Ignore first trigger of ngOnChanges
    if (!isFirstChange) {
      if (changes['showErrors']) {
        this.showFieldErrors = changes['showErrors'].currentValue;
      }
      if (changes['dataModel']) {
        const dataModelCurrentValue = changes['dataModel'].currentValue as TransactionEnrol;
        this.lifecycleRecordModel = dataModelCurrentValue.ectd.lifecycle_record;
        this._regulatoryInfoService.mapDataModelToFormModel(
          dataModelCurrentValue,
          <FormGroup>this.regulartoryInfoForm);

        this.onDossierTypeSelected(this.regulartoryInfoForm.controls['dossierType'].value); 
        this.onAdminSubmissionSelected(this.regulartoryInfoForm.controls['isAdminSubmission'].value, true);
        this.onAdminSubTypeSelected(this.regulartoryInfoForm.controls['adminSubType'].value);
      }
    }
  }

  onDossierTypeSelected(selectedDossierTypeId: string) {
    this._logger.log(this._globalService.debugEnabled, 'RegulatoryInformationComponent', 'onDossierTypeSelected',  `dossier type id: ${selectedDossierTypeId}`);

    if (!selectedDossierTypeId) {
      this.adminSubmissionSelected.set(null);
      this._signalService.setSelectedDossierType(null);
      const valuesToReset = ['isAdminSubmission', 'adminSubType'];
      this._resetControlValues(valuesToReset);
    } else {
        this._signalService.setSelectedDossierType(selectedDossierTypeId)
        if (this.isPharmaBio()) {
          this.regulartoryInfoForm.controls['dossierId'].setValidators([Validators.required,PbvValidationService.pharmabioDossierIdValidator]);
        } else {
          this.regulartoryInfoForm.controls['dossierId'].setValidators([Validators.required,PbvValidationService.vetDossierIdValidator]);
        }
        this.regulartoryInfoForm.controls['dossierId'].updateValueAndValidity();
    }
  }

  onAdminSubmissionSelected(selectedAdminSubmissionId: string, isProgrammaticUpdate: boolean) {
    this.adminSubmissionSelected.set( selectedAdminSubmissionId );
    if (!isProgrammaticUpdate){ // if the event is triggered from the UI
      const valuesToReset = ['adminSubType'];
      this._resetControlValues(valuesToReset);
      this.selectedAdminSubTypeDefinition = '';
    }
  }

  onAdminSubTypeSelected(selectedAdminSubTypeId: string) {
    this.selectedAdminSubTypeDefinition = this._getCodeDefinition(this.adminSubTypeOptions, selectedAdminSubTypeId);
  }

  restrictInput(event: KeyboardEvent) {
    const allowedPattern = /^[a-z0-9]$/; // Only lowercase letters and numbers are allowed
    if (!allowedPattern.test(event.key)) {
      event.preventDefault(); // Block invalid input
    }
  }
  
  getFormValue() {
    const regInfoFormValues = this.regulartoryInfoForm.value;
    const tranDetailsFormValues = this.tranDetailsChild.getFormValue();

    return { ...regInfoFormValues, ...tranDetailsFormValues };
  }

  private _getCodeDefinition(codeDefinitionList: ICodeDefinition[], id: string){
    return this._utilsService.getCodeDefinitionByIdByLang(id, codeDefinitionList, this.lang)
  }

  private _resetControlValues(controlNames: string[]) {
    for (let i = 0; i < controlNames.length; i++) {
      this._utilsService.resetControlsValues(this.regulartoryInfoForm.controls[controlNames[i]]);
    }
  }
}