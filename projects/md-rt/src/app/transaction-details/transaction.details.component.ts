import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl, AbstractControl} from '@angular/forms';
import { BaseComponent, CheckboxOption, ControlMessagesComponent, ConverterService, ICode, ICodeAria, IParentChildren, UtilsService } from '@hpfb/sdk/ui';
import {TransactionDetailsService} from './transaction.details.service';
import { GlobalService } from '../global/global.service';
import { ActivityType, AmendReason, DeviceClass, TransactionDesc } from '../app.constants';

@Component({
  selector: 'transaction-details',
  templateUrl: 'transaction.details.component.html',
  encapsulation: ViewEncapsulation.None
})

export class TransactionDetailsComponent extends BaseComponent implements OnInit, OnChanges  {

  public transDetailsFormLocalModel: FormGroup;
  @Input() showErrors: boolean;
  @Input() transactionInfoModel;
  lang: string;
  helpIndex: { [key: string]: number }; 

  @Output() detailErrorList = new EventEmitter(true);

  public actTypeList: ICode[] = [];
  public transDescList: ICode[] = [];
  public yesNoList: ICode[] = [];
  public deviceClassList: ICodeAria[] = [];
  
  activityTypeTxDescArray: IParentChildren[];
  amendReasonList: ICode[] = [];
  relationship: any[] = [];

  public showFieldErrors = false;
  public showDate: boolean;
  public showBriefDesc: boolean;

  public amendReasonOptionList: CheckboxOption[] = [];

  constructor(private _fb: FormBuilder,   private _detailsService: TransactionDetailsService, private _globalService: GlobalService,
    private _utilsService: UtilsService, private _converterService: ConverterService, private cdr: ChangeDetectorRef) {
    
    super();
    this.showFieldErrors = false;
    this.showErrors = false;
    this.showDate = false;
    this.showBriefDesc = false;

    if (!this.transDetailsFormLocalModel) {
      this.transDetailsFormLocalModel = this._detailsService.getReactiveModel(this._fb);
    }
  }

  ngOnInit() {
    this.lang = this._globalService.getCurrLanguage();
    this.helpIndex = this._globalService.getHelpIndex();
    this.actTypeList = this._globalService.$activityTypeList;
    this.deviceClassList = this._globalService.$deviceClasseList;
    this.yesNoList = this._globalService.$yesnoList;
    this.amendReasonList = this._globalService.$amendReasonList;
    this.relationship = this._globalService.$amendReasonRelationship;
    this.activityTypeTxDescArray = this._globalService.$activityTypeTxDescription;
  }

  protected override emitErrors(errors: any[]): void {
    this.detailErrorList.emit(errors);
  }

  ngOnChanges(changes: SimpleChanges) {

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

    if (changes['transactionInfoModel'] && !changes['transactionInfoModel'].firstChange) {
      // console.log('**********the transaction model changed');
      const dataModel = changes['transactionInfoModel'].currentValue;
      if (!this.transDetailsFormLocalModel) {
        this.transDetailsFormLocalModel = this._detailsService.getReactiveModel(this._fb);
        this.transDetailsFormLocalModel.markAsPristine();
      }
      this._detailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.transDetailsFormLocalModel), this.amendReasonList, 
        this.relationship, this.amendReasonOptionList, this.lang);

