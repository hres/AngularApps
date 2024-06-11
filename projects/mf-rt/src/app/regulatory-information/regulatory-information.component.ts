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
  model
} from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ControlMessagesComponent, ICodeDefinition, ICodeAria, ICode, IParentChildren, EntityBaseService, UtilsService, ErrorModule, PipesModule } from '@hpfb/sdk/ui';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RegulatoryInformationService } from './regulatory-information.service';
import { Ectd } from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Orientation, RadioButton } from "../radio-button/radio-button";

@Component({
    selector: 'app-regulatory-information',
    standalone: true,
    templateUrl: './regulatory-information.component.html',
    styles: [],
    encapsulation: ViewEncapsulation.None,
    providers: [UtilsService, EntityBaseService, RegulatoryInformationService],
    imports: [CommonModule, TranslateModule, ReactiveFormsModule, ErrorModule, PipesModule, RadioButton]
})
export class RegulatoryInformationComponent implements OnInit, OnDestroy, AfterViewInit {
  lang: string;
  helpIndex: { [key: string]: number }; 

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
  public showDateAndRequester: boolean = false;
  public showReqRevisedTxDesc: boolean = false;
  public showRevisedTxDesc: boolean = false;
  public showContactFees: boolean[] = [true, true];

  orientation2: Orientation = 'horizontal';
  selectedValue: string = '';

  readonly aaaTxDescValue = model<string>();

  showDateAndRequesterOnlyTxDescs: string[] = ['12', '14']; //Contact Information section is not shown for these Transaction Descriptions.
  txDescRquireRevise: string = '13';
  noFeeTxDescs: string[] = ['1', '3', '5', '8', '9', '12', '14', '20'];

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

    //change the revised list as well
    this.showRevisedTxDesc =( this.regulartoryFormModel.get("reqRevision")?.value === 'Y');
    if (this.showRevisedTxDesc){
      this._getRevisedTransactionDescriptions();
    }

    if (e) {
      // when the action is triggered from the UI
      this._saveData();
    }
  }

  onTxDescriptionSelected(e: any): void {
    console.log('onTxDescriptionSelected==>', e)
    const selectedTxDescId = this.regulartoryFormModel.get('descriptionType').value;
    this.selectedTxDescDefinition = this._utilsService.getCodeDefinitionByIdByLang(selectedTxDescId, this.descriptionTypeList, this.lang);
    // console.log(this.selectedTxDescDefinition);

    this.showDateAndRequester = this._regulatoryInfoService.showDateAndRequesterTxDescs.includes(
      selectedTxDescId
    );
      // converted to signal, delete later
    this.showContactFees[0] = !this.showDateAndRequesterOnlyTxDescs.includes(
      selectedTxDescId
    );
    this.showContactFees[1] = !this.noFeeTxDescs.includes(
      selectedTxDescId
    );

    this.aaaTxDescValue.set(e);   // set the signal

    this.showReqRevisedTxDesc = (this.txDescRquireRevise===selectedTxDescId);
    if (this.showReqRevisedTxDesc) {
      this.showRevisedTxDesc =( this.regulartoryFormModel.get("reqRevision")?.value === 'Y');
      if (this.showRevisedTxDesc){this._getRevisedTransactionDescriptions();}
    } else {
      // todo reset fields based on the condition
      // this._utilsService.resetControlsValues(this.regulartoryFormModel.get("reqRevision"), )
    }


    if (e) {
      // when the action is triggered from the UI
      // reset requestDate and requester fields values
      this._utilsService.resetControlsValues(this.regulartoryFormModel.controls['requestDate'], this.regulartoryFormModel.controls['requester']);
      this._utilsService.resetControlsValues(this.regulartoryFormModel.controls['reqRevision'], this.regulartoryFormModel.controls['revisedDescriptionType']);

      this.trDescUpdated.emit(this.showContactFees);
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
    console.log("mmmmmmmmmmmmm", e);
    this._getRevisedTransactionDescriptions();
    // const reqRevisionControl = this.regulartoryFormModel.get("reqRevision");
    // this.showRevisedTxDesc = (reqRevisionControl?.value === 'Y');
    this.showRevisedTxDesc = e === 'Y'

    // this.regulartoryFormModel.controls['reqRevision'].setValue(null);
    // this.regulartoryFormModel.controls['reqRevision'].setValue(e.target.value);
    // if (e.target.value && e.target.value === 'Y') {
    //   this.showRevisedTxDesc = true;

    // } else {
    //   this.showRevisedTxDesc = false;
    //   this._utilsService.resetControlsValues(this.regulartoryFormModel.controls['revisedDescriptionType']);
    // }
    if (!this.showRevisedTxDesc) {
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

}
