import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren, ViewEncapsulation,
  computed,
  signal,
  inject,
  Signal,
  input,
  viewChild,
  effect
} from '@angular/core';
import { ICodeDefinition, ICodeAria, ICode, IParentChildren, EntityBaseService, UtilsService, ErrorModule, PipesModule, HelpIndex, BaseComponent, ControlMessagesComponent } from '@hpfb/sdk/ui';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
  helpIndex: HelpIndex; 

  public regulartoryInfoForm: FormGroup;
  // @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() dataModel: TransactionEnrol;
  @Output() errorList = new EventEmitter(true);
  // @Output() trDescUpdated = new EventEmitter();

  public lifecycleRecordModel: LifecycleRecord;

  dossierTypeOptions: ICodeDefinition[] = [];
  adminSubTypeOptions: ICode[] = [];
  // mfTypeDescArray: IParentChildren[] = [];
  // mfRevisedTypeDescArray: IParentChildren[] = [];
  // mfUseOptions: ICode[] = [];
  // txDescOptions: ICode[];
  // revTxDescOptions: ICode[];
  // descriptionTypeList: ICodeDefinition[];
  selectedDossierTypeDefinition: string;
  // selectedTxDescDefinition: string;
  public yesNoList: ICode[] = [];
  public showFieldErrors: boolean = false;

  private tranDetailsChild = viewChild("transactionDetailsChild", {
    read: TransactionDetailsComponent
  });

  // // writable signal for the answer of "Transaction Description" field
  // readonly selectedTxDescSignal = signal<string>('');

  // // computed signal for rendering of the "Did the Clarification Request require you to revise the Transaction Description?" field
  // showReqRevisedTxDesc = computed(() => {
  //   return this.txDescRquireRevise === this.selectedTxDescSignal();
  // });
  // // writable signal for the answer of "Did the Clarification Request require you to revise the Transaction Description?" field
  // selectedReqRevisionSignal = signal('');
  // // computed signal for rendering of the "Revised Transaction Description" fields
  // showRevisedTxDesc = computed(() => {
  //   return this.showReqRevisedTxDesc() && this.selectedReqRevisionSignal() === 'Y'
  // });

  private _signalService = inject(AppSignalService)

  readonly selectedDossierTypeSignal = this._signalService.getSelectedDossierType();
  isPharmaBio = computed(() => {
    return this.selectedDossierTypeSignal() === DOSSIER_TYPE.PHARMACEUTICAL_HUMAN || this.selectedDossierTypeSignal() === DOSSIER_TYPE.BIOLOGIC_HUMAN;
  });
  dossierTypeSelected = computed(() => {
    return this.selectedDossierTypeSignal() === DOSSIER_TYPE.PHARMACEUTICAL_HUMAN || this.selectedDossierTypeSignal() === DOSSIER_TYPE.BIOLOGIC_HUMAN || this.selectedDossierTypeSignal() === DOSSIER_TYPE.VETERINARY;
  });

  adminSubmissionSelected = signal('');
  isAdminSubmission = computed(() => {
    return this.adminSubmissionSelected() === 'Y';
  });

  selectedAdminSubType: string = '';

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

    // this.descriptionTypeList = this._globalService.txDescs;
    this.dossierTypeOptions = this._globalService.dossierTypes;
    // this.mfTypeDescArray = this._globalService.mfTypeTxDescs;
    // this.mfRevisedTypeDescArray = this._globalService.mfRevisedTypeDescs;
    // this.mfUseOptions = this._globalService.mfUses;
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
    // console.log("RegulatoryInformationComponent ~ ngOnChanges ~ isFirstChange:", isFirstChange);
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

        // this.onMfTypeSelected(null);
        // this.onTxDescriptionSelected(null);
        // this.reqRevisionChanged(null);
      }
    }
  }

  onDossierTypeSelected(selectedDossierTypeId: string) {
    // console.log('Selected dossier type id:', selectedDossierTypeId);
    this._signalService.setSelectedDossierType(selectedDossierTypeId)
    const codeDefinition = this._utilsService.findCodeDefinitionById(this.dossierTypeOptions, selectedDossierTypeId);
    this.selectedDossierTypeDefinition = this._utilsService.getCodeDefinitionByLang(codeDefinition, this.lang);

  //   // get the transaction description dropdown list
  //   this._getTransactionDescriptions(this.selectedMfTypeId);

  //   if (this.showRevisedTxDesc()) {
  //     this._getRevisedTransactionDescriptions(this.selectedMfTypeId);
  //   } else {
  //     const valuesToReset = ['revisedDescriptionType'];
  //     this._resetControlValues(valuesToReset);
  //   }
  }

  onAdminSubmissionSelected(e:any) {
    this.adminSubmissionSelected.set(this.regulartoryInfoForm.get("isAdminSubmission")?.value);
    const valuesToReset = ['adminSubType'];
    this._resetControlValues(valuesToReset);
    this.selectedAdminSubType = '';
  }

  onAdminSubTypeSelected(e:any) {
    this.selectedAdminSubType = this.regulartoryInfoForm.get("adminSubType").value;
  }

  // onTxDescriptionSelected(e: any): void {
  //   const selectedTxDescId = this.regulartoryInfoForm.get('descriptionType').value;
  //   this.selectedTxDescDefinition = this._utilsService.getCodeDefinitionByIdByLang(selectedTxDescId, this.descriptionTypeList, this.lang);
  //   // console.log(this.selectedTxDescDefinition);
  //   this.selectedTxDescSignal.set(selectedTxDescId);

  //   if (!this.showDateAndRequester()) {
  //     // console.log('reset request date and requester fields when transaction description does not require them');
  //     const valuesToReset = ['requestDate', 'requester'];
  //     this._resetControlValues(valuesToReset);
  //   }

  //   if (!this.showReqRevisedTxDesc()) {
  //     // console.log('reset reqRevision and revised transaction description fields if transaction description is not 13');
  //     const valuesToReset = ['reqRevision', 'revisedDescriptionType'];
  //     this._resetControlValues(valuesToReset);
  //   }

  //   if (!this.showReqRevisedTxDesc()) {
  //     // console.log('reset revised transaction description if reqRevision is No');
  //     const valuesToReset = ['revisedDescriptionType'];
  //     this._resetControlValues(valuesToReset);
  //   }

  //   if (e) {
  //     // when the action is triggered from the UI
  //     this.trDescUpdated.emit(selectedTxDescId);
  //   }
  // }

  // reqRevisionChanged(e:any):void {
  //   this.selectedReqRevisionSignal.set(this.reqRevision?.value);
  //   if (this.showRevisedTxDesc()) {
  //     this._getRevisedTransactionDescriptions(this.selectedMfTypeId);
  //   } else {
  //     const valuesToReset = ['revisedDescriptionType'];
  //     this._resetControlValues(valuesToReset);
  //   }
  // }

  // // dynamically load the transaction description dropdowns according to the master type value
  // private _getTransactionDescriptions(mfTypeId: string): void {
  //   this.txDescOptions = this._utilsService.filterParentChildrenArray(this.mfTypeDescArray, mfTypeId);
  // }

  // private _getRevisedTransactionDescriptions(mfTypeId: string): void {
  //   this.revTxDescOptions = this._utilsService.filterParentChildrenArray(this.mfRevisedTypeDescArray, mfTypeId);
  // }

  // get reqRevision() {
  //   return this.regulartoryInfoForm.get("reqRevision") as FormGroup;
  // }

  // get selectedMfTypeId() {
  //   return this.regulartoryInfoForm.get('masterFileType').value;
  // }

  getFormValue() {
    const regInfoFormValues = this.regulartoryInfoForm.value;
    const tranDetailsFormValues = this.tranDetailsChild().getFormValue();

    return { ...regInfoFormValues, ...tranDetailsFormValues };
  }

  private _resetControlValues(controlNames: string[]) {
    for (let i = 0; i < controlNames.length; i++) {
      this._utilsService.resetControlsValues(this.regulartoryInfoForm.controls[controlNames[i]]);
    }
  }

}