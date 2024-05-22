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
  ViewChildren, ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ICodeDefinition, ICodeAria, ICode, IParentChildren } from '../shared/data';
import { ControlMessagesComponent } from '../error-msg/control-messages.component/control-messages.component';
import { GlobalsService } from '../globals/globals.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RegulatoryInformationService } from './regulatory-information.service';
import { Ectd } from '../models/transaction';

@Component({
  selector: 'app-regulatory-information',
  templateUrl: './regulatory-information.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class RegulatoryInformationComponent implements OnInit, OnDestroy {
  public regulartoryFormModel: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() dataModel: Ectd;
  @Input() lang;
  @Input() helpIndex;
  @Output() errorList = new EventEmitter(true);
  @Output() trDescUpdated = new EventEmitter();
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  mfTypeOptions: ICodeAria[];
  mfTypeDescArray: IParentChildren[] = [];
  mfRevisedTypeDescArray: IParentChildren[] = [];
  mfUseOptions: ICode[];
  txDescOptions: ICode[];
  revTxDescOptions: ICode[];
  descriptionTypeList: ICodeDefinition[];
  selectedMfTypeDefinition: string;
  selectedTxDescDefinition: string;
  public showFieldErrors: boolean = false;
  public showDateAndRequester: boolean = false;
  public showReqRevisedTxDesc: boolean = false;
  public showRevisedTxDesc: boolean = false;
  public showContactFees: boolean[] = [true, true];
  mfTypeSub!: Subscription;
  mfTypeTxDescSub!: Subscription;
  mfRevisedTypeTxDescSub!: Subscription;
  mfUseSub!: Subscription;
  txDescSub!: Subscription;

  showDateAndRequesterOnlyTxDescs: string[] = ['12', '14']; //Contact Information section is not shown for these Transaction Descriptions.
  txDescRquireRevise: string = '13';
  noFeeTxDescs: string[] = ['1', '3', '5', '8', '9', '12', '14', '20'];


  constructor(private _regulatoryInfoService: RegulatoryInformationService, private _fb: FormBuilder) {
    this.showFieldErrors = false;
  }

  ngOnInit(): void {
    if (!this.regulartoryFormModel) {
      this.regulartoryFormModel = RegulatoryInformationService.getRegularInfoForm(this._fb);
    }

    this.txDescSub = this._regulatoryInfoService.getTxDescriptions().subscribe(response => {
      // this console log can be used to debug the loaded Transaction Descriptions' values and orders
      // console.log(response);
      this.descriptionTypeList = response});

    this.mfTypeSub = this._regulatoryInfoService
      .getMasterFileTypes()
      .subscribe((response) => (this.mfTypeOptions = response));

    this.mfTypeTxDescSub = this._regulatoryInfoService
      .getMasterFileTypeAndTransactionDescription()
      .subscribe((response) => (this.mfTypeDescArray = response));

    this.mfRevisedTypeTxDescSub = this._regulatoryInfoService
      .getMasterFileRevisedTypeAndTransactionDescription()
      .subscribe((response) => (this.mfRevisedTypeDescArray = response));

    this.mfUseSub = this._regulatoryInfoService
      .getMasterFileUses()
      .subscribe((response) => (this.mfUseOptions = response));
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
    const isFirstChange = GlobalsService.isFirstChange(changes);
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
    // unsubscribe the subscription(s)
    this.mfTypeSub.unsubscribe();
    this.mfTypeTxDescSub.unsubscribe();
    this.mfRevisedTypeTxDescSub.unsubscribe();
    this.mfUseSub.unsubscribe();
    this.txDescSub.unsubscribe();
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
    const mfTypeControl = this.regulartoryFormModel.get('masterFileType');
    this.selectedMfTypeDefinition = GlobalsService.getCodeDefinitionByLang(mfTypeControl?.value, this.lang);

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
    const selectedTxDescId = this.regulartoryFormModel.get('descriptionType').value;
    this.selectedTxDescDefinition = GlobalsService.getCodeDefinitionByIdByLang(selectedTxDescId, this.descriptionTypeList, this.lang);
    // console.log(this.selectedTxDescDefinition);

    this.showDateAndRequester = this._regulatoryInfoService.showDateAndRequesterTxDescs.includes(
      selectedTxDescId
    );

    this.showContactFees[0] = !this.showDateAndRequesterOnlyTxDescs.includes(
      selectedTxDescId
    );
    this.showContactFees[1] = !this.noFeeTxDescs.includes(
      selectedTxDescId
    );

    this.showReqRevisedTxDesc = (this.txDescRquireRevise===selectedTxDescId);
    this.showRevisedTxDesc =( this.regulartoryFormModel.get("reqRevision")?.value === 'Y');
    if (this.showRevisedTxDesc){this._getRevisedTransactionDescriptions();}

    if (e) {
      // when the action is triggered from the UI
      // reset requestDate and requester fields values
      GlobalsService.resetControlValue(this.regulartoryFormModel.controls['requestDate'], this.regulartoryFormModel.controls['requester']);
      GlobalsService.resetControlValue(this.regulartoryFormModel.controls['reqRevision'], this.regulartoryFormModel.controls['revisedDescriptionType']);

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

    this._getRevisedTransactionDescriptions();
    const reqRevisionControl = this.regulartoryFormModel.get("reqRevision");
    this.showRevisedTxDesc = (reqRevisionControl?.value === 'Y');

    this.regulartoryFormModel.controls['reqRevision'].setValue(null);
    this.regulartoryFormModel.controls['reqRevision'].setValue(e.target.value);
    if (e.target.value && e.target.value === 'Y') {
      this.showRevisedTxDesc = true;

    } else {
      this.showRevisedTxDesc = false;
      GlobalsService.resetControlValue(this.regulartoryFormModel.controls['revisedDescriptionType']);
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
    const selectedMfTypeId = mfTypeControl?.value.id;
    //console.log("RegulatoryInformationComponent ~ _getTransactionDescriptions ~ selectedMfTypeId:", selectedMfTypeId);

    this.txDescOptions = GlobalsService.filterParentChildrenArray(this.mfTypeDescArray, selectedMfTypeId);
  }

  private _getRevisedTransactionDescriptions(): void {
    const mfTypeControl = this.regulartoryFormModel.get('masterFileType');
    const selectedMfTypeId= mfTypeControl?.value.id;

    this.revTxDescOptions = GlobalsService.filterParentChildrenArray(this.mfRevisedTypeDescArray, selectedMfTypeId);
  }


  checkDateValidity(event: any): void {
    GlobalsService.checkInputValidity(event, this.regulartoryFormModel.get('requestDate'), 'invalidDate');
  }

}
