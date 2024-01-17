import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl, AbstractControl} from '@angular/forms';
import { CheckboxOption, ControlMessagesComponent, ConverterService, ICode, UtilsService } from '@hpfb/sdk/ui';
import {TransactionDetailsService} from './transaction.details.service';
import { GlobalService } from '../global/global.service';
import { ActivityType, AmendReason, DeviceClass, TransactionDesc } from '../app.constants';

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
  @Input() transactionInfoModel;
  @Input() lang;
  @Input() helpIndex; 
  @Output() detailErrorList = new EventEmitter(true);
  
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public actTypeList;
  public transDescList;
  public yesNoList: Array<any> = [];
  public deviceClassList: ICode[] = [];

  public reasonResults: Array<boolean> = [];
  public showFieldErrors = false;
  public showDate: boolean;
  public showBriefDesc: boolean;

  // public showRationalRequired: boolean;
  // public showProposeIndication: boolean;
  public showPeriod: boolean;

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

    // this.yesNoList = this.detailsService.getYesNoList();

    if (!this.transDetailsFormLocalModel) {
      this.transDetailsFormLocalModel = this._detailsService.getReactiveModel(this._fb);
    }
    this.showPeriod = false;
  }

  ngOnInit() {
    // this.detailsChanged = 0;
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
    }

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
    this._detailsService.mapFormModelToDataModel((<FormGroup>this.transDetailsFormLocalModel),  this.transactionInfoModel, this.selectedAmendReasonCodes, this.lang );
  }

  activityTypeOnChange() {
    const selectedActivityType = this.activityTypeFormControl.value;
    // console.log("selectedActivityType", selectedActivityType);
    if (selectedActivityType) {
      // dynamically load the transaction description dropdowns according to the selected activity type value
      const activityTypeTxDescArray = this._globalService.$activityTypeTxDescription;
      this.transDescList = this._utilsService.filterParentChildrenArray(activityTypeTxDescArray, selectedActivityType);
      //this._utilsService.resetControlsValues(this.txDescriptionFormControl, )
    } else {
      this.transDescList = [];
    }
    this._cleanActivityDescription();
    this._saveData();
  }

  descrDeviceOnblur(){
    const descValue = this.transDetailsFormLocalModel.controls['descriptionType'].value;
    // console.log("selectedTxDescription", this.txDescriptionFormControl.value)
    this._updateAmendReasonArray();
    this._setDescFieldFlags(descValue);
    this._resetOtherValues();
    this._saveData();
  }
  private _cleanActivityType() {
    // this.transDetailsFormLocalModel.controls.activityType.setValue(null);
    // this.transDetailsFormLocalModel.controls.activityType.markAsUntouched();
    this._cleanActivityDescription();
  }
  private _cleanActivityDescription() {
    this._utilsService.resetControlsValues(this.transDetailsFormLocalModel.controls['descriptionType'], 
        this.transDetailsFormLocalModel.controls['deviceClass'], 
        this.transDetailsFormLocalModel.controls['amendReason'])
    // this.transDetailsFormLocalModel.controls.descriptionType.setValue(null);
    // this.transDetailsFormLocalModel.controls.descriptionType.markAsUntouched();
    // this._setDescFieldFlags(this.transDetailsFormLocalModel.controls.descriptionType.value);
    // this._cleanDeviceClass();
    this._resetOtherValues();
  }
  private _cleanDeviceClass() {
    // this.transDetailsFormLocalModel.controls.deviceClass.setValue(null);
    // this.transDetailsFormLocalModel.controls.deviceClass.markAsUntouched();
  }

  onOrgManufactureLicblur() {
    // if (this.transDetailsFormLocalModel.controls['orgManufactureLic'].value
    //     && this.transDetailsFormLocalModel.controls['orgManufactureLic'].value.toString().length < 6) {
    //   this.transDetailsFormLocalModel.controls['orgManufactureLic'].setValue(
    //     ('000000' + this.transDetailsFormLocalModel.controls['orgManufactureLic'].value )
    //       .slice(this.transDetailsFormLocalModel.controls['orgManufactureLic'].value.toString().length) );
    // }
    this._saveData();
  }
  
  private _updateAmendReasonArray() {
    // Reset the form array first
    this._utilsService.resetControlsValues(this.amendReasonChkFormArray);

    const activityTypeValue = this.transDetailsFormLocalModel.controls['activityType'].value;
    const deviceClassValue = this.transDetailsFormLocalModel.controls['deviceClass']?.value;

    if (activityTypeValue && deviceClassValue) {
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
        // reassign the form array's value
        this.amendReasonOptionList.forEach(() => this.amendReasonChkFormArray.push(new FormControl(false)));
        console.log("##4", this.amendReasonOptionList)
      } else {
        console.error("couldn't find amendReasons for activityType", activityTypeValue, "and deviceClass", deviceClassValue);
      }
    } else {
      this.amendReasonOptionList = [];
    }
  }

  private _setDescFieldFlags(descValue) {
    const selectedTxDescription = this.txDescriptionFormControl.value;

    this.showBriefDesc = (selectedTxDescription === TransactionDesc.UD) ? true : false;

    const txDescRequireDate = [TransactionDesc.IRSR, TransactionDesc.MM, TransactionDesc.PSI, TransactionDesc.RAIL, TransactionDesc.RER, 
      TransactionDesc.RS25L, TransactionDesc.RS36L, TransactionDesc.RS39L, TransactionDesc.RS];
    this.showDate = txDescRequireDate.includes(selectedTxDescription) ? true : false;
    
    // this.showPeriod = descValue === this.rawDescTypes[this.rawDescMap.indexOf('i3')].id ? true : false;
  }

  private _resetOtherValues() {
    this.transDetailsFormLocalModel.controls['licenceNum'].setValue(null);
    this.transDetailsFormLocalModel.controls['licenceNum'].markAsUntouched();
    this.transDetailsFormLocalModel.controls['orgManufactureId'].setValue(null);
    this.transDetailsFormLocalModel.controls['orgManufactureId'].markAsUntouched();
    this.transDetailsFormLocalModel.controls['orgManufactureLic'].setValue(null);
    this.transDetailsFormLocalModel.controls['orgManufactureLic'].markAsUntouched();
    this.transDetailsFormLocalModel.controls['appNum'].setValue(null);
    this.transDetailsFormLocalModel.controls['appNum'].markAsUntouched();
    this.transDetailsFormLocalModel.controls['deviceName'].setValue(null);
    this.transDetailsFormLocalModel.controls['deviceName'].markAsUntouched();
    this.transDetailsFormLocalModel.controls['requestDate'].setValue(null);
    this.transDetailsFormLocalModel.controls['requestDate'].markAsUntouched();
    this.transDetailsFormLocalModel.controls['briefDesc'].setValue(null);
    this.transDetailsFormLocalModel.controls['briefDesc'].markAsUntouched();
    this.transDetailsFormLocalModel.controls['rationale'].setValue(null);
    this.transDetailsFormLocalModel.controls['rationale'].markAsUntouched();
    this.transDetailsFormLocalModel.controls['proposedIndication'].setValue(null);
    this.transDetailsFormLocalModel.controls['proposedIndication'].markAsUntouched();
    this.transDetailsFormLocalModel.controls['requestTo'].setValue(null);
    this.transDetailsFormLocalModel.controls['requestTo'].markAsUntouched();
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
    //   (this.rawDescTypes[9].id === this.transDetailsFormLocalModel.controls['descriptionType'].value) &&
    //   (this.rawActTypes[2].id === this.transDetailsFormLocalModel.controls['activityType'].value && (
    //       this.transDetailsFormLocalModel.controls.classChange.value ||
    //       this.transDetailsFormLocalModel.controls.licenceChange.value ||
    //       this.transDetailsFormLocalModel.controls.deviceChange.value ||
    //       this.transDetailsFormLocalModel.controls.addChange.value
    //     ))
    //   ) ? true : false;
    // this.showProposeIndication =  (this.rawDescTypes[9].id === this.transDetailsFormLocalModel.controls['descriptionType'].value &&
    //   this.rawActTypes[2].id === this.transDetailsFormLocalModel.controls['activityType'].value &&
    //   this.deviceClassList[0].id === this.transDetailsFormLocalModel.controls['deviceClass'].value &&
    //   this.transDetailsFormLocalModel.controls.purposeChange.value
    //   ) ? true : false;
    this._saveData();
  }

  showRationaleRequired() {
    if (this.transDetailsFormLocalModel.controls['activityType'].value === ActivityType.MinorChange && this._isTransactionDescriptionInitial()) {
      // TODO line 21/22 in matrix

    // if ((this.rawDescTypes[this.rawDescMap.indexOf('i5')].id === this.transDetailsFormLocalModel.controls['descriptionType'].value &&
    //   this.transDetailsFormLocalModel.controls['deviceClass'].value ) && (this.rawActTypes[0].id === this.transDetailsFormLocalModel.controls['activityType'].value ||
    //   (this.rawActTypes[2].id === this.transDetailsFormLocalModel.controls['activityType'].value && (
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

  showProposeIndication() {
    if (this.transDetailsFormLocalModel.controls['activityType'].value === ActivityType.LicenceAmendment &&
      this._isTransactionDescriptionInitial() &&
      this.transDetailsFormLocalModel.controls['deviceClass']?.value === DeviceClass.ClassII &&
      this.selectedAmendReasonCodes.includes(AmendReason.purpose_change) ) {
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsFormLocalModel.controls['proposedIndication']);
    }
    return false;
  }

  licenceNumOnblur() {
    // if (this.transDetailsFormLocalModel.controls['licenceNum'].value && !isNaN(this.transDetailsFormLocalModel.controls['licenceNum'].value)) {
    //   const lnum = '000000' + this.transDetailsFormLocalModel.controls['licenceNum'].value;
    //   this.transDetailsFormLocalModel.controls['licenceNum'].setValue(lnum.substring(lnum.length - 6));
    // }
    this._saveData();
  }

  private _isTransactionDescriptionInitial() {
    return this.txDescriptionFormControl.value === TransactionDesc.INITIAL
  }

  isLicence() {
    // return (this.transDetailsFormLocalModel.controls['activityType'].value === this.rawActTypes[1].id
    //   || this.transDetailsFormLocalModel.controls['activityType'].value === this.rawActTypes[9].id);
    return true;
  }

  isNotInitial() {
    // return (this.transDetailsFormLocalModel.controls['descriptionType'].value && !this._isTransactionDescriptionInitial());
    return true;
  }
  
  // Device Class, show if Transaction Description is "initial"
  showDeviceClass() {
    if (this._isTransactionDescriptionInitial()) {
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsFormLocalModel.controls['deviceClass'], 
        this.transDetailsFormLocalModel.controls['amendReason'])
    }
    return false;
  }

  // isInitialNotLicence() {
  //   if (this._isTransactionDescriptionInitial() && this.transDetailsFormLocalModel.controls['activityType'].value && !this.isLicence()) {
  //       return true;
  //   } else {
  //     this.transDetailsFormLocalModel.controls['deviceClass'].setValue(null);
  //     this.transDetailsFormLocalModel.controls['deviceClass'].markAsUntouched();
  //     this.transDetailsFormLocalModel.controls.amendReason.setValue(null);
  //     this.transDetailsFormLocalModel.controls.amendReason.markAsUntouched();
  //   }
  //   return false;
  // }

  // Amendment Reason, show if Regulatory Activity Type is "licence amendment" or "minor change" or  "private label amendment"and Transaction Description is "initial"
  // and Device Class is not empty
  showAmendReason() {
    const selectedActivityType = this.transDetailsFormLocalModel.get('activityType').value;
    const selectedDeviceClass = this.deviceClassFormControl?.value;

    if (this.activityTypesRequiresAmendReason.includes(selectedActivityType) && this._isTransactionDescriptionInitial() && selectedDeviceClass) {
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsFormLocalModel.controls['amendReason']);
    }
    return false;
  }

  isInitialAndLicence() {
    if (this._isTransactionDescriptionInitial() && this.isLicence()) {
      return true;
    } else {
      // this.transDetailsFormLocalModel.controls['deviceName'].setValue(null);
      // this.transDetailsFormLocalModel.controls['deviceName'].markAsUntouched();
    }
    return false;
  }

  showMandatoryAppNum() {
    const txDescRequireMandatoryAppNum = [TransactionDesc.ACD, TransactionDesc.LIA, TransactionDesc.RAIL, TransactionDesc.RER, TransactionDesc.RS, TransactionDesc.WR];
    const selectedTxDescription = this.txDescriptionFormControl.value;
    if (txDescRequireMandatoryAppNum.includes(selectedTxDescription)) {
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsFormLocalModel.controls['appNum']);
    }
    return false;
  }

  showOptionalAppNum() {
    const txDescRequireOptionalAppNum = [TransactionDesc.LIOH, TransactionDesc.MM, TransactionDesc.OHCD, TransactionDesc.RS36L, TransactionDesc.RS39L];
    const selectedTxDescription = this.txDescriptionFormControl.value;
    if (txDescRequireOptionalAppNum.includes(selectedTxDescription)) {
      return true;
    } else {
      this._utilsService.resetControlsValues(this.transDetailsFormLocalModel.controls['appNumOpt']);
    }
    return false;
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
    return this.selectedAmendReasonCodes.includes(AmendReason.licence_change) ? true : false;
  }

  isDeviceNameChanged() {
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

  // show Original Manufacturer's Company Identifier
  // if Regulatory Activity  Type "private label" or "private label amendment" and one of the following Transaction Description
  // -Initial
  // -Response to screening deficiency letter
  // -Unsolicited Information
  showOrgManufactureId() {
    if ( [ActivityType.PrivateLabel,ActivityType.PrivateLabelAmendment].includes(this.activityTypeFormControl.value) &&
    [TransactionDesc.INITIAL, TransactionDesc.RS, TransactionDesc.UD].includes(this.txDescriptionFormControl.value) ){
      return true;
    }
    return false;
  }

  showOrgManufactureLic() {
    return this.showOrgManufactureId();
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
    return this.transDetailsFormLocalModel.controls['amendReasons'] as FormArray
  }

  // shortcut to get selectedAmendReasonCodes
  get selectedAmendReasonCodes(): string[] {
    return this._detailsService.getSelectedAmendReasonCodes(this.amendReasonOptionList, this.amendReasonChkFormArray);
  }


}

