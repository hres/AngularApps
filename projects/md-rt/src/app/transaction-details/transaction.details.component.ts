import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import { CheckboxOption, ControlMessagesComponent, ConverterService, ICode, UtilsService } from '@hpfb/sdk/ui';
import {TransactionDetailsService} from './transaction.details.service';
import { GlobalService } from '../global/global.service';
import { ActivityType, TransactionDesc } from '../app.constants';

@Component({
  selector: 'transaction-details',
  templateUrl: 'transaction.details.component.html',
  encapsulation: ViewEncapsulation.None

})

export class TransactionDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  public transDetailsFormLocalModel: FormGroup;
  // @Input('group') public transDetailsFormRecord: FormGroup;
  // @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  // @Input() userList;
  @Input() transactionInfoModel;
  @Input() lang;
  @Input() helpIndex; 
  @Output() detailErrorList = new EventEmitter(true);
  @Output() isSolicitedFlag = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public actTypeList;
  public transDescList;
  public yesNoList: Array<any> = [];
  public deviceClassList: ICode[] = [];
  public reasonArray: Array<boolean> = [];
  public reasonResults: Array<boolean> = [];
  public showFieldErrors = false;
  public showDate: boolean;
  public showBriefDesc: boolean;
  public rawActTypes;
  public rawDescTypes;
  private showVersion: boolean;
  private rawDescMap;
  // public showRationalRequired: boolean;
  // public showProposeIndication: boolean;
  public showPeriod: boolean;
  public showDeviceClass: boolean = false;
  public showAmendReasons: boolean = false;
  public amendReasonOptionList: CheckboxOption[] = [];

  private activityTypesRequiresAmendReason: string[] = [ActivityType.LicenceAmendment, ActivityType.MinorChange , ActivityType.PrivateLabelAmendment];

  constructor(private _fb: FormBuilder,   private _detailsService: TransactionDetailsService, private _globalService: GlobalService,
    private _utilsService: UtilsService, private _converterService: ConverterService, private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    this.showErrors = false;
    this.showDate = false;
    this.showBriefDesc = false;

    this.actTypeList = this._globalService.$activityTypeList;
    this.transDescList = [];
    this.reasonArray = [false, false, false, false, false, false, false, false, false, false, false];
    this.reasonResults = [false, false, false, false, false, false, false, false, false, false, false];
    // this.yesNoList = this.detailsService.getYesNoList();
    // this.rawActTypes = TransactionDetailsService.getRawActivityTypeList();
    // this.rawDescTypes = TransactionDetailsService.getRawTransDescList();
    this.rawDescMap = this._detailsService.getDescMap();
    if (!this.transDetailsFormLocalModel) {
      this.transDetailsFormLocalModel = this._detailsService.getReactiveModel(this._fb);
    }
    this.showPeriod = false;
  }

  ngOnInit() {
    // this.detailsChanged = 0;
  //   this.actLeadList = TransactionDetailsService.getActivityLeadList(this.lang);
    this.deviceClassList = this._globalService.$deviceClasseList;
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      const temp = [];
      this._updateErrorList(errorObjs);
    });
    this.msgList.notifyOnChanges();

  }

  private _updateErrorList(errorObjs) {
    const temp = [];
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
    }
    this.detailErrorList.emit(temp);

  }


  ngOnChanges(changes: SimpleChanges) {

    // since we can't detect changes on objects, using a separate flag
    // if (changes['detailsChanged']) { // used as a change indicator for the model
    //   // console.log("the details cbange");
    //   if (this.transDetailsFormRecord) {
    //     this.setToLocalModel();

    //   } else {
    //     this.transDetailsFormLocalModel = this.detailsService.getReactiveModel(this._fb);
    //     this.transDetailsFormLocalModel.markAsPristine();
    //   }
    // }
    if (changes['showErrors']) {

      this.showFieldErrors = changes['showErrors'].currentValue;
      const temp = [];
      if (this.msgList) {
        this.msgList.forEach(item => {
          temp.push(item);
          // console.log(item);
        });
      }
      this.detailErrorList.emit(temp);
    }
    // if (changes['transDetailsFormLocalModel']) {
    //   // console.log('**********the transaction details changed');
    //   this.transDetailsFormRecord = this.transDetailsFormLocalModel;
    // }
    if (changes['transactionInfoModel']) {
      // console.log('**********the transaction model changed');
      const dataModel = changes['transactionInfoModel'].currentValue;
      if (!this.transDetailsFormLocalModel) {
        this.transDetailsFormLocalModel = this._detailsService.getReactiveModel(this._fb);
        this.transDetailsFormLocalModel.markAsPristine();
      }
      this._detailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.transDetailsFormLocalModel), this.lang);
      this._updateLists();
      // this._setDescFieldFlags(this.transDetailsFormLocalModel.controls.descriptionType.value);
    }
    // if (changes['userList']) {
    //   this.userList = changes['userList'].currentValue;
    // }
  }
  private  _updateLists() {
    // if (this.actLeadList && this.actLeadList.length > 0 ) {
    //   if (this.transDetailsFormLocalModel.controls.activityLead.value === this.actLeadList[0].id) {
    //     this.actTypeList = TransactionDetailsService.getActivityTypeMDBList(this.lang);
    //   } else if (this.transDetailsFormLocalModel.controls.activityLead.value === this.actLeadList[1].id) {
    //     this.actTypeList = TransactionDetailsService.getActivityTypePVList(this.lang);
    //   }
    // }

    // if (this.rawActTypes && this.rawActTypes.length > 0 ) {
    //   if (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[1].id) { // 'B02-20160301-039'
    //     this.transDescList = TransactionDetailsService.getLicenceDescriptions(this.lang);
    //   } else if (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[0].id) { // 'B02-20160301-033'
    //     this.transDescList = TransactionDetailsService.getFaxbackDescriptions(this.lang);
    //   } else if (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[2].id) { // 'B02-20160301-040'
    //     this.transDescList = TransactionDetailsService.getLicenceDescriptions(this.lang);
    //   } else if (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[3].id) { // 'B02-20160301-081'
    //     this.transDescList = TransactionDetailsService.getS36394041Descriptions(this.lang);
    //   } else if (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[4].id) { // 'B02-20190627-02'
    //     this.transDescList = TransactionDetailsService.getPAPVDescriptions(this.lang);
    //   } else if (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[5].id) { // 'B02-20160301-079'
    //     this.transDescList = TransactionDetailsService.getPSURPVDescriptions(this.lang);
    //   } else if (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[6].id) { // 'B02-20190627-04'
    //     this.transDescList = TransactionDetailsService.getRCPVDescriptions(this.lang);
    //   } else if (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[7].id) { // 'B02-20190627-03'
    //     this.transDescList = TransactionDetailsService.getPSAPVDescriptions(this.lang);
    //   } else if (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[8].id) { // 'B02-20190627-05'
    //     this.transDescList = TransactionDetailsService.getREGPVDescriptions(this.lang);
    //   } else if (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[9].id) { // 'B02-20160301-073'
    //     this.transDescList = TransactionDetailsService.getPRVLDDescriptions(this.lang);
    //   } else if (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[10].id) { // 'B02-20160301-074'
    //     this.transDescList = TransactionDetailsService.getPRVLDADescriptions(this.lang);
    //   }
    // }
    // update reasonArray
    this._updateReasonArray();
    // update reasonResults
    this._updateReasonResults();
  }

  /**
   * Uses the updated reactive forms model locally
   */

  // setToLocalModel() {
  //   this.transDetailsFormLocalModel = this.transDetailsFormRecord;
  //   if (!this.transDetailsFormLocalModel.pristine) {
  //     this.transDetailsFormLocalModel.markAsPristine();
  //   }
  // }

  onblur() {
    this._saveData();
  }

  private _saveData(): void{
    // save data to output model
    this._detailsService.mapFormModelToDataModel((<FormGroup>this.transDetailsFormLocalModel),  this.transactionInfoModel);
  }

  activityTypeOnChange() {
    const selectedActivityType = this.transDetailsFormLocalModel.get('activityType')?.value;
    console.log("selectedActivityType", selectedActivityType);
    // dynamically load the transaction description dropdowns according to the selected activity type value
    const activityTypeTxDescArray = this._globalService.$activityTypeTxDescription;
    this.transDescList = this._utilsService.filterParentChildrenArray(activityTypeTxDescArray, selectedActivityType);
    this._checkAmendReasonRenderability();
    this._cleanActivityDescription();   
    this._saveData();
  }

  transactionDescriptionOnChange(){
    console.log("selectedTxDescription", this.transDetailsFormLocalModel.get('descriptionType')?.value)
    this.showDeviceClass = this._isInitial()
    this._checkAmendReasonRenderability();
    this._saveData();
  }

  deviceClassOnChange() {
    console.log("selectedDeviceClassId", this.transDetailsFormLocalModel.get('deviceClass')?.value);
    // this._setDescFieldFlags(descValue);
    this._checkAmendReasonRenderability();
    this._resetReasonValues();
    this._saveData();
  }
  
  private _checkAmendReasonRenderability(){
    const selectedActivityType = this.transDetailsFormLocalModel.get('activityType')?.value;

    if (this.activityTypesRequiresAmendReason.includes(selectedActivityType) && this._isInitial() && this.transDetailsFormLocalModel.controls['deviceClass'].value){
      this.showAmendReasons = true;
    } else {
      this.showAmendReasons = false;
    }

    if (this.showAmendReasons) {
      this._updateReasonArray();
    }

  }

  private _cleanActivityType() {
    // this.transDetailsFormLocalModel.controls.activityType.setValue(null);
    // this.transDetailsFormLocalModel.controls.activityType.markAsUntouched();
    this._cleanActivityDescription();
  }

  private _cleanActivityDescription() {   //rename it??
    // reset activityTypeControl value to null and mark it as pristine
    this._utilsService.resetControlValue(this.transDetailsFormLocalModel.get('descriptionType'));
    // this.transDetailsFormLocalModel.controls.descriptionType.setValue(null);
    // this.transDetailsFormLocalModel.controls.descriptionType.markAsUntouched();
    // this._setDescFieldFlags(this.transDetailsFormLocalModel.controls.descriptionType.value);
    this._cleanDeviceClass();
    this._cleanOthers();
  }
  private _cleanDeviceClass() {
    // this.transDetailsFormLocalModel.controls.deviceClass.setValue(null);
    // this.transDetailsFormLocalModel.controls.deviceClass.markAsUntouched();
  }
  private _cleanOthers() {
    this._resetReasonValues();
  }
  isSolicitedOnblur() {
    // this.isSolicitedFlag.emit(this.transDetailsFormLocalModel.controls.isSolicitedInfo.value === GlobalsService.YES);
    this._saveData();
  }
  onOrgManufactureLicblur() {
    // if (this.transDetailsFormLocalModel.controls.orgManufactureLic.value
    //     && this.transDetailsFormLocalModel.controls.orgManufactureLic.value.toString().length < 6) {
    //   this.transDetailsFormLocalModel.controls.orgManufactureLic.setValue(
    //     ('000000' + this.transDetailsFormLocalModel.controls.orgManufactureLic.value )
    //       .slice(this.transDetailsFormLocalModel.controls.orgManufactureLic.value.toString().length) );
    // }
    this._saveData();
  }
  // reasonArray is the flags to display the reason chexk box list
  private _updateReasonArray() {    
    const activityTypeValue = this.transDetailsFormLocalModel.controls['activityType'].value;
    const deviceClassValue = this.transDetailsFormLocalModel.controls['deviceClass'].value;

    const amendReasonList = this._globalService.$amendReasonList;
    const relationship = this._globalService.$amendReasonRelationship;

    console.log("**", activityTypeValue, deviceClassValue, amendReasonList, relationship);

    const group = relationship.find((item) => item.activityTypeId === activityTypeValue);
    if (group) {
      const reasons =  group.amendReasons.filter((member) => member.deviceClassId === deviceClassValue);
      console.log("##1",reasons[0])
      const reasonIds = reasons[0].values;
      console.log("##2",reasonIds)
      const amendReasonCodeList = this._utilsService.filterCodesByIds(amendReasonList, reasonIds);
      console.log("##3", amendReasonCodeList)

      this.amendReasonOptionList = amendReasonCodeList.map((item) => {
        return this._converterService.convertCodeToCheckboxOption(item, this.lang);
      });
      this.amendReasonOptionList.forEach(() => this.amendReasonChkFormArray.push(new FormControl(false)));
      console.log("##4", this.amendReasonOptionList)
    } else {
      console.log("couldn't find a match")
    }


    // if (this.transDetailsFormLocalModel.controls.activityType.value !== this.rawActTypes[1].id
    //   && this.transDetailsFormLocalModel.controls.activityType.value !== this.rawActTypes[9].id
    //   && descValue === this.rawDescTypes[this.rawDescMap.indexOf('i5')].id &&
    //   this.transDetailsFormLocalModel.controls.deviceClass.value) {
    //   if (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[2].id ) { // 'B02-20160301-040'
    //     switch (this.transDetailsFormLocalModel.controls.deviceClass.value) {
    //       case 'DC2':
    //         this.reasonArray = [true, true, true, false, false, false, false, false, false, true, true];
    //         break;
    //       case 'DC3':
    //         this.reasonArray = [true, true, true, true, true, true, true, true, true, false, true];
    //         break;
    //       case 'DC4':
    //         this.reasonArray = [true, true, true, true, true, true, true, true, true, false, true];
    //         break;
    //     }

    //   } else if (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[0].id ) { // 'B02-20160301-033'
    //     this.reasonArray = [false, true, true, false, false, false, false, false, false, false, true];
    //   } else if (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[10].id ) { // 'B02-20160301-033'
    //     this.reasonArray = [true, true, true, false, false, false, false, false, false, true, true];
    //   }
    // } else {
    //   this.reasonArray = [false, false, false, false, false, false, false, false, false, false, false];
    // }
  }

  private _setDescFieldFlags(descValue) {
    this.showBriefDesc = (descValue === this.rawDescTypes[this.rawDescMap.indexOf('i25')].id) ? true : false;
    this.showDate =  (descValue === this.rawDescTypes[this.rawDescMap.indexOf('i0')].id ||  descValue === this.rawDescTypes[this.rawDescMap.indexOf('i2')].id
      || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i3')].id || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i4')].id
      || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i6')].id || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i9')].id
      || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i11')].id || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i14')].id
      || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i15')].id || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i16')].id
      || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i17')].id || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i18')].id
      || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i19')].id || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i20')].id
      || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i21')].id) ? true : false;
    this.showVersion = (descValue === this.rawDescTypes[2].id || descValue === this.rawDescTypes[21].id) ? true : false;
    // this.showRationalRequired = (
    //   (this.rawDescTypes[9].id === this.transDetailsFormLocalModel.controls.descriptionType.value) &&
    //   (this.rawActTypes[0].id === this.transDetailsFormLocalModel.controls.activityType.value
    //     || (this.rawActTypes[2].id === this.transDetailsFormLocalModel.controls.activityType.value && (
    //         this.transDetailsFormLocalModel.controls.classChange.value ||
    //         this.transDetailsFormLocalModel.controls.licenceChange.value ||
    //         this.transDetailsFormLocalModel.controls.deviceChange.value ||
    //         this.transDetailsFormLocalModel.controls.addChange.value
    //       ))
    //     )) ? true : false;
    this.showPeriod = descValue === this.rawDescTypes[this.rawDescMap.indexOf('i3')].id ? true : false;
  }

  private _resetReasonValues() {
    this.reasonResults = [false, false, false, false, false, false, false, false, false, false, false];
    // this.transDetailsFormLocalModel.controls.amendReason.setValue(null);
    // this.transDetailsFormLocalModel.controls.amendReason.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.classChange.setValue(false);
    // this.transDetailsFormLocalModel.controls.classChange.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.licenceChange.setValue(false);
    // this.transDetailsFormLocalModel.controls.licenceChange.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.deviceChange.setValue(false);
    // this.transDetailsFormLocalModel.controls.deviceChange.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.processChange.setValue(false);
    // this.transDetailsFormLocalModel.controls.processChange.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.qualityChange.setValue(false);
    // this.transDetailsFormLocalModel.controls.qualityChange.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.designChange.setValue(false);
    // this.transDetailsFormLocalModel.controls.designChange.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.materialsChange.setValue(false);
    // this.transDetailsFormLocalModel.controls.materialsChange.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.labellingChange.setValue(false);
    // this.transDetailsFormLocalModel.controls.labellingChange.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.safetyChange.setValue(false);
    // this.transDetailsFormLocalModel.controls.safetyChange.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.purposeChange.setValue(false);
    // this.transDetailsFormLocalModel.controls.purposeChange.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.addChange.setValue(false);
    // this.transDetailsFormLocalModel.controls.addChange.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.licenceNum.setValue(null);
    // this.transDetailsFormLocalModel.controls.licenceNum.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.orgManufactureId.setValue(null);
    // this.transDetailsFormLocalModel.controls.orgManufactureId.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.orgManufactureLic.setValue(null);
    // this.transDetailsFormLocalModel.controls.orgManufactureLic.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.appNum.setValue(null);
    // this.transDetailsFormLocalModel.controls.appNum.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.deviceName.setValue(null);
    // this.transDetailsFormLocalModel.controls.deviceName.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.requestDate.setValue(null);
    // this.transDetailsFormLocalModel.controls.requestDate.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.briefDesc.setValue(null);
    // this.transDetailsFormLocalModel.controls.briefDesc.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.rationale.setValue(null);
    // this.transDetailsFormLocalModel.controls.rationale.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.proposedIndication.setValue(null);
    // this.transDetailsFormLocalModel.controls.proposedIndication.markAsUntouched();
    // this.transDetailsFormLocalModel.controls.requestTo.setValue(null);
    // this.transDetailsFormLocalModel.controls.requestTo.markAsUntouched();
  }

  amendReasonOnChange() {
    // let itemValue = false;

    // if (itemValue) {
    //   // this.transDetailsFormLocalModel.controls.amendReason.setValue('reasonFilled');
    //   this.reasonResults[int] = true;
    // } else {
    //   this.reasonResults[int] = false;
    //   this._resetReasonFlag();
    // }
    // this.showRationalRequired = (
    //   (this.rawDescTypes[9].id === this.transDetailsFormLocalModel.controls.descriptionType.value) &&
    //   (this.rawActTypes[2].id === this.transDetailsFormLocalModel.controls.activityType.value && (
    //       this.transDetailsFormLocalModel.controls.classChange.value ||
    //       this.transDetailsFormLocalModel.controls.licenceChange.value ||
    //       this.transDetailsFormLocalModel.controls.deviceChange.value ||
    //       this.transDetailsFormLocalModel.controls.addChange.value
    //     ))
    //   ) ? true : false;
    // this.showProposeIndication =  (this.rawDescTypes[9].id === this.transDetailsFormLocalModel.controls.descriptionType.value &&
    //   this.rawActTypes[2].id === this.transDetailsFormLocalModel.controls.activityType.value &&
    //   this.deviceClassList[0].id === this.transDetailsFormLocalModel.controls.deviceClass.value &&
    //   this.transDetailsFormLocalModel.controls.purposeChange.value
    //   ) ? true : false;
    this._saveData();
  }
  showRationaleRequired() {
    // if ((this.rawDescTypes[this.rawDescMap.indexOf('i5')].id === this.transDetailsFormLocalModel.controls.descriptionType.value &&
    //   this.transDetailsFormLocalModel.controls.deviceClass.value ) && (this.rawActTypes[0].id === this.transDetailsFormLocalModel.controls.activityType.value ||
    //   (this.rawActTypes[2].id === this.transDetailsFormLocalModel.controls.activityType.value && (
    //     this.transDetailsFormLocalModel.controls.classChange.value ||
    //     this.transDetailsFormLocalModel.controls.licenceChange.value ||
    //     this.transDetailsFormLocalModel.controls.deviceChange.value ||
    //     this.transDetailsFormLocalModel.controls.addChange.value
    //   )))) {
    //   return true;
    // } else {
    //   this.transDetailsFormLocalModel.controls.rationale.setValue(null);
    //   this.transDetailsFormLocalModel.controls.rationale.markAsUntouched();
    // }
    return false;
  }
  showProposeIndication() {
    // if (this.rawDescTypes[this.rawDescMap.indexOf('i5')].id === this.transDetailsFormLocalModel.controls.descriptionType.value &&
    //   this.rawActTypes[2].id === this.transDetailsFormLocalModel.controls.activityType.value &&
    //   this.deviceClassList[0].id === this.transDetailsFormLocalModel.controls.deviceClass.value &&
    //   this.transDetailsFormLocalModel.controls.purposeChange.value) {
    //   return true;
    // } else {
    //   this.transDetailsFormLocalModel.controls.proposedIndication.setValue(null);
    //   this.transDetailsFormLocalModel.controls.proposedIndication.markAsUntouched();
    // }
    return false;
  }

  licenceNumOnblur() {
    // if (this.transDetailsFormLocalModel.controls.licenceNum.value && !isNaN(this.transDetailsFormLocalModel.controls.licenceNum.value)) {
    //   const lnum = '000000' + this.transDetailsFormLocalModel.controls.licenceNum.value;
    //   this.transDetailsFormLocalModel.controls.licenceNum.setValue(lnum.substring(lnum.length - 6));
    // }
    this._saveData();
  }

  private _resetReasonFlag() {
    // this.transDetailsFormLocalModel.controls.amendReason.setValue(null);
    // for (const reason of this.reasonResults){
    //   if (reason) {
    //     this.transDetailsFormLocalModel.controls.amendReason.setValue('reasonFilled');
    //     break;
    //   }
    // }
  }

  // set reason result after load data
  private _updateReasonResults() {
    // this.reasonResults[0] = this.transDetailsFormLocalModel.controls.classChange.value;
    // this.reasonResults[1] = this.transDetailsFormLocalModel.controls.licenceChange.value;
    // this.reasonResults[2] = this.transDetailsFormLocalModel.controls.deviceChange.value;
    // this.reasonResults[3] = this.transDetailsFormLocalModel.controls.processChange.value;
    // this.reasonResults[4] = this.transDetailsFormLocalModel.controls.qualityChange.value;
    // this.reasonResults[5] = this.transDetailsFormLocalModel.controls.designChange.value;
    // this.reasonResults[6] = this.transDetailsFormLocalModel.controls.materialsChange.value;
    // this.reasonResults[7] = this.transDetailsFormLocalModel.controls.labellingChange.value;
    // this.reasonResults[8] = this.transDetailsFormLocalModel.controls.safetyChange.value;
    // this.reasonResults[9] = this.transDetailsFormLocalModel.controls.purposeChange.value;
    // this.reasonResults[10] = this.transDetailsFormLocalModel.controls.addChange.value;
  }

  private _isInitial() {
    return (this.transDetailsFormLocalModel.get('descriptionType')?.value === TransactionDesc.Initial);
  }

  isLicence() {
    // return (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[1].id
    //   || this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[9].id);
    return true;
  }

  isClassSet() {
    return (this.transDetailsFormLocalModel.controls['deviceClass'].value);
  }

  isNotInitial() {
    // return (this.transDetailsFormLocalModel.controls.descriptionType.value && !this._isInitial());
    return true;
  }

  isDescInitial() {
    console.log("##", this._isInitial())
    if (this._isInitial()) {
      return true;
    } else {
      // this.transDetailsFormLocalModel.controls.deviceClass.setValue(null);
      // this.transDetailsFormLocalModel.controls.deviceClass.markAsUntouched();
      // this.transDetailsFormLocalModel.controls.amendReason.setValue(null);
      // this.transDetailsFormLocalModel.controls.amendReason.markAsUntouched();
    }
    return false;
  }

  // isInitialNotLicence() {
  //   if (this._isInitial() && this.transDetailsFormLocalModel.controls.activityType.value && !this.isLicence()) {
  //       return true;
  //   } else {
  //     this.transDetailsFormLocalModel.controls.deviceClass.setValue(null);
  //     this.transDetailsFormLocalModel.controls.deviceClass.markAsUntouched();
  //     this.transDetailsFormLocalModel.controls.amendReason.setValue(null);
  //     this.transDetailsFormLocalModel.controls.amendReason.markAsUntouched();
  //   }
  //   return false;
  // }

  isInitialNotLicenceDCSet() {
    if (this._isInitial() && !this.isLicence() && this.isClassSet()) {
      return true;
    } else {
      // this.transDetailsFormLocalModel.controls.amendReason.setValue(null);
      // this.transDetailsFormLocalModel.controls.amendReason.markAsUntouched();
    }
    return false;
  }

  isInitialAndLicence() {
    if (this._isInitial() && this.isLicence()) {
      return true;
    } else {
      // this.transDetailsFormLocalModel.controls.deviceName.setValue(null);
      // this.transDetailsFormLocalModel.controls.deviceName.markAsUntouched();
    }
    return false;
  }

  isNotUnsolicited() {
    // if (this.transDetailsFormLocalModel.controls.descriptionType.value !== this.rawDescTypes[this.rawDescMap.indexOf('i25')].id) {
    //   return true;
    // } else {
    //   this.transDetailsFormLocalModel.controls.isSolicitedInfo.setValue(null);
    //   this.transDetailsFormLocalModel.controls.isSolicitedInfo.markAsUntouched();
    //   this.isSolicitedFlag.emit(false);
    // }
    return false;
  }

  isNotInitialMmUd() {
    // if (this.isNotInitial() && (
    //   this.transDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i1')].id ||
    //       this.transDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i7')].id ||
    //   this.transDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i14')].id ||
    //   this.transDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i15')].id ||
    //   this.transDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i20')].id ||
    //   this.transDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i26')].id
    //   )) {
    //   return true;
    // } else {
    //   this.transDetailsFormLocalModel.controls.appNum.setValue(null);
    //   this.transDetailsFormLocalModel.controls.appNum.markAsUntouched();
    // }
    // return false;
    return true;
  }

  isMmUd() {
    // if (this.transDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i8')].id ||
    //   this.transDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i9')].id ||
    //   this.transDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i10')].id ||
    //   this.transDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i18')].id ||
    //   this.transDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i19')].id ) {
    //   return true;
    // } else {
    //   this.transDetailsFormLocalModel.controls.appNumOpt.setValue(null);
    //   this.transDetailsFormLocalModel.controls.appNumOpt.markAsUntouched();
    // }
    // return false;
    return true;
  }

  isHasDdtMandatory() {
    // if (this.isInitialAndLicence() || this.transDetailsFormLocalModel.controls.deviceChange.value) {
    //   this.transDetailsFormLocalModel.controls.hasDdt.setValue(null);
    //   this.transDetailsFormLocalModel.controls.hasDdt.markAsUntouched();
    //   return true;
    // } else {
    //   this.transDetailsFormLocalModel.controls.hasDdtMan.setValue(null);
    //   this.transDetailsFormLocalModel.controls.hasDdtMan.markAsUntouched();
    // }
    return false;
  }

  isLicenceNameChanged() {
    // if (this.transDetailsFormLocalModel.controls.licenceChange.value) {
    //   return true;
    // } else {
    //   this.transDetailsFormLocalModel.controls.licenceName.setValue(null);
    //   this.transDetailsFormLocalModel.controls.licenceName.markAsUntouched();
    // }
    // return false;
    return true;
  }

  isDeviceNameChanged() {
    // return (this.transDetailsFormLocalModel.controls.deviceChange.value);
    return true;
  }

  isMm() {
    // if (this.transDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i9')].id) {
    //   return true;
    // } else {
    //   this.transDetailsFormLocalModel.controls.meetingId.setValue(null);
    //   this.transDetailsFormLocalModel.controls.meetingId.markAsUntouched();
    // }
    // return false;
    return true;
  }

  getReasonArrayVelue(index) {
    return this.reasonArray[index];
  }

  showOrgManufactureId() {
    // if (this.transDetailsFormLocalModel.controls.descriptionType.value
    //     && this.transDetailsFormLocalModel.controls.descriptionType.value !== this.rawDescTypes[this.rawDescMap.indexOf('i26')].id
    //     && (this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[9].id
    //         || this.transDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[10].id
    //         )
    //   ) {
    //   return true;
    // }
    // return false;
    return true;
  }
  showOrgManufactureLic() {
    return this.showOrgManufactureId();
  }

  get amendReasonChkFormArray() {
    return this.transDetailsFormLocalModel.controls['amendReasons'] as FormArray
  }

  // shortcut to get selectedAmendReasonCodes
  get selectedAmendReasonCodes(): string[] {
    return this._detailsService.getSelectedAmendReasonCodes(this.amendReasonOptionList, this.amendReasonChkFormArray);
  }
}

