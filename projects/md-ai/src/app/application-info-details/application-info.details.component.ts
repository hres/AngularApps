import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import { CheckboxOption, ControlMessagesComponent, YES, NO, ConverterService, ICode, UtilsService, ICodeAria } from '@hpfb/sdk/ui';
import {HttpClient} from '@angular/common/http';
// import {DeviceListComponent} from '../device/device.list/device.list.component';
// import {MaterialListComponent} from '../bio-material/material.list/material.list.component';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationInfoDetailsService} from './application-info.details.service';
import { GlobalService } from '../global/global.service';
import { DeviceClass, ActivityType, Compliance} from '../app.constants';

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
  @Input() countryList;
  @Input() appInfoModel;
  @Input() deviceModel;
  @Input() materialModel;
  @Input() lang;
  @Input() helpTextSequences;
  @Output() declarationConformity = new EventEmitter();
  @Output() detailErrorList = new EventEmitter(true);
  @Output() deviceErrorList = new EventEmitter(true);
  @Output() materialErrorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  //@ViewChild(DeviceListComponent, {static: true}) aiDevices: DeviceListComponent;
  //@ViewChild(MaterialListComponent, {static: false}) bioMaterials: MaterialListComponent;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public licenceAppTypeList: ICode[] = [];
  public mdsapOrgList: ICode[] = [];
  public actTypeList: ICode[] = [];
  public devClassList: ICodeAria[] = [];
  public drugTypeList: ICode[] = [];
  public yesNoList: ICode[] = [];

  public seriousDiagnosisReasonList: CheckboxOption[] = [];
  public complianceList: CheckboxOption[] = [];


  public showFieldErrors = false;

  constructor(private _fb: FormBuilder, // todo: private dataLoader: DossierDataLoaderService,
              private http: HttpClient, private translate: TranslateService,
              private cdr: ChangeDetectorRef,
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

    // this.detailsChanged = 0;
    // ApplicationInfoDetailsService.setLang(this.lang);
    // this.mdsapOrgList = ApplicationInfoDetailsService.getMdsapOrgListList(this.lang);
    // this.devClassList = ApplicationInfoDetailsService.getDeviceClassList(this.lang);
    // this.drugTypeList = ApplicationInfoDetailsService.getDrugTypes(this.lang);
    // this.licenceAppTypeList = ApplicationInfoDetailsService.getLicenceAppTypeList(this.lang); // todo: test which lang is working
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
    if (changes['detailsChanged']) { // used as a change indicator for the model
      // console.log("the details cbange");
      // if (this.appInfoFormRecord) {
      //   this.setToLocalModel();

      // } else {
      //   this.appInfoFormLocalModel = this.detailsService.getReactiveModel(this._fb);
      //   this.appInfoFormLocalModel.markAsPristine();
      // }
    }
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
    if (changes['appInfoFormLocalModel']) {
      console.log('**********the app info details changed');
      //this.appInfoFormRecord = this.appInfoFormLocalModel;
    }
    if (changes['appInfoModel']) {
      const dataModel = changes['appInfoModel'].currentValue;
      if (!this.appInfoFormLocalModel) {
        this.appInfoFormLocalModel = this._detailsService.getReactiveModel(this._fb);
        this.appInfoFormLocalModel.markAsPristine();
      }
      // emit declarationConformity value
      // if (this.appInfoFormLocalModel.controls.declarationConformity) {
      //   this.declarationConformity.emit(this.appInfoFormLocalModel.controls.declarationConformity.value);
      // }
      ApplicationInfoDetailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.appInfoFormLocalModel));
      this._updateLists();
      this._hasReasonChecked();
      this._hasMaterialRecord();
    }
  }

  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    // this.appInfoFormLocalModel = this.appInfoFormRecord;
    // if (!this.appInfoFormLocalModel.pristine) {
    //   this.appInfoFormLocalModel.markAsPristine();
    // }
  }


  onblur() {
    this._saveData();
  }

  private _saveData(): void{
    // save data to output model
    this._detailsService.mapFormModelToDataModel((<FormGroup>this.appInfoFormLocalModel), this.appInfoModel);
  }

  complianceOnblur() {
    this._hasReasonChecked();
    this.onblur();
  }

  // hasRecombinantOnblur() {
  //   if (!this.appInfoFormLocalModel.controls.hasRecombinant.value ||
  //       this.appInfoFormLocalModel.controls.hasRecombinant.value === GlobalsService.NO) {
  //     this.materialModel = [];
  //   }
  //   this.onblur();
  // }

  isAnimalHumanSourcedOnblur() {
    // if (!this.appInfoFormLocalModel.controls.isAnimalHumanSourced.value ||
    //   this.appInfoFormLocalModel.controls.isAnimalHumanSourced.value === GlobalsService.NO) {
    //   this.materialModel = [];
    // }
    this.onblur();
  }

  deviceClassOnblur() {
    if (!this.appInfoFormLocalModel.controls['deviceClass'].value ||
      !this.isDeviceIV()) {
      const valuesToReset = ['hasRecombinant', 'isAnimalHumanSourced', 'isListedIddTable'];
      // this._resetValuesToNull(valuesToReset);
      this._resetControlValues(valuesToReset)
      // this.appInfoFormLocalModel.controls['hasRecombinant'].setValue(null);
      // this.appInfoFormLocalModel.controls['hasRecombinant'].markAsUntouched();
      // this.appInfoFormLocalModel.controls['isAnimalHumanSourced'].setValue(null);
      // this.appInfoFormLocalModel.controls['isAnimalHumanSourced'].markAsUntouched();
      // this.appInfoFormLocalModel.controls['isListedIddTable'].setValue(null);
      // this.appInfoFormLocalModel.controls['isListedIddTable'].markAsUntouched();
      this.materialModel = [];
    }
    this.onblur();
  }

  private _hasReasonChecked() {
    // this.appInfoFormLocalModel.controls.hasCompliance.setValue(null);
    // if (this.appInfoFormLocalModel.controls.complianceUsp.value ||
    //   this.appInfoFormLocalModel.controls.complianceGmp.value ||
    //   this.appInfoFormLocalModel.controls.complianceOther.value) {
    //   this.appInfoFormLocalModel.controls.hasCompliance.setValue('filled');
    // }
  }

  private _hasMaterialRecord() {
    // this.appInfoFormLocalModel.controls.hasMaterial.setValue(null);
    // if (this.materialModel && this.materialModel.length > 0) {
    //   this.appInfoFormLocalModel.controls.hasMaterial.setValue('hasRecord');
    // }
  }

  isMdsap() {
    // const iscert = this.appInfoFormLocalModel.controls.hasMdsap.value;
    // return (iscert && iscert === GlobalsService.YES);
  }

  processDeviceErrors(errorList) {
    this.deviceErrorList.emit(errorList);

  }

  processMaterialErrors(errorList) {
    this.materialErrorList.emit(errorList);
    this._hasMaterialRecord();
  }

  // private _resetValuesToNull(listOfValues : string[]) {
  //   for (let i = 0; i < listOfValues.length; i++) {
  //     this.appInfoFormLocalModel.controls[listOfValues[i]].setValue(null);
  //     this.appInfoFormLocalModel.controls[listOfValues[i]].markAsUntouched();
  //   }
  // }

  // private _resetValuesToEmpty(listOfValues : string[]) {
  //   for (let i = 0; i < listOfValues.length; i++) {
  //     this.appInfoFormLocalModel.controls[listOfValues[i]].setValue('');
  //     this.appInfoFormLocalModel.controls[listOfValues[i]].markAsUntouched();
  //   }
  // }

  private _resetControlValues(listOfValues : string[]) {
    for (let i = 0; i < listOfValues.length; i++) {
      this._utilsService.resetControlsValues(this.appInfoFormLocalModel.controls[listOfValues[i]]);
    }
  }

  isIVDD() {
    if (this.appInfoFormLocalModel.controls['isIvdd'].value &&
        this.appInfoFormLocalModel.controls['isIvdd'].value.id === YES) {
      return true;
    } else {
      const valuesToReset = ['isHomeUse', 'isCarePoint'];
      this._resetControlValues(valuesToReset)
      // this._resetValuesToNull(valuesToReset);
      // this._utilsService.resetControlsValues(this.appInfoFormLocalModel.controls['isHomeUse'], this.appInfoFormLocalModel.controls['isCarePoint'])
      // this.appInfoFormLocalModel.controls['isHomeUse'].setValue(null);
      // this.appInfoFormLocalModel.controls['isHomeUse'].markAsUntouched();
      // this.appInfoFormLocalModel.controls['isCarePoint'].setValue(null);
      // this.appInfoFormLocalModel.controls['isCarePoint'].markAsUntouched();
    }
    return false;
  }

  isNOIVDD() {
    if (this.appInfoFormLocalModel.controls['isIvdd'].value &&
          this.appInfoFormLocalModel.controls['isIvdd'].value.id === NO) {
      return true;
    } else {
      const valuesToReset = ['hasDrug', 'hasDinNpn', 'din', 'npn', 'drugName', 'activeIngredients', 'manufacturer', 'otherPharmacopeia', 'compliance'];
      this._resetControlValues(valuesToReset);
      // this._resetValuesToNull(['hasDrug', 'hasDinNpn',]);
      // this._resetValuesToEmpty(['din', 'npn', 'drugName', 'activeIngredients', 'manufacturer', 'otherPharmacopeia']);
      // this._utilsService.resetControlsValues(this.appInfoFormLocalModel.controls['compliance'], );
      // this.appInfoFormLocalModel.controls.hasDrug.setValue(null);
      // this.appInfoFormLocalModel.controls.hasDrug.markAsUntouched();
      // this.appInfoFormLocalModel.controls.hasDinNpn.setValue(null);
      // this.appInfoFormLocalModel.controls.hasDinNpn.markAsUntouched();
      // this.appInfoFormLocalModel.controls.din.setValue('');
      // this.appInfoFormLocalModel.controls.din.markAsUntouched();
      // this.appInfoFormLocalModel.controls.npn.setValue('');
      // this.appInfoFormLocalModel.controls.npn.markAsUntouched();
      // this.appInfoFormLocalModel.controls.drugName.setValue('');
      // this.appInfoFormLocalModel.controls.drugName.markAsUntouched();
      // this.appInfoFormLocalModel.controls.activeIngredients.setValue('');
      // this.appInfoFormLocalModel.controls.activeIngredients.markAsUntouched();
      // this.appInfoFormLocalModel.controls.manufacturer.setValue('');
      // this.appInfoFormLocalModel.controls.manufacturer.markAsUntouched();
      // this.appInfoFormLocalModel.controls.complianceUsp.setValue(false);
      // this.appInfoFormLocalModel.controls.complianceUsp.markAsUntouched();
      // this.appInfoFormLocalModel.controls.complianceGmp.setValue(false);
      // this.appInfoFormLocalModel.controls.complianceGmp.markAsUntouched();
      // this.appInfoFormLocalModel.controls.complianceOther.setValue(false);
      // this.appInfoFormLocalModel.controls.complianceOther.markAsUntouched();
      // this.appInfoFormLocalModel.controls.otherPharmacopeia.setValue('');
      // this.appInfoFormLocalModel.controls.otherPharmacopeia.markAsUntouched();
    }
    return false;
  }

  hasDrug() {
    if (this.appInfoFormLocalModel.controls['hasDrug'].value &&
          this.appInfoFormLocalModel.controls['hasDrug'].value.id === YES) {
      return true;
    } else {
      const valuesToReset = ['hasDinNpn', 'compliance', 'din', 'npn', 'drugName', 'activeIngredients', 'manufacturer','otherPharmacopeia'];
      this._resetControlValues(valuesToReset);
      // this._resetValuesToNull(['hasDinNpn']);
      // this._utilsService.resetControlsValues(this.appInfoFormLocalModel.controls['compliance']);
      // this._resetValuesToEmpty(['din', 'npn', 'drugName', 'activeIngredients', 'manufacturer','otherPharmacopeia'])
      // this.appInfoFormLocalModel.controls.hasDinNpn.setValue(null);
      // this.appInfoFormLocalModel.controls.hasDinNpn.markAsUntouched();
      // this.appInfoFormLocalModel.controls.din.setValue('');
      // this.appInfoFormLocalModel.controls.din.markAsUntouched();
      // this.appInfoFormLocalModel.controls.npn.setValue('');
      // this.appInfoFormLocalModel.controls.npn.markAsUntouched();
      // this.appInfoFormLocalModel.controls.drugName.setValue('');
      // this.appInfoFormLocalModel.controls.drugName.markAsUntouched();
      // this.appInfoFormLocalModel.controls.activeIngredients.setValue('');
      // this.appInfoFormLocalModel.controls.activeIngredients.markAsUntouched();
      // this.appInfoFormLocalModel.controls.manufacturer.setValue('');
      // this.appInfoFormLocalModel.controls.manufacturer.markAsUntouched();
      // this.appInfoFormLocalModel.controls.complianceUsp.setValue(false);
      // this.appInfoFormLocalModel.controls.complianceUsp.markAsUntouched();
      // this.appInfoFormLocalModel.controls.complianceGmp.setValue(false);
      // this.appInfoFormLocalModel.controls.complianceGmp.markAsUntouched();
      // this.appInfoFormLocalModel.controls.complianceOther.setValue(false);
      // this.appInfoFormLocalModel.controls.complianceOther.markAsUntouched();
      // this.appInfoFormLocalModel.controls.otherPharmacopeia.setValue('');
      // this.appInfoFormLocalModel.controls.otherPharmacopeia.markAsUntouched();
    }
    return false;
  }

  hasDin() {
    console.log(this.appInfoFormLocalModel.controls['hasDinNpn'].value);
    if (this.appInfoFormLocalModel.controls['hasDinNpn'].value &&
          this.appInfoFormLocalModel.controls['hasDinNpn'].value === 'din') {
      return true;
    } else {
      this._resetControlValues(['din']);
      // this._resetValuesToEmpty(['din']);
      // this.appInfoFormLocalModel.controls.din.setValue('');
      // this.appInfoFormLocalModel.controls.din.markAsUntouched();
    }
    return false;
  }

  hasNpn() {
    if (this.appInfoFormLocalModel.controls['hasDinNpn'].value &&
        this.appInfoFormLocalModel.controls['hasDinNpn'].value === 'npn') {
      return true;
    } else {
      this._resetControlValues(['npn'])
      // this._resetValuesToEmpty(['npn']);
      // this.appInfoFormLocalModel.controls.npn.setValue('');
      // this.appInfoFormLocalModel.controls.npn.markAsUntouched();
    }
    return false;
  }

  // Is this used??
  isNoDinNpn() {
    // if (this.appInfoFormLocalModel.controls.hasDinNpn.value &&
    //       this.appInfoFormLocalModel.controls.hasDinNpn.value === 'nodinnpn') {
    //   return true;
    // } else {
    //   this.appInfoFormLocalModel.controls.drugName.setValue('');
    //   this.appInfoFormLocalModel.controls.drugName.markAsUntouched();
    //   this.appInfoFormLocalModel.controls.activeIngredients.setValue('');
    //   this.appInfoFormLocalModel.controls.activeIngredients.markAsUntouched();
    //   this.appInfoFormLocalModel.controls.manufacturer.setValue('');
    //   this.appInfoFormLocalModel.controls.manufacturer.markAsUntouched();
    //   this.appInfoFormLocalModel.controls.complianceUsp.setValue(false);
    //   this.appInfoFormLocalModel.controls.complianceUsp.markAsUntouched();
    //   this.appInfoFormLocalModel.controls.complianceGmp.setValue(false);
    //   this.appInfoFormLocalModel.controls.complianceGmp.markAsUntouched();
    //   this.appInfoFormLocalModel.controls.complianceOther.setValue(false);
    //   this.appInfoFormLocalModel.controls.complianceOther.markAsUntouched();
    //   this.appInfoFormLocalModel.controls.otherPharmacopeia.setValue('');
    //   this.appInfoFormLocalModel.controls.otherPharmacopeia.markAsUntouched();
    // }
    // return false;
  }

  isOtherPharmacopeia() {
    if (this.selectedComplianceCodes.includes(Compliance.OTHER)) {
      return true;
    } else {
      this._resetControlValues(['otherPharmacopeia']);
      // this.appInfoFormLocalModel.controls.otherPharmacopeia.setValue('');
      // this.appInfoFormLocalModel.controls.otherPharmacopeia.markAsUntouched();
    }
    return false;
  }

  isIt() {
      if (this.appInfoFormLocalModel.controls['provisionMdrIT'].value) {
      return true;
    } else {
      this._resetControlValues(['applicationNum']);
      // this.appInfoFormLocalModel.controls['applicationNum'].setValue('');
      // this.appInfoFormLocalModel.controls['applicationNum'].markAsUntouched();
    }
    return false;
  }

  isSa() {
    if (this.appInfoFormLocalModel.controls['provisionMdrSA'].value) {
      return true;
    } else {
      this._resetControlValues(['sapReqNum']);
      // this.appInfoFormLocalModel.controls['sapReqNum'].setValue('');
      // this.appInfoFormLocalModel.controls['sapReqNum'].markAsUntouched();
    }
    return false;
  }

  isIoa() {
    if (this.appInfoFormLocalModel.controls['provisionMdrIOA'].value) {
      return true;
    } else {
      this._resetControlValues(['authNum']);
      // this.appInfoFormLocalModel.controls['authNum'].setValue('');
      // this.appInfoFormLocalModel.controls['authNum'].markAsUntouched();
    }
    return false;
  }

  // Is this used??
  isRecombinant() {
    // if (this.appInfoFormLocalModel.controls.hasRecombinant.value &&
    //       this.appInfoFormLocalModel.controls.hasRecombinant.value === GlobalsService.YES) {
    //     return true;
    // } else {
    //     this.appInfoFormLocalModel.controls.isAnimalHumanSourced.setValue(null);
    //     this.appInfoFormLocalModel.controls.isAnimalHumanSourced.markAsUntouched();
    //     this.appInfoFormLocalModel.controls.isListedIddTable.setValue(null);
    //     this.appInfoFormLocalModel.controls.isListedIddTable.markAsUntouched();
    //     // this.materialModel = [];
    // }
    // return false;
  }

  isAnimalHumanSourced() {
    if (this.appInfoFormLocalModel.controls['isAnimalHumanSourced'].value &&
          this.appInfoFormLocalModel.controls['isAnimalHumanSourced'].value.id === YES) {
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

  // Not needed - deleted activity lead
  private _updateLists() {
    // if (this.actLeadList && this.actLeadList.length > 0) {
    //   if (this.appInfoFormLocalModel.controls.activityLead.value === this.actLeadList[0].id) {
    //     this.actTypeList = ApplicationInfoDetailsService.getActivityTypeMDBList(this.lang);
    //   } else if (this.appInfoFormLocalModel.controls.activityLead.value === this.actLeadList[1].id) {
    //     this.actTypeList = ApplicationInfoDetailsService.getActivityTypePVList(this.lang);
    //   }
    // }
  }

  // Can remove since we removed licenced lead
  activityLeadOnblur() {
    // if (this.appInfoFormLocalModel.controls.activityLead.value) {
    //   if (this.appInfoFormLocalModel.controls.activityLead.value === this.actLeadList[0].id) {
    //     this.actTypeList = ApplicationInfoDetailsService.getActivityTypeMDBList(this.lang);
    //   } else if (this.appInfoFormLocalModel.controls.activityLead.value === this.actLeadList[1].id) {
    //     this.actTypeList = ApplicationInfoDetailsService.getActivityTypePVList(this.lang);
    //   }
    // } else {
    //   this.actTypeList = [];
    // }
    // this.appInfoFormLocalModel.controls.activityType.setValue(null);
    // this.appInfoFormLocalModel.controls.activityType.markAsUntouched();
    // this.appInfoFormLocalModel.controls.deviceClass.setValue(null);
    // this.appInfoFormLocalModel.controls.deviceClass.markAsUntouched();
    // this.onblur();
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
      return (this.appInfoFormLocalModel.controls['declarationConformity'].value.id === NO);
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
          this.appInfoFormLocalModel.controls['isPriorityReq'].value.id === YES) {
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
    this.onblur();
  }

  complianceOnChange() {
    this.onblur();
  }

  private _updateDiagnosisReasonArray() {
    const diagnosisReasonList = this._globalService.$diagnosisReasonList;
    console.log("#1", diagnosisReasonList);
    this.seriousDiagnosisReasonList = diagnosisReasonList.map((item) => {
      return this._converterService.convertCodeToCheckboxOption(item, this.lang);
    });
    console.log("#2", this.seriousDiagnosisReasonList);

    this.seriousDiagnosisReasonList.forEach(() => this.diagnosisReasonChkFormArray.push(new FormControl(false)));
    console.log("#3", this.seriousDiagnosisReasonList);
  } 

  private _updateComplianceArray() {
    const complianceChkList = this._globalService.$complianceList;
    console.log("#1", complianceChkList);
    this.complianceList = complianceChkList.map((item) => {
      return this._converterService.convertCodeToCheckboxOption(item, this.lang);
    });
    console.log("#2", this.complianceList);

    this.complianceList.forEach(() => this.complianceChkFormArray.push(new FormControl(false)));
    console.log("#3", this.complianceList);
  }

  get diagnosisReasonChkFormArray() {
    return this.appInfoFormLocalModel.controls['diagnosisReasons'] as FormArray

  }

  get selectedDiagnosisCodes(): string[] {
    return this._detailsService.getSelectedDiagnosisCodes(this.seriousDiagnosisReasonList, this.diagnosisReasonChkFormArray);
  }

  get complianceChkFormArray() {
    return this.appInfoFormLocalModel.controls['compliance'] as FormArray
  }

  get selectedComplianceCodes(): string[] {
    return this._detailsService.getSelectedComplianceCodes(this.complianceList, this.complianceChkFormArray);
  }

}

