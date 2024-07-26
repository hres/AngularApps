import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren, ViewEncapsulation, effect, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlMessagesComponent, ErrorModule, ErrorSummaryComponent, ExpanderModule, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../global/global.service';
import { first } from 'rxjs';
import { ErrorNotificationService } from '@hpfb/sdk/ui/error-msg/error.notification.service';


@Component({
  selector: 'app-recog-standards',
  templateUrl: './recog-standards.component.html',
  styleUrl: './recog-standards.component.css'
})
export class RecogStandardsComponent implements OnInit, OnChanges, AfterViewInit {
  public complianceForm: FormGroup;
  @Input() showErrors: boolean;

  @Input() helpTextSequences;
  @Input() loadFileIndicator;
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  

  // Lists for dropdowns


  public complianceOptionList: CheckboxOption[] = [];

  // Lists for checkboxes
  public complianceCodeList: ICode[] = [];

  public showFieldErrors = false;

  lang = this._globalService.lang();

  constructor(private fb: FormBuilder, 
    private _utilsService: UtilsService, 
    private _globalService: GlobalService, 
    private _deviceService : DeviceService,
    private _errorDeviceNotificationService : ErrorNotificationService) {

this.complianceForm = this.fb.group({
devices: this.fb.array([])
});

effect(() => {
// console.log('[effect2]', this._deviceService.errors());
});
}

  async ngOnInit() {
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
      this._detailsService.mapDataModelToFormModel(dataModel, this.appInfoFormLocalModel, this.complianceCodeList, this.complianceOptionList, this.lang);
    }
  }

  


  private _resetControlValues(listOfValues : any[]) {
    for (let i = 0; i < listOfValues.length; i++) {
      this._utilsService.resetControlsValues(this.appInfoFormLocalModel.controls[listOfValues[i]]);
    }
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


  isNoDeclaration() {
    if (this.appInfoFormLocalModel.controls['declarationConformity'].value) {
      return (this.appInfoFormLocalModel.controls['declarationConformity'].value === NO);
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
