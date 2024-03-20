import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl, AbstractControl} from '@angular/forms';
import { BaseComponent, CheckboxOption, ControlMessagesComponent, ConverterService, ICode, ICodeAria, IParentChildren, UtilsService } from '@hpfb/sdk/ui';
import {TransactionDetailsService} from './transaction.details.service';
import { GlobalService } from '../global/global.service';
import { RegulatoryActivityType, AmendReason, DeviceClass, TransactionDesc } from '../app.constants';

@Component({
  selector: 'transaction-details',
  templateUrl: 'transaction.details.component.html',
  encapsulation: ViewEncapsulation.None
})

export class TransactionDetailsComponent extends BaseComponent implements OnInit, OnChanges  {

  public transDetailsForm: FormGroup;
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
    private _utilsService: UtilsService, private cdr: ChangeDetectorRef) {
    
    super();
    this.showFieldErrors = false;
    this.showErrors = false;
    this.showDate = false;
    this.showBriefDesc = false;

    if (!this.transDetailsForm) {
      this.transDetailsForm = this._detailsService.getReactiveModel(this._fb);
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
    // this console output can be used for verification of the raType and txDesc relationship
    // console.log(this.activityTypeTxDescArray)
  }

  protected override emitErrors(errors: any[]): void {
    this.detailErrorList.emit(errors);
    this.cdr.detectChanges(); // doing our own change detection
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
      if (!this.transDetailsForm) {
        this.transDetailsForm = this._detailsService.getReactiveModel(this._fb);
        this.transDetailsForm.markAsPristine();
      }
      this._detailsService.mapDataModelToDetailForm(dataModel, (<FormGroup>this.transDetailsForm), this.amendReasonList, 
        this.relationship, this.amendReasonOptionList, this.lang);

      const raTypeValue: string = this.activityTypeFormControl.value;
      if (raTypeValue) {
        // dynamically load the transaction description dropdowns according to the selected activity type value
        this.transDescList = this._getTransactionDescriptions(this.activityTypeTxDescArray, raTypeValue);
      }
    }

  }

  activityTypeOnChange() {
    // Reset related formControls
    this._utilsService.resetControlsValues(this.txDescriptionFormControl, this.deviceClassFormControl)
    this._resetDependecyValues();

    const selectedRaTypeValue = this.activityTypeFormControl.value;
    // console.log("selectedRaTypeValue", selectedRaTypeValue);
    if (selectedRaTypeValue) {
      // dynamically load the transaction description dropdowns according to the selected activity type value
      this.transDescList = this._getTransactionDescriptions(this.activityTypeTxDescArray, selectedRaTypeValue);
    } else {
      this.transDescList = [];
    }
  }

  descriptionOnChange() {
    // Reset related formControls
    this._utilsService.resetControlsValues(this.deviceClassFormControl);
    this._resetDependecyValues();

    this._descrDeviceOnblur();
  }

  deviceClassOnChange(){
    // Reset related formControls
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
  }

  onOrgManufactureLicblur() {
    this._formatLicenceNumber(this.transDetailsForm.controls['orgManufactureLic'] as FormControl);
  }

  private _resetDependecyValues() {
      if (!this.showAmendReason()) {
        this._utilsService.resetControlsValues(
          this.amendReasonChkFormArray,
          this.transDetailsForm.controls['selectedAmendReasonCodes'],
          );
      }
      if (!this.showLicenceName()) {
        this._utilsService.resetControlsValues(this.transDetailsForm.controls['licenceName'])
      }
      if (!this.showOrgManufactureInfo()) {
        this._utilsService.resetControlsValues(this.transDetailsForm.controls['orgManufactureId'],
        this.transDetailsForm.controls['orgManufactureLic'])
      }
      if (!this.showMandatoryAppNum()) {
        this._utilsService.resetControlsValues(this.transDetailsForm.controls['appNum'])
      }
      if (!this.showOptionalAppNum()) {
        this._utilsService.resetControlsValues(this.transDetailsForm.controls['appNumOpt'])
      }
      if (!this.showDeviceName()) {
        this._utilsService.resetControlsValues(this.transDetailsForm.controls['deviceName'])
      }
      if (!this.showDate) {
        this._utilsService.resetControlsValues(this.transDetailsForm.controls['requestDate'])
      }
      if (!this.showBriefDesc) {
        this._utilsService.resetControlsValues(this.transDetailsForm.controls['briefDesc'])
      }
      if (!this.showRationale()) {
        this._utilsService.resetControlsValues(this.transDetailsForm.controls['rationale'])
      }
      if (!this.showProposedPurpose()) {
        this._utilsService.resetControlsValues(this.transDetailsForm.controls['proposedPurpose'])
      }
      if (!this.showMeetingId()) {
        this._utilsService.resetControlsValues(this.transDetailsForm.controls['meetingId'])
      }      
  }

  amendReasonOnChange() {
    this.transDetailsForm.controls['selectedAmendReasonCodes'].setValue(
      this._detailsService.getSelectedAmendReasonCodes(this.amendReasonOptionList, this.amendReasonChkFormArray)
    )
  }

 // show when Regulatory Activity type is "minor change" and Transaction Description is "Initial" for all classes (I, II, III) or
 // when Regulatory Activity Type is "licence amendment" and Transaction Description is "Initial" for all classes (I, II, III) and for any of the 4 following <Reason for filing this Amendment> : 
 // - Change to the classification of a device
 // - Change in the licence name  
 // - Change in the device name  
 // - Addition/Deletion/Change 
  showRationale() {

    const amendResonsRequireRationale: string[] = [AmendReason.CLASSIFICATION_CHANGE, AmendReason.LICENCE_CHANGE, AmendReason.DEVICE_CHANGE, AmendReason.ADD_DELETE_CHANGE];

    if ((this.activityTypeFormControl.value === RegulatoryActivityType.MinorChange && this._isTransactionDescriptionInitial()) ||
    (this.activityTypeFormControl.value === RegulatoryActivityType.LicenceAmendment && this._isTransactionDescriptionInitial() && 
      this._utilsService.isArray1ElementInArray2(this.selectedAmendReasonCodes, amendResonsRequireRationale))) {
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsForm.controls['rationale']);
    }

    return false;
  }

  // show if Regulatory Activity Type is "licence amendment", Transaction Description is "initial" , Device class is Class II
  // and amendment reason is Change to the purpose/indication of a device  
  showProposedPurpose() {
    if (this.activityTypeFormControl.value === RegulatoryActivityType.LicenceAmendment &&
      this._isTransactionDescriptionInitial() &&
      this.deviceClassFormControl?.value === DeviceClass.ClassII &&
      this.selectedAmendReasonCodes.includes(AmendReason.PURPOSE_CHANGE) ) {
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsForm.controls['proposedPurpose']);
    }
    return false;
  }

  licenceNumOnblur() {
    this._formatLicenceNumber(this.transDetailsForm.controls['licenceNum'] as FormControl);
  }

  // Device Class, show if Transaction Description is "initial"
  showDeviceClass() {
    if (this._isTransactionDescriptionInitial()){
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsForm.controls['deviceName']);
    }
    return false;
  }

  // Amendment Reason, show if Regulatory Activity Type is "licence amendment" or "minor change" or  "private label amendment"and Transaction Description is "initial"
  // and Device Class is not empty
  showAmendReason() {
    const activityTypesRequiresAmendReason: string[] = [RegulatoryActivityType.LicenceAmendment, RegulatoryActivityType.MinorChange , RegulatoryActivityType.PrivateLabelAmendment];

    const selectedRaTypeValue = this.activityTypeFormControl.value;
    const selectedDeviceClass = this.deviceClassFormControl?.value;

    if (activityTypesRequiresAmendReason.includes(selectedRaTypeValue) && this._isTransactionDescriptionInitial() && selectedDeviceClass) {
      return true;
    } 
    return false;
  }

  // show DeviceName if Regulatory Activity  Type is "licence"  or "private label" and Transaction Description is "initial"
  showDeviceName() {
    const activityTypeRequireDeviceName = [RegulatoryActivityType.Licence, RegulatoryActivityType.PrivateLabel];
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
      this._utilsService.resetControlsValues(this.transDetailsForm.controls['appNum']);
    }
    return false;
  }

  showOptionalAppNum() {
    if (this._detailsService.isOptionalAppNumRequired(this.txDescriptionFormControl.value)) {
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsForm.controls['appNumOpt']);
    }
    return false;
  }

  showLicenceName() {
    if(this.selectedAmendReasonCodes.includes(AmendReason.LICENCE_CHANGE)){
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsForm.controls['licenceName']);
    }
    return false;
  }

  showDeviceNameChangeInfo() {
    return this.selectedAmendReasonCodes.includes(AmendReason.DEVICE_CHANGE) ? true : false;
  }

  showMeetingId() {
    const selectedTxDescription = this.txDescriptionFormControl.value;
    if (selectedTxDescription === TransactionDesc.MM) {
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsForm.controls['meetingId']);
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
        this.transDetailsForm.controls['orgManufactureId'],
        this.transDetailsForm.controls['orgManufactureLic']);
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
    return this.transDetailsForm.get('activityType') as FormControl
  }

  get txDescriptionFormControl() {
    return this.transDetailsForm.get('descriptionType') as FormControl
  }

  get deviceClassFormControl() {
    return this.transDetailsForm.get('deviceClass') as FormControl
  }

  get amendReasonChkFormArray() {
    return this._detailsService.getAmendReasonCheckboxFormArray(this.transDetailsForm);
  }

  // shortcut to get selectedAmendReasonCodes
  get selectedAmendReasonCodes(): string[] {
    return this._detailsService.getSelectedAmendReasonCodes(this.amendReasonOptionList, this.amendReasonChkFormArray);
  }

  checkDateValidity(event: any): void {
    this._utilsService.checkInputValidity(event, this.transDetailsForm.get('requestDate'), 'invalidDate');
  }  
}

