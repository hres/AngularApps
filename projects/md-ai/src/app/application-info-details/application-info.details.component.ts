import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation,
  ViewChild
} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import { CheckboxOption, ControlMessagesComponent, YES, NO, ConverterService, ICode, UtilsService, ICodeAria, ICodeDefinition } from '@hpfb/sdk/ui';
import {ApplicationInfoDetailsService} from './application-info.details.service';
import { GlobalService } from '../global/global.service';
import { DeviceClass, ActivityType, Compliance} from '../app.constants';
import { DeviceListComponent } from '../inter-device/device-list/device-list.component';
import { MaterialInfoComponent } from '../bio-material/material-info/material-info.component';

@Component({
  selector: 'app-info-details',
  templateUrl: 'application-info.details.component.html',
  encapsulation: ViewEncapsulation.None
})

export class ApplicationInfoDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  public appInfoFormLocalModel: FormGroup;
  @Input() showErrors: boolean;
  @Input() appInfoModel;

  @Input() helpTextSequences;
  @Input() loadFileIndicator;
  @Output() detailErrorList = new EventEmitter(true); // For processing app info details errors
  @Output() resetMaterialErrorList = new EventEmitter(true); // To reset material errors 
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // Lists for dropdowns
  public licenceAppTypeList: ICode[] = [];
  public mdsapOrgList: ICode[] = [];
  public actTypeList: ICode[] = [];
  public devClassList: ICodeAria[] = [];
  public drugTypeList: ICode[] = [];
  public yesNoList: ICode[] = [];

  public complianceOptionList: CheckboxOption[] = [];

  // Lists for checkboxes
  public complianceCodeList: ICode[] = [];

  public showFieldErrors = false;

  lang = this._globalService.lang();

  constructor(private _fb: FormBuilder,
              private _detailsService : ApplicationInfoDetailsService,
              private _globalService : GlobalService,
              private _converterService : ConverterService,
              private _utilsService: UtilsService) {
    this.showFieldErrors = false;
    this.showErrors = false;
    if (!this.appInfoFormLocalModel) {
      this.appInfoFormLocalModel = this._detailsService.getReactiveModel(this._fb);
    }
  }

  async ngOnInit() {
    this.licenceAppTypeList = this._globalService.$licenceAppTypeList;
    this.mdsapOrgList = this._globalService.$mdAuditProgramList;
    this.actTypeList = this._globalService.$regActivityTypeList;
    this.devClassList = this._globalService.$deviceClassesList;
    this.drugTypeList = this._globalService.$rawDrugTypeList;
    this.yesNoList = this._globalService.$yesNoList;

    this.complianceCodeList = this._globalService.$complianceList;
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      let temp = [];
      this._updateErrorList(errorObjs);
    });
    this.msgList.notifyOnChanges();
  }

  private _updateErrorList(errorObjs) {
    let temp = [];
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

    if (changes['showErrors']) {

      this.showFieldErrors = changes['showErrors'].currentValue;
      let temp = [];
      if (this.msgList) {
        this.msgList.forEach(item => {
          temp.push(item);
          // console.log(item);
        });
      }
      this.detailErrorList.emit(temp);
    }
   
    if (changes['appInfoModel']) {
      const dataModel = changes['appInfoModel'].currentValue;
      if (!this.appInfoFormLocalModel) {
        this.appInfoFormLocalModel = this._detailsService.getReactiveModel(this._fb);
        this.appInfoFormLocalModel.markAsPristine();
      }
      this._detailsService.mapDataModelToFormModel(dataModel, this.appInfoFormLocalModel, this.complianceCodeList, this.complianceOptionList, this.lang);
      this.deviceClassOnblur();
      this.activityTypeOnChange();
    }
  }

  deviceClassOnblur() {
    if (!this.appInfoFormLocalModel.controls['deviceClass'].value ||
      !this.isDeviceIV()) {
      this._detailsService.deviceClassIV.set(false);
      this.resetMaterialErrorList.emit(true);
    } 

    if (this.appInfoFormLocalModel.controls['deviceClass'].value &&
      this.isDeviceIV()) {
        this._detailsService.deviceClassIV.set(true);
    }

    if (!this.appInfoFormLocalModel.controls['deviceClass'].value ||
      !this.isDeviceIII()) {
      this._detailsService.deviceClassIII.set(false);
    } 

    if (this.appInfoFormLocalModel.controls['deviceClass'].value &&
      this.isDeviceIII()) {
        this._detailsService.deviceClassIII.set(true);
    }
  }

  private _resetControlValues(listOfValues : any[]) {
    for (let i = 0; i < listOfValues.length; i++) {
      this._utilsService.resetControlsValues(this.appInfoFormLocalModel.controls[listOfValues[i]]);
    }
  }

  isIVDD() {
    if (this.appInfoFormLocalModel.controls['isIvdd'].value &&
        this.appInfoFormLocalModel.controls['isIvdd'].value === YES) {
      return true;
    } else {
      const valuesToReset = ['isHomeUse', 'isCarePoint'];
      this._resetControlValues(valuesToReset)
    }
    return false;
  }

  isNOIVDD() {
    if (this.appInfoFormLocalModel.controls['isIvdd'].value &&
          this.appInfoFormLocalModel.controls['isIvdd'].value === NO) {
      return true;
    } else {
      const valuesToReset = ['hasDrug', 'hasDinNpn', 'din', 'npn', 'drugName', 'activeIngredients', 'manufacturer', 'otherPharmacopeia', 'compliance'];
      this._resetControlValues(valuesToReset);
    }
    return false;
  }

  hasDrug() {
    if (this.appInfoFormLocalModel.controls['hasDrug'].value &&
          this.appInfoFormLocalModel.controls['hasDrug'].value === YES) {
      return true;
    } else {
      const valuesToReset = ['hasDinNpn', 'compliance', 'din', 'npn', 'drugName', 'activeIngredients', 'manufacturer', 'selectedComplianceCodes', this.complianceChkFormArray, 'otherPharmacopeia'];
      this._resetControlValues(valuesToReset);
    }
    return false;
  }

  hasDin() {
    if (this.appInfoFormLocalModel.controls['hasDinNpn'].value &&
          this.appInfoFormLocalModel.controls['hasDinNpn'].value === 'din') {
      return true;
    } else {
      this._resetControlValues(['din']);
    }
    return false;
  }

  hasNpn() {
    if (this.appInfoFormLocalModel.controls['hasDinNpn'].value &&
        this.appInfoFormLocalModel.controls['hasDinNpn'].value === 'npn') {
      return true;
    } else {
      this._resetControlValues(['npn'])
    }
    return false;
  }

  dinNpnOnChange() {
    if (this.appInfoFormLocalModel.controls['hasDinNpn'].value &&
             this.appInfoFormLocalModel.controls['hasDinNpn'].value === 'nodinnpn') {
      const valuesToReset = ['din', 'npn'];
      this._resetControlValues(valuesToReset);
    }
    
  }

  isOtherPharmacopeia() {
    if (this.selectedComplianceCodes.includes(Compliance.OTHER)) {
      return true;
    } else {
      this._resetControlValues(['otherPharmacopeia']);
    }
    return false;
  }

  isIt() {
      if (this.appInfoFormLocalModel.controls['provisionMdrIT'].value) {
      return true;
    } else {
      this._resetControlValues(['applicationNum']);
    }
    return false;
  }

  isSa() {
    if (this.appInfoFormLocalModel.controls['provisionMdrSA'].value) {
      return true;
    } else {
      this._resetControlValues(['sapReqNum']);
    }
    return false;
  }

  isIoa() {
    if (this.appInfoFormLocalModel.controls['provisionMdrIOA'].value) {
      return true;
    } else {
      this._resetControlValues(['authNum']);
    }
    return false;
  }

  isLicenced() {
    if ((this.appInfoFormLocalModel.controls['activityType'].value === ActivityType.Licence
        || this.appInfoFormLocalModel.controls['activityType'].value === ActivityType.LicenceAmendment)
      && (this.appInfoFormLocalModel.controls['deviceClass'].value === DeviceClass.ClassIII
        || this.appInfoFormLocalModel.controls['deviceClass'].value === DeviceClass.ClassIV)) {
      return true;
    } else {
      this._resetControlValues(['declarationConformity']);
    }
    return false;
  }

  isMandatory() {
    if (this.appInfoFormLocalModel.controls['activityType'].value === ActivityType.Licence
      && (this.appInfoFormLocalModel.controls['deviceClass'].value === DeviceClass.ClassIII
        || this.appInfoFormLocalModel.controls['deviceClass'].value === DeviceClass.ClassIV)) {
      return true;
    }
    return false;
  }

  isNoDeclaration() {
    if (this.appInfoFormLocalModel.controls['declarationConformity'].value) {
      return (this.appInfoFormLocalModel.controls['declarationConformity'].value === NO);
    }
    return false;
  }

  isOptional() {
    if (this.appInfoFormLocalModel.controls['activityType'].value === ActivityType.LicenceAmendment
      && (this.appInfoFormLocalModel.controls['deviceClass'].value === DeviceClass.ClassIII
        || this.appInfoFormLocalModel.controls['deviceClass'].value === DeviceClass.ClassIV)) {
      return true;
    }
    return false;
  }

  isDeviceIV() {
    if (this.appInfoFormLocalModel.controls['deviceClass'].value === DeviceClass.ClassIV) {
      return true;
    }
    return false;
  }

  isDeviceIII() {
    if (this.appInfoFormLocalModel.controls['deviceClass'].value === DeviceClass.ClassIII) {
      return true;
    }
    return false;
  }

  hasDrugOnChange() {
    this._updateComplianceArray();
  }

  activityTypeOnChange() {
    if (this.appInfoFormLocalModel.controls['activityType'].value &&
      this.isActivityTypeLicence()){
      this._detailsService.raTypeLicence.set(true);
    }

    if (!this.appInfoFormLocalModel.controls['activityType'].value ||
      !this.isActivityTypeLicence()) {
      this._detailsService.raTypeLicence.set(false);
    }

    if (this.appInfoFormLocalModel.controls['activityType'].value &&
      this.isActivityTypeLicenceAmend()) {
      this._detailsService.raTypeLicenceAmend.set(true);
    }

    if (!this.appInfoFormLocalModel.controls['activityType'].value ||
      !this.isActivityTypeLicenceAmend()) {
      this._detailsService.raTypeLicenceAmend.set(false);
    }
  }

  isActivityTypeLicence() {
    if (this.appInfoFormLocalModel.controls['activityType'].value === ActivityType.Licence) {
      return true;
    }
    return false;
  }

  isActivityTypeLicenceAmend() {
    if (this.appInfoFormLocalModel.controls['activityType'].value === ActivityType.LicenceAmendment) {
      return true;
    }
    return false;
  }


  complianceOnChange() {
    this.appInfoFormLocalModel.controls['selectedComplianceCodes'].setValue(this.selectedComplianceCodes);
  }

  private _updateComplianceArray() {
    const complianceChkList = this._globalService.$complianceList;
    this.complianceOptionList = complianceChkList.map((item) => {
      return this._converterService.convertCodeToCheckboxOption(item, this.lang);
    });

    this.complianceOptionList.forEach(() => this.complianceChkFormArray.push(new FormControl(false)));
  }

  get complianceChkFormArray() {
    return this.appInfoFormLocalModel.controls['compliance'] as FormArray
  }

  get selectedComplianceCodes(): string[] {
    return this._detailsService.getSelectedComplianceCodes(this.complianceOptionList, this.complianceChkFormArray);
  }

}

