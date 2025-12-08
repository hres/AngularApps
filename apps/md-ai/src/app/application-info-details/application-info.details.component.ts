import {
  Component,
  Input,
  Output,
  OnInit,
  SimpleChanges,
  OnChanges,
  EventEmitter,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import {
  CheckboxOption,
  ControlMessagesComponent,
  YES,
  NO,
  ConverterService,
  ICode,
  UtilsService,
  ICodeAria,
} from '@hpfb/sdk/ui';
import { ApplicationInfoDetailsService } from './application-info.details.service';
import { GlobalService } from '../global/global.service';
import { DeviceClass, ActivityType, Compliance } from '../app.constants';
import { pairwise, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-info-details',
  templateUrl: 'application-info.details.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ApplicationInfoDetailsComponent
  implements OnInit, OnChanges, AfterViewInit
{
  public appInfoFormLocalModel: FormGroup;
  @Input() showErrors: boolean;
  @Input() appInfoModel;

  @Input() helpTextSequences;
  @Input() loadFileIndicator;
  @Output() detailErrorList = new EventEmitter(true); // For processing app info details errors
  @Output() resetMaterialErrorList = new EventEmitter(true); // To reset material errors
  @Output() resetDeclarationError = new EventEmitter(true); // Reset declaration error
  @Output() resetPriorityRevError = new EventEmitter(true);
  @Output() resetYesNoList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent)
  msgList: QueryList<ControlMessagesComponent>;

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

  constructor(
    private _fb: FormBuilder,
    private _detailsService: ApplicationInfoDetailsService,
    private _globalService: GlobalService,
    private _converterService: ConverterService,
    private _utilsService: UtilsService
  ) {
    this.showFieldErrors = false;
    this.showErrors = false;
    if (!this.appInfoFormLocalModel) {
      this.appInfoFormLocalModel = this._detailsService.getReactiveModel(
        this._fb
      );
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
    this.appInfoFormLocalModel
      .get('deviceClass')
      .valueChanges.pipe(
        startWith(this.appInfoFormLocalModel.value), // Emit the initial value first
        pairwise() // Pair the current value with the previous value
      )
      .subscribe(([previousValue, currentValue]) => {
        if (
          (previousValue == DeviceClass.ClassIII ||
            previousValue == DeviceClass.ClassIV) &&
          (currentValue === DeviceClass.ClassIII ||
            currentValue === DeviceClass.ClassIV)
        ) {
          this.resetYesNoList.emit(false);
        } else {
          this.resetYesNoList.emit(true);
        }
      });
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe((errorObjs) => {
      let temp = [];
      this._updateErrorList(errorObjs);
    });
    this.msgList.notifyOnChanges();
  }

  private _updateErrorList(errorObjs) {
    let temp = [];
    if (errorObjs) {
      errorObjs.forEach((error) => {
        temp.push(error);
      });
    }
    this.detailErrorList.emit(temp);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
      let temp = [];
      if (this.msgList) {
        this.msgList.forEach((item) => {
          temp.push(item);
          // console.log(item);
        });
      }
      this.detailErrorList.emit(temp);
    }

    if (changes['appInfoModel']) {
      const dataModel = changes['appInfoModel'].currentValue;
      if (!this.appInfoFormLocalModel) {
        this.appInfoFormLocalModel = this._detailsService.getReactiveModel(
          this._fb
        );
        this.appInfoFormLocalModel.markAsPristine();
      }
      this._detailsService.mapDataModelToFormModel(
        dataModel,
        this.appInfoFormLocalModel,
        this.complianceCodeList,
        this.complianceOptionList,
        this.lang
      );
      this.deviceClassOnblur();
      this.activityTypeOnChange();
    }
  }

  deviceClassOnblur() {
    if (
      !this.appInfoFormLocalModel.controls['deviceClass'].value ||
      !this.isDeviceIV()
    ) {
      this._detailsService.deviceClassIV.set(false);
      this.resetMaterialErrorList.emit(true);
    }

    if (
      this.appInfoFormLocalModel.controls['deviceClass'].value &&
      this.isDeviceIV()
    ) {
      this._detailsService.deviceClassIV.set(true);
    }

    if (
      !this.appInfoFormLocalModel.controls['deviceClass'].value ||
      !this.isDeviceIII()
    ) {
      this._detailsService.deviceClassIII.set(false);
    }

    if (
      this.appInfoFormLocalModel.controls['deviceClass'].value &&
      this.isDeviceIII()
    ) {
      this._detailsService.deviceClassIII.set(true);
    }

    if (
      !this.appInfoFormLocalModel.controls['deviceClass'].value ||
      !this.isDeviceII()
    ) {
      this._detailsService.deviceClassII.set(false);
    }
    if (
      this.appInfoFormLocalModel.controls['deviceClass'].value &&
      this.isDeviceII()
    ) {
      this._detailsService.deviceClassII.set(true);
    }

    if (
      !this.appInfoFormLocalModel.controls['deviceClass'].value ||
      (!this.isDeviceIII() && !this.isDeviceIV())
    ) {
      this.resetDeclarationError.emit(true);
      this.resetPriorityRevError.emit(true);
    }
  }

  private _resetControlValues(listOfValues: any[]) {
    for (let i = 0; i < listOfValues.length; i++) {
      this._utilsService.resetControlsValues(
        this.appInfoFormLocalModel.controls[listOfValues[i]]
      );
    }
  }

  isIVDD() {
    if (
      this.appInfoFormLocalModel.controls['isIvdd'].value &&
      this.appInfoFormLocalModel.controls['isIvdd'].value === YES
    ) {
      return true;
    } else {
      const valuesToReset = ['isHomeUse', 'isCarePoint'];
      this._resetControlValues(valuesToReset);
    }
    return false;
  }

  isNOIVDD() {
    if (
      this.appInfoFormLocalModel.controls['isIvdd'].value &&
      this.appInfoFormLocalModel.controls['isIvdd'].value === NO
    ) {
      return true;
    } else {
      const valuesToReset = [
        'hasDrug',
        'hasDinNpn',
        'din',
        'npn',
        'drugName',
        'activeIngredients',
        'manufacturer',
        'otherPharmacopeia',
        'compliance',
      ];
      this._resetControlValues(valuesToReset);
    }
    return false;
  }

  hasDrug() {
    if (
      this.appInfoFormLocalModel.controls['hasDrug'].value &&
      this.appInfoFormLocalModel.controls['hasDrug'].value === YES
    ) {
      return true;
    } else {
      const valuesToReset = [
        'hasDinNpn',
        'compliance',
        'din',
        'npn',
        'drugName',
        'activeIngredients',
        'manufacturer',
        'selectedComplianceCodes',
        this.complianceChkFormArray,
        'otherPharmacopeia',
      ];
      this._resetControlValues(valuesToReset);
    }
    return false;
  }

  hasDin() {
    if (
      this.appInfoFormLocalModel.controls['hasDinNpn'].value &&
      this.appInfoFormLocalModel.controls['hasDinNpn'].value === 'din'
    ) {
      return true;
    } else {
      this._resetControlValues(['din']);
    }
    return false;
  }

  hasNpn() {
    if (
      this.appInfoFormLocalModel.controls['hasDinNpn'].value &&
      this.appInfoFormLocalModel.controls['hasDinNpn'].value === 'npn'
    ) {
      return true;
    } else {
      this._resetControlValues(['npn']);
    }
    return false;
  }

  dinNpnOnChange() {
    if (
      this.appInfoFormLocalModel.controls['hasDinNpn'].value &&
      this.appInfoFormLocalModel.controls['hasDinNpn'].value === 'nodinnpn'
    ) {
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
    if (
      (this.appInfoFormLocalModel.controls['activityType'].value ===
        ActivityType.Licence ||
        this.appInfoFormLocalModel.controls['activityType'].value ===
          ActivityType.LicenceAmendment) &&
      (this.appInfoFormLocalModel.controls['deviceClass'].value ===
        DeviceClass.ClassIII ||
        this.appInfoFormLocalModel.controls['deviceClass'].value ===
          DeviceClass.ClassIV)
    ) {
      return true;
    } else {
      this._resetControlValues(['declarationConformity']);
    }
    return false;
  }

  isMandatory() {
    if (
      this.appInfoFormLocalModel.controls['activityType'].value ===
        ActivityType.Licence &&
      (this.appInfoFormLocalModel.controls['deviceClass'].value ===
        DeviceClass.ClassIII ||
        this.appInfoFormLocalModel.controls['deviceClass'].value ===
          DeviceClass.ClassIV)
    ) {
      return true;
    }
    return false;
  }

  isNoDeclaration() {
    if (this.appInfoFormLocalModel.controls['declarationConformity'].value) {
      return (
        this.appInfoFormLocalModel.controls['declarationConformity'].value ===
        NO
      );
    }
    return false;
  }

  isOptional() {
    if (
      this.appInfoFormLocalModel.controls['activityType'].value ===
        ActivityType.LicenceAmendment &&
      (this.appInfoFormLocalModel.controls['deviceClass'].value ===
        DeviceClass.ClassIII ||
        this.appInfoFormLocalModel.controls['deviceClass'].value ===
          DeviceClass.ClassIV)
    ) {
      return true;
    }
    return false;
  }

  isDeviceIV() {
    if (
      this.appInfoFormLocalModel.controls['deviceClass'].value ===
      DeviceClass.ClassIV
    ) {
      return true;
    }
    return false;
  }

  isDeviceIII() {
    if (
      this.appInfoFormLocalModel.controls['deviceClass'].value ===
      DeviceClass.ClassIII
    ) {
      return true;
    }
    return false;
  }

  isDeviceII() {
    if (
      this.appInfoFormLocalModel.controls['deviceClass'].value ===
      DeviceClass.ClassII
    ) {
      return true;
    }
    return false;
  }

  hasDrugOnChange() {
    this._updateComplianceArray();
  }

  activityTypeOnChange() {
    if (
      this.appInfoFormLocalModel.controls['activityType'].value &&
      this.isActivityTypeLicence()
    ) {
      this._detailsService.raTypeLicence.set(true);
    }

    if (
      !this.appInfoFormLocalModel.controls['activityType'].value ||
      !this.isActivityTypeLicence()
    ) {
      this._detailsService.raTypeLicence.set(false);
      this.resetDeclarationError.emit(true);
    }

    if (
      this.appInfoFormLocalModel.controls['activityType'].value &&
      this.isActivityTypeLicenceAmend()
    ) {
      this._detailsService.raTypeLicenceAmend.set(true);
    }

    if (
      !this.appInfoFormLocalModel.controls['activityType'].value ||
      !this.isActivityTypeLicenceAmend()
    ) {
      this._detailsService.raTypeLicenceAmend.set(false);
    }

    if (
      !this.appInfoFormLocalModel.controls['activityType'].value ||
      (!this.isActivityTypeLicenceAmend() && !this.isActivityTypeLicence())
    ) {
      this.resetPriorityRevError.emit(true);
    }
  }

  isActivityTypeLicence() {
    if (
      this.appInfoFormLocalModel.controls['activityType'].value ===
      ActivityType.Licence
    ) {
      return true;
    }
    return false;
  }

  isActivityTypeLicenceAmend() {
    if (
      this.appInfoFormLocalModel.controls['activityType'].value ===
      ActivityType.LicenceAmendment
    ) {
      return true;
    }
    return false;
  }

  complianceOnChange() {
    this.appInfoFormLocalModel.controls['selectedComplianceCodes'].setValue(
      this.selectedComplianceCodes
    );
  }

  private _updateComplianceArray() {
    const complianceChkList = this._globalService.$complianceList;
    this.complianceOptionList = complianceChkList.map((item) => {
      return this._converterService.convertCodeToCheckboxOption(
        item,
        this.lang
      );
    });

    this.complianceOptionList.forEach(() =>
      this.complianceChkFormArray.push(new FormControl(false))
    );
  }

  get complianceChkFormArray() {
    return this.appInfoFormLocalModel.controls['compliance'] as FormArray;
  }

  get selectedComplianceCodes(): string[] {
    return this._detailsService.getSelectedComplianceCodes(
      this.complianceOptionList,
      this.complianceChkFormArray
    );
  }
}
