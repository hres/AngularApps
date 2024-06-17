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
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-regulatory-information',
  templateUrl: './regulatory-information.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class RegulatoryInformationComponent implements OnInit, OnDestroy, AfterViewInit {
  lang: string;
  helpIndex: HelpIndex; 

  public regulartoryFormModel: FormGroup;
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
    private _entityBaseService: EntityBaseService, private _utilsService: UtilsService, private _globalService: GlobalService) {
    this.showFieldErrors = false;
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    
    if (!this.regulartoryFormModel) {
      this.regulartoryFormModel = RegulatoryInformationService.getRegularInfoForm(this._fb);
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

    // since we can't detect changes on objects, using a separate flag
    // if (changes['detailsChanged']) {
    //   // used as a change indicator for the model
    //   // console.log("the details cbange");
    //   if (this.mfDetailsFormRecord) {
    //     this.setToLocalModel();
    //   } else {
    //     this.regulartoryFormModel = this.detailsService.getReactiveModel(
    //       this._fb
    //     );
    //     this.regulartoryFormModel.markAsPristine();
    //   }
    // }

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
      if (changes['regulartoryFormModel']) {
        //?????????
        // console.log('**********the master-file details changed');
        // this.mfDetailsFormRecord = this.regulartoryFormModel;
      }
      if (changes['dataModel']) {
        const dataModelCurrentValue = changes['dataModel'].currentValue as Ectd;
        // if (!this.regulartoryFormModel) {
        //   this.regulartoryFormModel = this.detailsService.getReactiveModel(
        //     this._fb
        //   );
        //   this.regulartoryFormModel.markAsPristine();
        // }
        this._regulatoryInfoService.mapDataModelToFormModel(
          dataModelCurrentValue,
          <FormGroup>this.regulartoryFormModel,
          this.lang
        );

        this.onMfTypeSelected(null);

        this.onTxDescriptionSelected(null);
      }
    }
  }

  ngOnDestroy() {
  }

  onblur() {
    // console.log('onblur');
    this._saveData();
  }

  // onblurMFName() {
  //   this.regulartoryFormModel.controls['masterFileName'].setValue(this.regulartoryFormModel.get('masterFileName').value.toUpperCase());
  //   this._saveData();
  // }

  onMfTypeSelected(e: any): void {
    const selectedMfTypeId = this.regulartoryFormModel.get('masterFileType').value;
    const codeDefinition = this._utilsService.findCodeDefinitionById(this.mfTypeOptions, selectedMfTypeId);
    this.selectedMfTypeDefinition = this._utilsService.getCodeDefinitionByLang(codeDefinition, this.lang);

    // get the transaction description dropdown list
    this._getTransactionDescriptions();

    if (e) {
      // when the action is triggered from the UI
      this._saveData();
    }
  }

  onTxDescriptionSelected(e: any): void {
    const selectedTxDescId = this.regulartoryFormModel.get('descriptionType').value;
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
      this._saveData();
    }
  }

  onRevTxDescriptionSelected(e: any): void {
//     const revTxDescControl = this.regulartoryFormModel.get('revisedDescriptionType').value;
    if (e) {
      // when the action is triggered from the UI
      this._saveData();
    }
  }



  reqRevisionChanged(e:any):void {

    // this._getRevisedTransactionDescriptions();
    // const reqRevisionControl = this.regulartoryFormModel.get("reqRevision");
    // this.showRevisedTxDesc = (reqRevisionControl?.value === 'Y');

    // this.regulartoryFormModel.controls['reqRevision'].setValue(null);
    // this.regulartoryFormModel.controls['reqRevision'].setValue(e.target.value);
    // if (e.target.value && e.target.value === 'Y') {
    //   this.showRevisedTxDesc = true;

    // } else {
    //   this.showRevisedTxDesc = false;
    //   this._utilsService.resetControlsValues(this.regulartoryFormModel.controls['revisedDescriptionType']);
    // }
    this.selectedReqRevisionSignal.set(this.reqRevision?.value);
    if (this.showRevisedTxDesc()) {
      console.log("reqRevision is Y, load revised transaction description")
      this._getRevisedTransactionDescriptions();
    } else {
      console.log("reqRevision is N, clear revised transaction description")
      this._utilsService.resetControlsValues(this.regulartoryFormModel.controls['revisedDescriptionType']);
    }
  }

  private _saveData() {
    this._regulatoryInfoService.mapFormModelToDataModel(
      <FormGroup>this.regulartoryFormModel,
      this.dataModel,
      this.lang, this.descriptionTypeList
    );
  }

  // dynamically load the transaction description dropdowns according to the master type value
  private _getTransactionDescriptions(): void {
    const mfTypeControl = this.regulartoryFormModel.get('masterFileType');
    const selectedMfTypeId = mfTypeControl?.value;
    console.log("RegulatoryInformationComponent ~ _getTransactionDescriptions ~ selectedMfTypeId:", selectedMfTypeId);

    this.txDescOptions = this._utilsService.filterParentChildrenArray(this.mfTypeDescArray, selectedMfTypeId);
  }

  private _getRevisedTransactionDescriptions(): void {
    const mfTypeControl = this.regulartoryFormModel.get('masterFileType');
    const selectedMfTypeId= mfTypeControl?.value;

    this.revTxDescOptions = this._utilsService.filterParentChildrenArray(this.mfRevisedTypeDescArray, selectedMfTypeId);
  }

  checkDateValidity(event: any): void {
    this._utilsService.checkInputValidity(event, this.regulartoryFormModel.get('requestDate'), 'invalidDate');
  }

  get reqRevision() {
    return this.regulartoryFormModel.get("reqRevision") as FormGroup;
  }

  private _resetControlValues(listOfValues : string[]) {
    for (let i = 0; i < listOfValues.length; i++) {
      this._utilsService.resetControlsValues(this.regulartoryFormModel.controls[listOfValues[i]]);
    }
  }
}
