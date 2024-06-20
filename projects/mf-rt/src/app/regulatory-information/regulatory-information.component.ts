import {
  AfterViewInit,
  ChangeDetectorRef,
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
  signal
} from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ControlMessagesComponent, ICodeDefinition, ICodeAria, ICode, IParentChildren, EntityBaseService, UtilsService, ErrorModule, PipesModule, HelpIndex } from '@hpfb/sdk/ui';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RegulatoryInformationService } from './regulatory-information.service';
import { Ectd } from '../models/transaction';
import { GlobalService } from '../global/global.service';

@Component({
  selector: 'app-regulatory-information',
  templateUrl: './regulatory-information.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class RegulatoryInformationComponent implements OnInit, OnDestroy, AfterViewInit {
  lang: string;
  helpIndex: HelpIndex; 

  public regulartoryInfoForm: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() dataModel: Ectd;
  @Output() errorList = new EventEmitter(true);
  @Output() trDescUpdated = new EventEmitter();
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  mfTypeOptions: ICodeAria[] = [];
  mfTypeDescArray: IParentChildren[] = [];
  mfRevisedTypeDescArray: IParentChildren[] = [];
  mfUseOptions: ICode[] = [];
  txDescOptions: ICode[];
  revTxDescOptions: ICode[];
  descriptionTypeList: ICodeDefinition[];
  selectedMfTypeDefinition: string;
  selectedTxDescDefinition: string;
  public yesNoList: ICode[] = [];
  public showFieldErrors: boolean = false;
    
  txDescRquireRevise: string = '13';

  // writable signal for the answer of "Transaction Description" field
  readonly selectedTxDescSignal = signal<string>('');
  // computed signal for rendering of the "Date of Request" and "Requester of solicited information" fields
  showDateAndRequester = computed(() => {
    return this._regulatoryInfoService.showDateAndRequesterTxDescs.includes(this.selectedTxDescSignal());
  });
  // computed signal for rendering of the "Did the Clarification Request require you to revise the Transaction Description?" field
  showReqRevisedTxDesc = computed(() => {
    return this.txDescRquireRevise === this.selectedTxDescSignal();
  });
  // writable signal for the answer of "Did the Clarification Request require you to revise the Transaction Description?" field
  selectedReqRevisionSignal = signal('');
  // computed signal for rendering of the "Revised Transaction Description" fields
  showRevisedTxDesc = computed(() => {
    return this.showReqRevisedTxDesc() && this.selectedReqRevisionSignal() === 'Y'
  });

  constructor(private _regulatoryInfoService: RegulatoryInformationService, private _fb: FormBuilder, 
    private _utilsService: UtilsService, private _globalService: GlobalService) {
    this.showFieldErrors = false;
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    
    if (!this.regulartoryInfoForm) {
      this.regulartoryInfoForm = RegulatoryInformationService.getRegularInfoForm(this._fb);
    }

    this.descriptionTypeList = this._globalService.txDescs;
    this.mfTypeOptions = this._globalService.mfTypes;
    this.mfTypeDescArray = this._globalService.mfTypeTxDescs;
    this.mfRevisedTypeDescArray = this._globalService.mfRevisedTypeDescs;
    this.mfUseOptions = this._globalService.mfUses;
    this.yesNoList = this._globalService.yesnoList;
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe((errorObjs) => {
      const temp = [];
      this._updateErrorList(errorObjs);
    });
    this.msgList.notifyOnChanges();
  }

  private _updateErrorList(errorObjs) {
    const temp = [];
    if (errorObjs) {
      errorObjs.forEach((error) => {
        temp.push(error);
      });
    }
    this.errorList.emit(temp);
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);
    // console.log("RegulatoryInformationComponent ~ ngOnChanges ~ isFirstChange:", isFirstChange);
    // Ignore first trigger of ngOnChanges
    if (!isFirstChange) {
      if (changes['showErrors']) {
        this.showFieldErrors = changes['showErrors'].currentValue;
        // console.log(
        //   'MasterFileDetailsComponent ~ ngOnChanges ~ this.showFieldErrors',
        //   this.showFieldErrors
        // );
        const temp = [];
        if (this.msgList) {
          this.msgList.forEach((item) => {
            temp.push(item);
            // console.log(item);
          });
        }
        this.errorList.emit(temp);
      }
      if (changes['dataModel']) {
        const dataModelCurrentValue = changes['dataModel'].currentValue as Ectd;
        // if (!this.regulartoryInfoForm) {
        //   this.regulartoryInfoForm = this.detailsService.getReactiveModel(
        //     this._fb
        //   );
        //   this.regulartoryInfoForm.markAsPristine();
        // }
        this._regulatoryInfoService.mapDataModelToFormModel(
          dataModelCurrentValue,
          <FormGroup>this.regulartoryInfoForm,);

        this.onMfTypeSelected(null);
        this.onTxDescriptionSelected(null);
        this.reqRevisionChanged(null);
      }
    }
  }

  ngOnDestroy() {
  }

  onMfTypeSelected(e: any): void {
    const codeDefinition = this._utilsService.findCodeDefinitionById(this.mfTypeOptions, this.selectedMfTypeId);
    this.selectedMfTypeDefinition = this._utilsService.getCodeDefinitionByLang(codeDefinition, this.lang);

    // get the transaction description dropdown list
    this._getTransactionDescriptions(this.selectedMfTypeId);
  }

  onTxDescriptionSelected(e: any): void {
    const selectedTxDescId = this.regulartoryInfoForm.get('descriptionType').value;
    this.selectedTxDescDefinition = this._utilsService.getCodeDefinitionByIdByLang(selectedTxDescId, this.descriptionTypeList, this.lang);
    // console.log(this.selectedTxDescDefinition);
    this.selectedTxDescSignal.set(selectedTxDescId);

    if (!this.showDateAndRequester()) {
      console.log('reset request date and requester fields when transaction description does not require them');
      const valuesToReset = ['requestDate', 'requester'];
      this._resetControlValues(valuesToReset);
    }

    if (!this.showReqRevisedTxDesc()) {
      console.log('reset reqRevision and revised transaction description fields if transaction description is not 13');
      const valuesToReset = ['reqRevision', 'revisedDescriptionType'];
      this._resetControlValues(valuesToReset);
    }

    if (!this.showReqRevisedTxDesc()) {
      console.log('reset revised transaction description if reqRevision is No');
      const valuesToReset = ['revisedDescriptionType'];
      this._resetControlValues(valuesToReset);
    }

    if (e) {
      // when the action is triggered from the UI
      this.trDescUpdated.emit(selectedTxDescId);
    }
  }

  reqRevisionChanged(e:any):void {
    this.selectedReqRevisionSignal.set(this.reqRevision?.value);
    if (this.showRevisedTxDesc()) {
      this._getRevisedTransactionDescriptions(this.selectedMfTypeId);
    } else {
      const valuesToReset = ['revisedDescriptionType'];
      this._resetControlValues(valuesToReset);
    }
  }

  // dynamically load the transaction description dropdowns according to the master type value
  private _getTransactionDescriptions(mfTypeId: string): void {
    this.txDescOptions = this._utilsService.filterParentChildrenArray(this.mfTypeDescArray, mfTypeId);
  }

  private _getRevisedTransactionDescriptions(mfTypeId: string): void {
    this.revTxDescOptions = this._utilsService.filterParentChildrenArray(this.mfRevisedTypeDescArray, mfTypeId);
  }

  checkDateValidity(event: any): void {
    this._utilsService.checkInputValidity(event, this.regulartoryInfoForm.get('requestDate'), 'invalidDate');
  }

  get reqRevision() {
    return this.regulartoryInfoForm.get("reqRevision") as FormGroup;
  }

  get selectedMfTypeId() {
    return this.regulartoryInfoForm.get('masterFileType').value;
  }

  private _resetControlValues(listOfValues : string[]) {
    for (let i = 0; i < listOfValues.length; i++) {
      this._utilsService.resetControlsValues(this.regulartoryInfoForm.controls[listOfValues[i]]);
    }
  }
}
