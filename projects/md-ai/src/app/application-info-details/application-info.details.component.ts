import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import { CheckboxOption, ControlMessagesComponent, YES, NO, ConverterService, ICode, UtilsService, ICodeAria, ICodeDefinition } from '@hpfb/sdk/ui';
import {HttpClient} from '@angular/common/http';
// import {DeviceListComponent} from '../device/device.list/device.list.component';
// import {MaterialListComponent} from '../bio-material/material.list/material.list.component';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationInfoDetailsService} from './application-info.details.service';
import { GlobalService } from '../global/global.service';
import { DeviceClass, ActivityType, Compliance} from '../app.constants';
import { FormDataLoaderService } from '../container/form-data-loader.service';

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
  //@Input('group') public appInfoFormRecord: FormGroup;
  //@Input() detailsChanged: number;
  @Input() showErrors: boolean;
  //@Input() countryList;
  @Input() appInfoModel;
  @Input() deviceModel;
  @Input() materialModel;
  @Input() lang;
  @Input() helpTextSequences;
  // @Output() declarationConformity = new EventEmitter();
  @Output() detailErrorList = new EventEmitter(true);
  @Output() deviceErrorList = new EventEmitter(true);
  @Output() materialErrorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  //@ViewChild(DeviceListComponent, {static: true}) aiDevices: DeviceListComponent;
  //@ViewChild(MaterialListComponent, {static: false}) bioMaterials: MaterialListComponent;

  public licenceAppTypeList: ICode[] = [];
  public mdsapOrgList: ICode[] = [];
  public actTypeList: ICode[] = [];
  public devClassList: ICodeAria[] = [];
  public drugTypeList: ICode[] = [];
  public yesNoList: ICode[] = [];

  public seriousDiagnosisReasonOptionList: CheckboxOption[] = [];
  public complianceOptionList: CheckboxOption[] = [];

  public diagnosisReasonCodeList: ICode[] = [];
  public complianceCodeList: ICode[] = [];

  public showFieldErrors = false;

  constructor(private _fb: FormBuilder, // todo: private dataLoader: DossierDataLoaderService,
              private _detailsService : ApplicationInfoDetailsService,
              private _globalService : GlobalService,
              private _converterService : ConverterService,
              private _utilsService: UtilsService) {
    // todo: dataLoader = new DossierDataLoaderService(this.http);
    this.showFieldErrors = false;
    this.showErrors = false;
    // this.detailsService = new ApplicationInfoDetailsService();
    // this.deviceClassList = this.detailsService.getDeviceClassList();
    // this.yesNoList = this.detailsService.getYesNoList();
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
    // if (changes['deviceClassList']) {
    //   this.devClassList = changes['deviceClassList'].currentValue;
    // }
    // if (changes['appInfoFormLocalModel']) {
    //   console.log('**********the app info details changed');
    //   //this.appInfoFormRecord = this.appInfoFormLocalModel;
    // }
    if (changes['appInfoModel']) {
      const dataModel = changes['appInfoModel'].currentValue;
      if (!this.appInfoFormLocalModel) {
        this.appInfoFormLocalModel = this._detailsService.getReactiveModel(this._fb);
        this.appInfoFormLocalModel.markAsPristine();
      }
      this._detailsService.mapDataModelToFormModel(dataModel, this.appInfoFormLocalModel, this.complianceCodeList, this.diagnosisReasonCodeList, this.complianceOptionList, this.seriousDiagnosisReasonOptionList, this.lang);
      //this._updateLists();
      // this._hasReasonChecked();
      this._hasMaterialRecord();
    }
  }

  /**
   * Uses the updated reactive forms model locally
   */

  // setToLocalModel() {
    // this.appInfoFormLocalModel = this.appInfoFormRecord;
    // if (!this.appInfoFormLocalModel.pristine) {
    //   this.appInfoFormLocalModel.markAsPristine();
    // }
  // }


  onblur() {
    this._saveData();
  }

  private _saveData(): void{
    // save data to output model
    this._detailsService.mapFormModelToDataModel((<FormGroup>this.appInfoFormLocalModel), this.appInfoModel, this.selectedComplianceCodes, this.selectedDiagnosisCodes, this.lang);
  }

  // For bio materials 
  isAnimalHumanSourcedOnblur() {
    if (!this.appInfoFormLocalModel.controls['isAnimalHumanSourced'].value ||
      this.appInfoFormLocalModel.controls['isAnimalHumanSourced'].value === NO) {
      this.materialModel = [];
    }
    this.onblur();
  }

  deviceClassOnblur() {
    if (!this.appInfoFormLocalModel.controls['deviceClass'].value ||
      !this.isDeviceIV()) {
      const valuesToReset = ['hasRecombinant', 'isAnimalHumanSourced', 'isListedIddTable'];
      this._resetControlValues(valuesToReset)
      this.materialModel = [];
    }
    this.onblur();
  }

  // For bio material
  private _hasMaterialRecord() {
    // this.appInfoFormLocalModel.controls.hasMaterial.setValue(null);
    // if (this.materialModel && this.materialModel.length > 0) {
    //   this.appInfoFormLocalModel.controls.hasMaterial.setValue('hasRecord');
    // }
  }

  processDeviceErrors(errorList) {
    this.deviceErrorList.emit(errorList);

  }

  processMaterialErrors(errorList) {
    this.materialErrorList.emit(errorList);
    this._hasMaterialRecord();
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
    this.onblur();

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

  // For bio materials
  isAnimalHumanSourced() {
    if (this.appInfoFormLocalModel.controls['isAnimalHumanSourced'].value &&
          this.appInfoFormLocalModel.controls['isAnimalHumanSourced'].value === YES) {
        // this.bioMaterials. = ;
        return true;
    } else {
      this._resetControlValues(['isListedIddTable']);
        // this.appInfoFormLocalModel.controls.isListedIddTable.setValue(null);
        // this.appInfoFormLocalModel.controls.isListedIddTable.markAsUntouched();
        // this.materialModel = [];
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
    this.onblur();
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
    this.onblur();
  }

  seriousDiagnosisOnChange() {
    this._saveData();
  }

  complianceOnChange() {
    this._saveData();
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