      const raTypeValue: string = this.activityTypeFormControl.value;
      if (raTypeValue) {
        // dynamically load the transaction description dropdowns according to the selected activity type value
        this.transDescList = this._getTransactionDescriptions(this.activityTypeTxDescArray, raTypeValue);
      }
    }

  }

  onblur() {
    this._saveData();
  }

  private _saveData(): void{
    // save data to output model
    this._detailsService.mapFormModelToDataModel((<FormGroup>this.transDetailsFormLocalModel),  this.transactionInfoModel, this.selectedAmendReasonCodes, this.lang );
  }

  activityTypeOnChange() {
    // Reset related formControls
    this._utilsService.resetControlsValues(this.txDescriptionFormControl, this.deviceClassFormControl, this.amendReasonChkFormArray)
    this._resetDependecyValues();

    const selectedRaTypeValue = this.activityTypeFormControl.value;
    // console.log("selectedRaTypeValue", selectedRaTypeValue);
    if (selectedRaTypeValue) {
      // dynamically load the transaction description dropdowns according to the selected activity type value
      this.transDescList = this._getTransactionDescriptions(this.activityTypeTxDescArray, selectedRaTypeValue);
    } else {
      this.transDescList = [];
    }

    this._saveData();
  }

  descriptionOnChange() {
    // Reset related formControls
    this._utilsService.resetControlsValues(this.deviceClassFormControl, this.amendReasonChkFormArray);
    this._resetDependecyValues();

    this._descrDeviceOnblur();
  }

  deviceClassOnChange(){
    // Reset related formControls
    this._utilsService.resetControlsValues(this.amendReasonChkFormArray);
    this._resetDependecyValues();

    this._descrDeviceOnblur();
  }

  private _descrDeviceOnblur(){
    const selectedRaType = this.activityTypeFormControl.value;
    const selectedDeviceClass = this.deviceClassFormControl?.value;

    if (selectedRaType && selectedDeviceClass) {
      this._detailsService.loadAmendReasonOptions(selectedRaType, selectedDeviceClass, this.amendReasonList, this.relationship, 
        this.amendReasonOptionList, this.lang, this.amendReasonChkFormArray);
    } else {
      this.amendReasonOptionList = [];
    }    

    const selectedTxDescription: TransactionDesc = this.txDescriptionFormControl.value;
    this.showBriefDesc = this._detailsService.isBriefDescRequired(selectedTxDescription);
    this.showDate = this._detailsService.isRequestDateRequired(selectedTxDescription); 
    
    this._saveData();
  }

  onOrgManufactureLicblur() {
    this._formatLicenceNumber(this.transDetailsFormLocalModel.controls['orgManufactureLic'] as FormControl);
    this._saveData();
  }

  private _resetDependecyValues() {
    this._utilsService.resetControlsValues(
      this.transDetailsFormLocalModel.controls['licenceName'],
      this.transDetailsFormLocalModel.controls['orgManufactureId'],
      this.transDetailsFormLocalModel.controls['orgManufactureLic'],
      this.transDetailsFormLocalModel.controls['appNum'],
      this.transDetailsFormLocalModel.controls['appNumOpt'],
      this.transDetailsFormLocalModel.controls['deviceName'],
      this.transDetailsFormLocalModel.controls['requestDate'],
      this.transDetailsFormLocalModel.controls['briefDesc'],
      this.transDetailsFormLocalModel.controls['rationale'],
      this.transDetailsFormLocalModel.controls['proposedPurpose'],
      this.transDetailsFormLocalModel.controls['meetingId']
      );
  }

  amendReasonOnChange() {
    this._saveData();
  }

  showRationaleRequired() {
    if (this.activityTypeFormControl.value === ActivityType.MinorChange && this._isTransactionDescriptionInitial()) {
      // TODO line 21/22 in matrix

    // if ((this.rawDescTypes[this.rawDescMap.indexOf('i5')].id === this.txDescriptionFormControl.value &&
    //   this.deviceClassFormControl.value ) && (this.rawActTypes[0].id === this.activityTypeFormControl.value ||
    //   (this.rawActTypes[2].id === this.activityTypeFormControl.value && (
    //     this.transDetailsFormLocalModel.controls.classChange.value ||
    //     this.transDetailsFormLocalModel.controls.licenceChange.value ||
    //     this.transDetailsFormLocalModel.controls.deviceChange.value ||
    //     this.transDetailsFormLocalModel.controls.addChange.value
    //   )))) {
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsFormLocalModel.controls['rationale']);
    }

    return false;
  }

  // show if Regulatory Activity Type is "licence amendment", Transaction Description is "initial" , Device class is Class II
  // and amendment reason is Change to the purpose/indication of a device  
  showProposedPurpose() {
    if (this.activityTypeFormControl.value === ActivityType.LicenceAmendment &&
      this._isTransactionDescriptionInitial() &&
      this.deviceClassFormControl?.value === DeviceClass.ClassII &&
      this.selectedAmendReasonCodes.includes(AmendReason.purpose_change) ) {
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsFormLocalModel.controls['proposedPurpose']);
    }
    return false;
  }

  licenceNumOnblur() {
    this._formatLicenceNumber(this.transDetailsFormLocalModel.controls['licenceNum'] as FormControl);
    this._saveData();
  }

  // Device Class, show if Transaction Description is "initial"
  showDeviceClass() {
    if (this._isTransactionDescriptionInitial()){
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsFormLocalModel.controls['deviceName']);
    }
    return false;
  }

  // Amendment Reason, show if Regulatory Activity Type is "licence amendment" or "minor change" or  "private label amendment"and Transaction Description is "initial"
  // and Device Class is not empty
  showAmendReason() {
    const activityTypesRequiresAmendReason: string[] = [ActivityType.LicenceAmendment, ActivityType.MinorChange , ActivityType.PrivateLabelAmendment];

    const selectedRaTypeValue = this.activityTypeFormControl.value;
    const selectedDeviceClass = this.deviceClassFormControl?.value;

    if (activityTypesRequiresAmendReason.includes(selectedRaTypeValue) && this._isTransactionDescriptionInitial() && selectedDeviceClass) {
      return true;
    } 
    return false;
  }

  // show DeviceName if Regulatory Activity  Type is "licence"  or "private label" and Transaction Description is "initial"
  showDeviceName() {
    const activityTypeRequireDeviceName = [ActivityType.Licence, ActivityType.PrivateLabel];
    const selectedRaTypeValue = this.activityTypeFormControl.value;

    if (activityTypeRequireDeviceName.includes(selectedRaTypeValue) && this._isTransactionDescriptionInitial()) {
      return true;
    } 
    return false;
  }

  showMandatoryAppNum() {
    if (this._detailsService.isMandatoryAppNumRequired(this.txDescriptionFormControl.value)) {
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsFormLocalModel.controls['appNum']);
    }
    return false;
  }

  showOptionalAppNum() {
    if (this._detailsService.isOptionalAppNumRequired(this.txDescriptionFormControl.value)) {
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsFormLocalModel.controls['appNumOpt']);
    }
    return false;
  }

  showLicenceName() {
    if(this.selectedAmendReasonCodes.includes(AmendReason.licence_change)){
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsFormLocalModel.controls['licenceName']);
    }
    return false;
  }

  showDeviceNameChangeInfo() {
    return this.selectedAmendReasonCodes.includes(AmendReason.device_change) ? true : false;
  }

  showMeetingId() {
    const selectedTxDescription = this.txDescriptionFormControl.value;
    if (selectedTxDescription === TransactionDesc.MM) {
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsFormLocalModel.controls['meetingId']);
    }
    return false;
  }

  // show Original Manufacturer's Company Identifier and Original Manufacturer's Licence Number
  // if Regulatory Activity  Type "private label" or "private label amendment" and one of the following Transaction Description
  // -Initial
  // -Response to screening deficiency letter
  // -Unsolicited Information
  showOrgManufactureInfo() {
    if (this._detailsService.isOrgManufactureInfoRequired(this.activityTypeFormControl.value, this.txDescriptionFormControl.value)) {
      return true;
    } else {
      this._utilsService.resetControlsValues(
        this.transDetailsFormLocalModel.controls['orgManufactureId'],
        this.transDetailsFormLocalModel.controls['orgManufactureLic']);
    }
    return false;
  }

  private _formatLicenceNumber(control: FormControl){
    if (control.value && control.value.toString().length < 6) {
      control.setValue(this._utilsService.formatAsSixDigitNumber(control.value));
    }
  }

  private _isTransactionDescriptionInitial() {
    return this.txDescriptionFormControl.value === TransactionDesc.INITIAL
  }

  private _getTransactionDescriptions(activityTypeTxDescArray: IParentChildren[], raType: string): ICode[]{
    return this._utilsService.filterParentChildrenArray(activityTypeTxDescArray, raType);
  }

  get activityTypeFormControl() {
    return this.transDetailsFormLocalModel.get('activityType') as FormControl
  }

  get txDescriptionFormControl() {
    return this.transDetailsFormLocalModel.get('descriptionType') as FormControl
  }

  get deviceClassFormControl() {
    return this.transDetailsFormLocalModel.get('deviceClass') as FormControl
  }

  get amendReasonChkFormArray() {
    return this._detailsService.getAmendReasonCheckboxFormArray(this.transDetailsFormLocalModel);
  }

  // shortcut to get selectedAmendReasonCodes
  get selectedAmendReasonCodes(): string[] {
    return this._detailsService.getSelectedAmendReasonCodes(this.amendReasonOptionList, this.amendReasonChkFormArray);
  }


}

