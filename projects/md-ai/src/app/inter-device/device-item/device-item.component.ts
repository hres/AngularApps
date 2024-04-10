import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, Output, OnInit, QueryList, ViewChildren, effect, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlMessagesComponent, ErrorModule, ICode, NO, PipesModule, UtilsService, YES } from '@hpfb/sdk/ui';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from '../../global/global.service';
import { TISSUE_OTHER_ID, DERIVATIVE_OTHER_ID } from '../../app.constants';

@Component({
  selector: 'app-device-item',
  templateUrl: './device-item.component.html',
  encapsulation: ViewEncapsulation.None
})

export class DeviceItemComponent implements OnInit, AfterViewInit {
  @Input() cRRow: FormGroup;
  @Input() j: number;
  //@Input() lang: string;

  lang = this._globalService.lang();

  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() error = new EventEmitter(true);

  public yesNoList: ICode[] = [];

  deviceAuthorized: boolean = false;
  deviceNotAuthorized: boolean = false;
  deviceAppSubmitted: boolean = false;
  deviceAppNotSubmitted: boolean = false;

  //isInternal: boolean
  showErrors: boolean;
  showErrSummary: boolean = false;
  public errorList = [];

  public headingLevel = 'h4';
  headingPreamble: string = "heading.interdependent.device";
  headingPreambleParams: any;
  translatedParentLabel: string;

  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  constructor(private _globalService: GlobalService, private _utilsService: UtilsService, private _translateService: TranslateService){
    //this.isInternal = this._globalService.$isInternal;

    effect(() => {
      this.showErrors = this._globalService.showErrors()
      if (this._globalService.showErrors()) {
        this._updateErrorList(this.msgList);
      }
    });
  }

  async ngOnInit() {
    this.yesNoList = this._globalService.$yesNoList;

    this.headingPreambleParams = this.j+1;
    this.translatedParentLabel = this._translateService.instant(this.headingPreamble, {seqnumber: this.headingPreambleParams});
  }

  ngAfterViewInit(): void {
    this._updateErrorList(this.msgList);

    this.msgList.changes.subscribe(errorObjs => {
      this._updateErrorList(this.msgList);
    });
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
    this.errorList = temp;
    this.error.emit(temp);
  }

  public revertDeviceRecord(index: number, recordId: number): void {
    this.revertRecord.emit({ index: index, id: recordId });
    this.cRRow.markAsPristine();
  }

  public deleteDeviceRecord(index: number): void {
    this.deleteRecord.emit(index);
    this.cRRow.markAsPristine();
    this._updateErrorList([]);
  }


  public saveDeviceRecord(index: number): void {
    this._save(index);
  }

  private _save(index: number): void {
    if (!(this.errorList.length > 0)) { // If there are no errors -> Set null inputs that are invalid to valid
      this._setDeviceDetailsErrorsToNull(this.cRRow.get('deviceInfo'));
    }
    // console.log("saving record - device item", this.cRRow);
    if (this.cRRow.valid) {
      // console.log("cRRow valid, emitting event..");
      this.saveRecord.emit({ index: index });
      this.cRRow.markAsPristine();
    } else {
      this.showErrSummary = true;
      this.showErrors = true;
    }
  } 

  /**
   * Using this method to set the errors of control values that were not touched to false.
   * This is because there are certain controls/inputs that only appear to user when they
   * select a specific value.
   * 
   * For ex: When selecting yes to if a device that has been authorized in Canada
   * -> YES: Licence Number appears, not app number & previously submitted & explanation inputs
   * -> App number, previously submitted and explanations become INVALID because they are required
   * when a user selects NO (for authorized in Canada)
   * @param formGroup 
   */
  private _setDeviceDetailsErrorsToNull(formGroup) {
    // console.log("setting device details errors to null...", formGroup);
    Object.keys(formGroup.controls).forEach((key) => {
      formGroup.get(key).setErrors(null);
    });
  }

  
  isDeviceAuthorized() {
    const deviceAuthorized = this.cRRow.get('deviceInfo.deviceAuthorized').value;
    const deviceApplicationSubmitted = this.cRRow.get('deviceInfo.deviceApplicationSubmitted');
    const deviceApplicationNumber = this.cRRow.get('deviceInfo.deviceApplicationNumber');
    const deviceExplain = this.cRRow.get('deviceInfo.deviceExplain');
    const licenceNum = this.cRRow.get('deviceInfo.licenceNum');

    if (deviceAuthorized) {
      if (deviceAuthorized === YES) {
        this._utilsService.resetControlsValues(deviceApplicationNumber, deviceApplicationSubmitted, deviceExplain)
        return true;
      } else {
        this._utilsService.resetControlsValues(licenceNum);
      }
    }
    return false;
  }

