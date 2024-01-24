import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, FormControl} from '@angular/forms';
import { CheckboxOption, ControlMessagesComponent, ConverterService, ICode, UtilsService } from '@hpfb/sdk/ui';
import {HttpClient} from '@angular/common/http';
// import {DeviceListComponent} from '../device/device.list/device.list.component';
// import {MaterialListComponent} from '../bio-material/material.list/material.list.component';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationInfoDetailsService} from './application-info.details.service';
import { GlobalService } from '../global/global.service';
import { DeviceClass } from '../app.constants';

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
  public deviceClassList: Array<any> = [];

  public licenceAppTypeList: ICode[] = [];
  public mdsapOrgList: ICode[] = [];
  public actTypeList: ICode[] = [];
  public devClassList: ICode[] = [];
  public drugTypeList: ICode[] = [];
  public yesNoList: ICode[] = [];


  public showFieldErrors = false;

  constructor(private _fb: FormBuilder, // todo: private dataLoader: DossierDataLoaderService,
              private http: HttpClient, private translate: TranslateService,
              private cdr: ChangeDetectorRef,
              private _detailsService : ApplicationInfoDetailsService,
              private _globalService : GlobalService) {
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
    if (changes['deviceClassList']) {
      this.deviceClassList = changes['deviceClassList'].currentValue;
    }
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
      this.appInfoFormLocalModel.controls['hasRecombinant'].setValue(null);
      this.appInfoFormLocalModel.controls['hasRecombinant'].markAsUntouched();
      this.appInfoFormLocalModel.controls['isAnimalHumanSourced'].setValue(null);
      this.appInfoFormLocalModel.controls['isAnimalHumanSourced'].markAsUntouched();
      this.appInfoFormLocalModel.controls['isListedIddTable'].setValue(null);
      this.appInfoFormLocalModel.controls['isListedIddTable'].markAsUntouched();
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

  isIVDD() {
    // if (this.appInfoFormLocalModel.controls.isIvdd.value &&
    //     this.appInfoFormLocalModel.controls.isIvdd.value === GlobalsService.YES) {
    //   return true;
    // } else {
    //   this.appInfoFormLocalModel.controls.isHomeUse.setValue(null);
    //   this.appInfoFormLocalModel.controls.isHomeUse.markAsUntouched();
    //   this.appInfoFormLocalModel.controls.isCarePoint.setValue(null);
    //   this.appInfoFormLocalModel.controls.isCarePoint.markAsUntouched();
    // }
    // return false;
  }

  isNOIVDD() {
    // if (this.appInfoFormLocalModel.controls.isIvdd.value &&
    //       this.appInfoFormLocalModel.controls.isIvdd.value === GlobalsService.NO) {
    //   return true;
    // } else {
    //   this.appInfoFormLocalModel.controls.hasDrug.setValue(null);
    //   this.appInfoFormLocalModel.controls.hasDrug.markAsUntouched();
    //   this.appInfoFormLocalModel.controls.hasDinNpn.setValue(null);
    //   this.appInfoFormLocalModel.controls.hasDinNpn.markAsUntouched();
    //   this.appInfoFormLocalModel.controls.din.setValue('');
    //   this.appInfoFormLocalModel.controls.din.markAsUntouched();
    //   this.appInfoFormLocalModel.controls.npn.setValue('');
    //   this.appInfoFormLocalModel.controls.npn.markAsUntouched();
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

  hasDrug() {
    // if (this.appInfoFormLocalModel.controls.hasDrug.value &&
    //       this.appInfoFormLocalModel.controls.hasDrug.value === GlobalsService.YES) {
    //   return true;
    // } else {
    //   this.appInfoFormLocalModel.controls.hasDinNpn.setValue(null);
    //   this.appInfoFormLocalModel.controls.hasDinNpn.markAsUntouched();
    //   this.appInfoFormLocalModel.controls.din.setValue('');
    //   this.appInfoFormLocalModel.controls.din.markAsUntouched();
    //   this.appInfoFormLocalModel.controls.npn.setValue('');
    //   this.appInfoFormLocalModel.controls.npn.markAsUntouched();
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

  hasDin() {
    // if (this.appInfoFormLocalModel.controls.hasDinNpn.value &&
    //       this.appInfoFormLocalModel.controls.hasDinNpn.value === 'din') {
    //   return true;
    // } else {
    //   this.appInfoFormLocalModel.controls.din.setValue('');
    //   this.appInfoFormLocalModel.controls.din.markAsUntouched();
    // }
    // return false;
  }

  hasNpn() {
    // if (this.appInfoFormLocalModel.controls.hasDinNpn.value &&
    //     this.appInfoFormLocalModel.controls.hasDinNpn.value === 'npn') {
    //   return true;
    // } else {
    //   this.appInfoFormLocalModel.controls.npn.setValue('');
    //   this.appInfoFormLocalModel.controls.npn.markAsUntouched();
    // }
    // return false;
  }

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
    // if (this.appInfoFormLocalModel.controls.complianceOther.value) {
    //   return true;
    // } else {
    //   this.appInfoFormLocalModel.controls.otherPharmacopeia.setValue('');
    //   this.appInfoFormLocalModel.controls.otherPharmacopeia.markAsUntouched();
    // }
    // return false;
  }

  isIt() {
      if (this.appInfoFormLocalModel.controls['provisionMdrIT'].value) {
      return true;
    } else {
      this.appInfoFormLocalModel.controls['applicationNum'].setValue('');
      this.appInfoFormLocalModel.controls['applicationNum'].markAsUntouched();
    }
    return false;
  }

  isSa() {
    if (this.appInfoFormLocalModel.controls['provisionMdrSA'].value) {
      return true;
    } else {
      this.appInfoFormLocalModel.controls['sapReqNum'].setValue('');
      this.appInfoFormLocalModel.controls['sapReqNum'].markAsUntouched();
    }
    return false;
  }

  isIoa() {
    if (this.appInfoFormLocalModel.controls['provisionMdrIOA'].value) {
      return true;
    } else {
      this.appInfoFormLocalModel.controls['authNum'].setValue('');
      this.appInfoFormLocalModel.controls['authNum'].markAsUntouched();
    }
    return false;
  }

  isNoDeclaration() {
    // if (this.appInfoFormLocalModel.controls.declarationConformity.value) {
    //   return (this.appInfoFormLocalModel.controls.declarationConformity.value === GlobalsService.NO);
    // }
    // return false;
  }

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
    // if (this.appInfoFormLocalModel.controls.isAnimalHumanSourced.value &&
    //       this.appInfoFormLocalModel.controls.isAnimalHumanSourced.value === GlobalsService.YES) {
    //     // this.bioMaterials. = ;
    //     return true;
    // } else {
    //     this.appInfoFormLocalModel.controls.isListedIddTable.setValue(null);
    //     this.appInfoFormLocalModel.controls.isListedIddTable.markAsUntouched();
    //     // this.materialModel = [];
    // }
    // return false;
  }

  private _updateLists() {
    // if (this.actLeadList && this.actLeadList.length > 0) {
    //   if (this.appInfoFormLocalModel.controls.activityLead.value === this.actLeadList[0].id) {
    //     this.actTypeList = ApplicationInfoDetailsService.getActivityTypeMDBList(this.lang);
    //   } else if (this.appInfoFormLocalModel.controls.activityLead.value === this.actLeadList[1].id) {
    //     this.actTypeList = ApplicationInfoDetailsService.getActivityTypePVList(this.lang);
    //   }
    // }
  }

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
    // if ((this.appInfoFormLocalModel.controls.activityType.value === 'B02-20160301-039'
    //     || this.appInfoFormLocalModel.controls.activityType.value === 'B02-20160301-040')
    //   && (this.appInfoFormLocalModel.controls.deviceClass.value === this.devClassList[1].id
    //     || this.appInfoFormLocalModel.controls.deviceClass.value === this.devClassList[2].id)) {
    //   return true;
    // }
    // return false;
  }

  isMandatory() {
    // if (this.appInfoFormLocalModel.controls.activityType.value === 'B02-20160301-039'
    //   && (this.appInfoFormLocalModel.controls.deviceClass.value === this.devClassList[1].id
    //     || this.appInfoFormLocalModel.controls.deviceClass.value === this.devClassList[2].id)) {
    //   return true;
    // }
    // return false;
  }

  isOptional() {
    // if (this.appInfoFormLocalModel.controls.activityType.value === 'B02-20160301-040'
    //   && (this.appInfoFormLocalModel.controls.deviceClass.value === this.devClassList[1].id
    //     || this.appInfoFormLocalModel.controls.deviceClass.value === this.devClassList[2].id)) {
    //   return true;
    // }
    // return false;
  }

  isDeviceIV() {
    if (this.appInfoFormLocalModel.controls['deviceClass'].value === DeviceClass.ClassIV) {
      return true;
    }
    return false;
  }

}

