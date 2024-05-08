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

/**
 * Sample component is used for nothing
 */
export class ApplicationInfoDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  public appInfoFormLocalModel: FormGroup;
  @Input() showErrors: boolean;
  @Input() appInfoModel;
  @Input() deviceModel;
  @Input() materialInfo;

  @Input() helpTextSequences;
  @Input() loadFileIndicator;
  @Output() detailErrorList = new EventEmitter(true); // For processing app info details errors
  @Output() deviceErrorList = new EventEmitter(true); // For processing device component errors
  @Output() materialErrorList = new EventEmitter(true); // For processing material component errors (info + list)
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  
  @ViewChild(DeviceListComponent) aiDevices: DeviceListComponent;
  @ViewChild(MaterialInfoComponent) bioMaterialInfo: MaterialInfoComponent;

  // Lists for dropdowns
  public licenceAppTypeList: ICode[] = [];
  public mdsapOrgList: ICode[] = [];
  public actTypeList: ICode[] = [];
  public devClassList: ICodeAria[] = [];
  public drugTypeList: ICode[] = [];
  public yesNoList: ICode[] = [];

  public seriousDiagnosisReasonOptionList: CheckboxOption[] = [];
  public complianceOptionList: CheckboxOption[] = [];

  // Lists for checkboxes
  public diagnosisReasonCodeList: ICode[] = [];
  public complianceCodeList: ICode[] = [];

  public showFieldErrors = false;

  lang = this._globalService.lang();

  constructor(private _fb: FormBuilder, // todo: private dataLoader: DossierDataLoaderService,
              private _detailsService : ApplicationInfoDetailsService,
              private _globalService : GlobalService,
              private _converterService : ConverterService,
              private _utilsService: UtilsService) {
    // todo: dataLoader = new DossierDataLoaderService(this.http);
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
    this.diagnosisReasonCodeList = this._globalService.$diagnosisReasonList;
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

    // since we can't detect changes on objects, using a separate flag
    // if (changes['detailsChanged']) { // used as a change indicator for the model
      // console.log("the details cbange");
      // if (this.appInfoFormRecord) {
      //   this.setToLocalModel();

      // } else {
      //   this.appInfoFormLocalModel = this.detailsService.getReactiveModel(this._fb);
      //   this.appInfoFormLocalModel.markAsPristine();
      // }
    // }
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
      this._detailsService.mapDataModelToFormModel(dataModel, this.appInfoFormLocalModel, this.complianceCodeList, this.diagnosisReasonCodeList, this.complianceOptionList, this.seriousDiagnosisReasonOptionList, this.lang);
    }
  }

  deviceClassOnblur() {
    if (!this.appInfoFormLocalModel.controls['deviceClass'].value ||
      !this.isDeviceIV()) {
      this.materialErrorList.emit(true);
    }
  }

  processDeviceErrors(errorList) {
    this.deviceErrorList.emit(errorList);
  }

  private _resetControlValues(listOfValues : string[]) {
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
      const valuesToReset = ['hasDinNpn', 'compliance', 'din', 'npn', 'drugName', 'activeIngredients', 'manufacturer','otherPharmacopeia'];
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

  priorityRequestedOnChange() {
    this._updateDiagnosisReasonArray();
  }

  showDiagnosisReasons() {
    if (this.appInfoFormLocalModel.controls['isPriorityReq'].value &&
          this.appInfoFormLocalModel.controls['isPriorityReq'].value === YES) {
         return true;
    }
    else {
      this._utilsService.resetControlsValues(this.appInfoFormLocalModel.controls['diagnosisReasons']);
    }
    return false;
  }

  hasDrugOnChange() {
    this._updateComplianceArray();
  }

  seriousDiagnosisOnChange() {
    this.appInfoFormLocalModel.controls['selectedDiagnosisCodes'].setValue(this.selectedDiagnosisCodes);
  }

  complianceOnChange() {
    this.appInfoFormLocalModel.controls['selectedComplianceCodes'].setValue(this.selectedComplianceCodes);
  }

  private _updateDiagnosisReasonArray() {
    const diagnosisReasonList = this._globalService.$diagnosisReasonList;
    this.seriousDiagnosisReasonOptionList = diagnosisReasonList.map((item) => {
      return this._converterService.convertCodeToCheckboxOption(item, this.lang);
    });

    this.seriousDiagnosisReasonOptionList.forEach(() => this.diagnosisReasonChkFormArray.push(new FormControl(false)));
  } 

  private _updateComplianceArray() {
    const complianceChkList = this._globalService.$complianceList;
    this.complianceOptionList = complianceChkList.map((item) => {
      return this._converterService.convertCodeToCheckboxOption(item, this.lang);
    });

    this.complianceOptionList.forEach(() => this.complianceChkFormArray.push(new FormControl(false)));
  }

  get diagnosisReasonChkFormArray() {
    return this.appInfoFormLocalModel.controls['diagnosisReasons'] as FormArray

  }

  get selectedDiagnosisCodes(): string[] {
    return this._detailsService.getSelectedDiagnosisCodes(this.seriousDiagnosisReasonOptionList, this.diagnosisReasonChkFormArray);
  }

  get complianceChkFormArray() {
    return this.appInfoFormLocalModel.controls['compliance'] as FormArray
  }

  get selectedComplianceCodes(): string[] {
    return this._detailsService.getSelectedComplianceCodes(this.complianceOptionList, this.complianceChkFormArray);
  }

}
