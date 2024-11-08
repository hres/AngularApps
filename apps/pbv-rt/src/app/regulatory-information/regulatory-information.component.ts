import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation, computed, signal, inject, viewChild} from '@angular/core';
import { ICodeDefinition, ICode, UtilsService, BaseComponent, ControlMessagesComponent, HelpSequence, LoggerService } from '@hpfb/sdk/ui';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RegulatoryInformationService } from './regulatory-information.service';
import { LifecycleRecord, TransactionEnrol } from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { AppSignalService } from '../signal/app-signal.service';
import { TransactionDetailsComponent } from '../transaction-details/transaction-details.component';
import { DOSSIER_TYPE } from '../app.constants';

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

  private tranDetailsChild = viewChild("transactionDetailsChild", {
    read: TransactionDetailsComponent
  });

  private _signalService = inject(AppSignalService)
  private _logger = inject(LoggerService)

  readonly selectedDossierTypeSignal = this._signalService.getSelectedDossierType();

  readonly selectedDossierTypeDefinition = computed(() => {
    return this._getCodeDefinition(this._globalService.dossierTypes, this.selectedDossierTypeSignal());
  });

  isPharmaBio = computed(() => {
    return this.selectedDossierTypeSignal() === DOSSIER_TYPE.PHARMACEUTICAL_HUMAN || this.selectedDossierTypeSignal() === DOSSIER_TYPE.BIOLOGIC_HUMAN;
  });

  isPharmaBioVet = computed(() => {
    return this.selectedDossierTypeSignal() === DOSSIER_TYPE.PHARMACEUTICAL_HUMAN || this.selectedDossierTypeSignal() === DOSSIER_TYPE.BIOLOGIC_HUMAN || this.selectedDossierTypeSignal() === DOSSIER_TYPE.VETERINARY;
  });

  adminSubmissionSelected = signal('');
  isAdminSubmission = computed(() => {
    return this.adminSubmissionSelected() === 'Y';
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
    this.errorList.emit(errors);
  }

  processTransactionDetailsErrors(childErrors) {
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
      }
    }
  }

  onDossierTypeSelected(selectedDossierTypeId: string) {
    this._logger.log(this._globalService.debugEnabled, 'RegulatoryInformationComponent', 'onDossierTypeSelected',  `dossier type id: ${selectedDossierTypeId}`);
    this._signalService.setSelectedDossierType(selectedDossierTypeId)
  }

  onAdminSubmissionSelected(e:any) {
    this.adminSubmissionSelected.set(this.regulartoryInfoForm.get("isAdminSubmission")?.value);
    const valuesToReset = ['adminSubType'];
    this._resetControlValues(valuesToReset);
    this.selectedAdminSubTypeDefinition = '';
  }

  onAdminSubTypeSelected(selectedAdminSubTypeId: string) {
    this.selectedAdminSubTypeDefinition = this._getCodeDefinition(this.adminSubTypeOptions, selectedAdminSubTypeId);
  }

  getFormValue() {
    const regInfoFormValues = this.regulartoryInfoForm.value;
    const tranDetailsFormValues = this.tranDetailsChild().getFormValue();

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