  isDeviceNotAuthorized() {
    const deviceAuthorized = this.cRRow.get('deviceInfo.deviceAuthorized').value;
    const licenceNum = this.cRRow.get('deviceInfo.licenceNum');
    if (deviceAuthorized && deviceAuthorized === NO) {
      this._utilsService.resetControlsValues(licenceNum);
      return true;
    }
    return false;
  }

  isDeviceApplicationSubmitted() {
    const deviceApplicationSubmitted = this.cRRow.get('deviceInfo.deviceApplicationSubmitted').value;
    const deviceExplain = this.cRRow.get('deviceInfo.deviceExplain');
    const deviceApplicationNumber = this.cRRow.get('deviceInfo.deviceApplicationNumber')

    if (deviceApplicationSubmitted) {
      if (deviceApplicationSubmitted === YES) {
        this._utilsService.resetControlsValues(deviceExplain);
        return true;
      } else {
        this._utilsService.resetControlsValues(deviceApplicationNumber);
      }
    }
    return false;
  }

  isDeviceApplicationNotSubmitted() {
    const deviceApplicationSubmitted = this.cRRow.get('deviceInfo.deviceApplicationSubmitted').value;
    const deviceApplicationNumber = this.cRRow.get('deviceInfo.deviceApplicationNumber');

    if (deviceApplicationSubmitted && deviceApplicationSubmitted === NO) {
      this._utilsService.resetControlsValues(deviceApplicationNumber);
      return true;
    }
    return false;
  }

  onDeviceAuthorizedChange(e: any) {
    const deviceAuthorized = e.target.value;
    const deviceApplicationSubmitted = this.cRRow.get('deviceInfo.deviceApplicationSubmitted');
    const deviceApplicationNumber = this.cRRow.get('deviceInfo.deviceApplicationNumber');
    const deviceExplain = this.cRRow.get('deviceInfo.deviceExplain');
    const licenceNum = this.cRRow.get('deviceInfo.licenceNum');

    if (deviceAuthorized) {
      if (deviceAuthorized === YES) {
        this.deviceAuthorized = true;
        this.deviceNotAuthorized = false;
        this._utilsService.resetControlsValues(deviceApplicationNumber, deviceApplicationSubmitted, deviceExplain)
      } else {
        this.deviceAuthorized = false;
        this.deviceNotAuthorized = true;
        this._utilsService.resetControlsValues(licenceNum);
      }
    }
  }

  onDeviceAppChange(e: any) {
    const deviceApplicationSubmitted = e.target.value;
    const deviceExplain = this.cRRow.get('deviceInfo.deviceExplain');
    const deviceApplicationNumber = this.cRRow.get('deviceInfo.deviceApplicationNumber')

    if (deviceApplicationSubmitted) {
      if (deviceApplicationSubmitted === YES) {
        this.deviceAppSubmitted = true;
        this.deviceAppNotSubmitted = false;
        this._utilsService.resetControlsValues(deviceExplain);
      } else {
        this.deviceAppSubmitted = false;
        this.deviceAppNotSubmitted = true;
        this._utilsService.resetControlsValues(deviceApplicationNumber);
      }
    }
  }

  public disabledDiscardButton() {
    if (this.cRRow.get('isNew').value) {
      return true;
    }
    return false;
  }

  public showErrorSummary(): boolean {
    return (this.showErrSummary && this.errorList.length > 0);
  }
  
  // todo use include, not !Remove
  // public isActiveContact(): boolean {
  //   return (!this.isContactStatus(ContactStatus.Remove));
  // }

 
}