import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation, computed, signal, inject, viewChild, Signal, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { ICodeDefinition, ICode, UtilsService, BaseComponent, ControlMessagesComponent, HelpSequence, LoggerService } from '@hpfb/sdk/ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegulatoryInformationService } from './regulatory-information.service';
import { LifecycleRecord, TransactionEnrol } from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { AppSignalService } from '../signal/app-signal.service';
import { TransactionDetailsComponent } from '../transaction-details/transaction-details.component';
import { PbvValidationService } from '@hpfb/pbv';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-regulatory-information',
  templateUrl: './regulatory-information.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
  standalone: false
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
    private _utilsService: UtilsService, private _globalService: GlobalService, private _translateService : TranslateService) {
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
    const fixedErrors = errors.map(error => {
      if (error) {
          const translationKey = error?.label || '';
          const fieldLabel = this.getFieldLabel(translationKey);
          error.label = fieldLabel;
          error.currentError = 'This field is required';
      }
      return error;
  });
  errors = fixedErrors;
  this.errorList.emit(errors);
  }

  processTransactionDetailsErrors(childErrors) {
       // this._addressErrorList = childErrors;
        this.transactionDetailsErrors = (childErrors || []).map(error => {
          const translationKey = error?.label || '';
          const fieldLabel = this.getFieldLabel(translationKey);

          // Set both label and currentError
          error.label = fieldLabel;
          error.currentError = 'This field is required';

          return error;
      });
    this._appendErrorsFromChild(this.transactionDetailsErrors);
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

  private getFieldLabel(translationKey: string): string {
    if (!translationKey) return 'This field';

    // Use the translation service to get the actual label
    const translated = this._translateService.instant(translationKey);

    // If translation returns the key itself, it means translation is not available
    if (translated === translationKey) {
        // Fallback: extract from key
        let cleanLabel = translationKey;
        if (cleanLabel.includes('.')) {
            const parts = cleanLabel.split('.');
            let lastPart = parts[parts.length - 1];
            lastPart = lastPart.replace(/([A-Z])/g, ' $1').trim();
            cleanLabel = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
        }
        return cleanLabel || 'This field';
    }

    return translated;
}


  /**
   * Override _appendErrorsFromChild to ensure all errors have messages
   */
  protected override _appendErrorsFromChild(errorList: any[]) {
    const allErrors = errorList.map(error => {
        const translationKey = error?.label || '';
        const fieldLabel = this.getFieldLabel(translationKey);
        error.label = fieldLabel;
        error.currentError = 'This field is required';
        return error;
    });

    this.emitErrors(allErrors);
  }

}