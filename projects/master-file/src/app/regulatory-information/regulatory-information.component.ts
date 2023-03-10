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
  ViewChildren,
} from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ICodeDefinition, ICode, IParentChildren } from '../shared/data';
import { ControlMessagesComponent } from '../error-msg/control-messages.component/control-messages.component';
import { GlobalsService } from '../globals/globals.service';
import { FormGroup } from '@angular/forms';
import { RegulatoryInformationService } from './regulatory-information.service';
import { Ectd } from '../models/transaction';

@Component({
  selector: 'app-regulatory-information',
  templateUrl: './regulatory-information.component.html',
  styles: [],
})
export class RegulatoryInformationComponent implements OnInit, OnDestroy {
  public mfDetailsFormLocalModel: FormGroup; // todo rename variable
  @Input('group') public mfDetailsFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() dataModel: Ectd;
  @Input() lang;
  @Input() helpIndex;
  @Output() errorList = new EventEmitter(true);
  @Output() isSolicitedFlag = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent)
  msgList: QueryList<ControlMessagesComponent>;

  yesNoList: string[] = GlobalsService.YESNOList;
  mfTypeOptions: ICodeDefinition[];
  mfTypeDescArray: IParentChildren[] = [];
  txDescOptions: ICode[];
  selectedMfTypeDefinition: string;
  selectedTxDescDefinition: string;
  public showFieldErrors: boolean = false;
  public showDateAndRequester: boolean = false;
  mfTypeSub!: Subscription;
  mfTypeTxDescSub!: Subscription;

  showDateAndRequesterTxDescs: string[] = ['12', '13', '14']; // Transaction Description values are defined in txDescriptions.json
  filter;
  constructor(private _regulatoryInfoService: RegulatoryInformationService) {
    this.showFieldErrors = false;
    this.mfDetailsFormLocalModel = _regulatoryInfoService.getRegularInfoForm();
  }

  ngOnInit(): void {
    console.log('ngOnInit ~ yesNoList', this.yesNoList);

    this.mfTypeSub = this._regulatoryInfoService
      .getMasterFileTypes()
      .subscribe((response) => (this.mfTypeOptions = response));

    this.mfTypeTxDescSub = this._regulatoryInfoService
      .getMasterFileTypeAndTransactionDescription()
      .subscribe((response) => (this.mfTypeDescArray = response));
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
    // since we can't detect changes on objects, using a separate flag
    // if (changes['detailsChanged']) {
    //   // used as a change indicator for the model
    //   // console.log("the details cbange");
    //   if (this.mfDetailsFormRecord) {
    //     this.setToLocalModel();
    //   } else {
    //     this.mfDetailsFormLocalModel = this.detailsService.getReactiveModel(
    //       this._fb
    //     );
    //     this.mfDetailsFormLocalModel.markAsPristine();
    //   }
    // }
    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
      console.log(
        'MasterFileDetailsComponent ~ ngOnChanges ~ this.showFieldErrors',
        this.showFieldErrors
      );
      const temp = [];
      if (this.msgList) {
        this.msgList.forEach((item) => {
          temp.push(item);
          // console.log(item);
        });
      }
      this.errorList.emit(temp);
    }
    if (changes['mfDetailsFormLocalModel']) {
      //?????????
      // console.log('**********the master-file details changed');
      this.mfDetailsFormRecord = this.mfDetailsFormLocalModel;
    }
    if (changes['dataModel']) {
      console.log('**********the dataModel changed');
      const dataModelCurrentValue = changes['dataModel'].currentValue as Ectd;
      // if (!this.mfDetailsFormLocalModel) {
      //   this.mfDetailsFormLocalModel = this.detailsService.getReactiveModel(
      //     this._fb
      //   );
      //   this.mfDetailsFormLocalModel.markAsPristine();
      // }
      this._regulatoryInfoService.mapDataModelToFormModel(
        dataModelCurrentValue,
        <FormGroup>this.mfDetailsFormLocalModel,
        this.lang
      );
      // this._updateLists();
      // this._setDescFieldFlags(
      //   this.mfDetailsFormLocalModel.controls['descriptionType'].value
      // );
    }
    //   if (changes['userList']) {
    //     this.userList = changes['userList'].currentValue;
    //   }
  }

  ngOnDestroy() {
    // unsubscribe the subscription(s)
    this.mfTypeSub.unsubscribe();
    this.mfTypeTxDescSub.unsubscribe();
  }

  onblur() {
    // console.log('onblur');
    this._saveData();
  }

  onMfTypeSelected(e: any): void {
    const mfTypeControl = this.mfDetailsFormLocalModel.get('masterFileType');
    // todo check lang for defEn/defFr
    this.selectedMfTypeDefinition = mfTypeControl?.value.defEn;
    // console.log(selectedMfTypeDefinition.value);
    const selectedMfTypeId = mfTypeControl?.value.id;
    const filteredMfTypeDescArray = this.mfTypeDescArray.filter(
      (x) => x.parentId === selectedMfTypeId
    );
    //    console.log(
    //      'onMfTypeSelected ~ filteredMfTypeDescArray',
    //      filteredMfTypeDescArray
    // );

    this.txDescOptions = filteredMfTypeDescArray[0]['children'];
    this._saveData();
  }

  onTxDescriptionSelected(e: any): void {
    const txDescControl = this.mfDetailsFormLocalModel.get('descriptionType');
    // console.log(txDescControl.value);
    // todo check lang for defEn/defFr
    this.selectedTxDescDefinition = txDescControl?.value.defEn;
    this.showDateAndRequester = this.showDateAndRequesterTxDescs.includes(
      txDescControl?.value.id
    );
    this._saveData();
  }

  descrDeviceOnblur() {
    console.log('descrDeviceOnblur ~ descrDeviceOnblur');
    const descValue =
      this.mfDetailsFormLocalModel.controls['descriptionType'].value;
    // this._updateReasonArray();
    // this._setDescFieldFlags(descValue);
    // this._resetReasonValues();
    this.onblur();
  }

  descrDeviceOnClick() {
    console.log('descrDeviceOnClick ~ descrDeviceOnClick');
  }

  descrDeviceOnSelected() {
    console.log('descrDeviceOnSelected ~ descrDeviceOnSelected');
  }

  private _saveData() {
    this._regulatoryInfoService.mapFormModelToDataModel(
      <FormGroup>this.mfDetailsFormLocalModel,
      this.dataModel,
      this.lang
    );
  }
}
