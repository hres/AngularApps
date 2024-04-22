import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild,
  ViewChildren, ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DeviceDetailsComponent} from '../device.details/device.details.component';
import {DeviceRecordService} from './device-record.service';
import { ErrorSummaryComponent, ControlMessagesComponent, UtilsService } from '@hpfb/sdk/ui';
import { DeviceDetailsService } from '../device.details/device.details.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorNotificationService } from '@hpfb/sdk/ui/error-msg/error.notification.service';


@Component({
  selector: 'device-record',
  templateUrl: './device-record.component.html',
  styleUrls: ['./device-record.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None

})
export class DeviceRecordComponent implements OnInit, AfterViewInit {

  @Input() cRRow: FormGroup;

  public deviceRecordModel: FormGroup;
  @Input('group') public deviceFormRecord: FormGroup;
  // @Input() detailsChanged: number;
  // @Input() newRecord: boolean;
  @Input() showErrors: boolean;
  @Input() lang;
  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() errors = new EventEmitter();


  @ViewChild(DeviceDetailsComponent, {static: true}) deviceDetailsChild;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public updateChild: number = 0;
  public sequenceNum: number = 0;
  public errorList = [];
  private childErrorList: Array<any> = [];
  private parentErrorList: Array<any> = [];
  // public isNew: boolean;
  public showErrSummary: boolean;
  public errorSummaryChild: ErrorSummaryComponent = null;
  
  public headingLevel = 'h4';
  headingPreamble: string = "heading.interdependent.device";
  headingPreambleParams: any;
  translatedParentLabel: string;

  constructor(private _fb: FormBuilder,  private cdr: ChangeDetectorRef,
    private _detailsService: DeviceDetailsService,
    private _translateService: TranslateService,
    private _errorNotificationService: ErrorNotificationService,
    private _utilsService: UtilsService ) {
    this.showErrors = false;
    this.showErrSummary = false;
    // this.deviceRecordModel = this.cRRow;
    // console.log("device record component - constructor", this.deviceRecordModel);
  }

  ngOnInit() {
    // if (!this.deviceRecordModel) {
    //   // this.deviceRecordModel = this._initDevice();
    // }
    // this.detailsChanged = 0;
    
    this.headingPreambleParams = this.cRRow.get('seqNumber').value;
    this.translatedParentLabel = this._translateService.instant(this.headingPreamble, {seqnumber: this.headingPreambleParams});
    // this.deviceRecordModel = this.cRRow;

    // console.log("device record component - ngOnInit", this.deviceRecordModel);

  }
  
  ngAfterViewInit() {

    this.msgList.changes.subscribe(errorObjs => {
      // update is handled directly in the function
      this.updateErrorList(null, true);
      this._emitErrors();
    });
    /** this is processsing the errorSummary that is a child in  Device record **/
    this.errorSummaryChildList.changes.subscribe(list => {
      this.processSummaries(list);
    });

  }
  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Device List found >1 Error Summary ' + list.length);
    }
    this.errorSummaryChild = list.first;
    //this._emitErrors();
    this._errorNotificationService.updateErrorSummary(this.deviceRecordModel.controls['id'].value, this.errorSummaryChild)
  }
  /***
   * Emits errors to higher level error summaries. Used for linking summaries
   * @private
   */
  private _emitErrors(): void {
    let emitErrors = [];
    if (this.errorSummaryChild) {
      emitErrors.push(this.errorSummaryChild);
    }
    this.errors.emit(emitErrors);
  }

  ngOnChanges (changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);

    if (isFirstChange) {
      this.deviceRecordModel = this.cRRow;
    }
   
    // if (changes['detailsChanged']) { // used as a change indicator for the model
    //   if (this.deviceFormRecord) {
    //     this.setToLocalModel();
    //   } else {
    //     // this.deviceRecordModel = this._initDevice();
    //     if (this.deviceRecordModel) {
    //       this.deviceRecordModel.markAsPristine();
    //     }
    //   }
    //   this.updateChild++;
    // }

    // if (changes['newRecord']) {
    //   this.isNew = changes['newRecord'].currentValue;
    // }

    if (changes['showErrors']) {
      this.showErrSummary = changes['showErrors'].currentValue;
      this._emitErrors();
    }
    this.cdr.detectChanges(); // doing our own change detection

    // if (changes['showErrors']) {
    //   this.showErrSummary = changes['showErrors'].currentValue;
    // }
    // if (this.showErrSummary) {
    //   this.updateErrorList(null, true);
    //   this._emitErrors();
    // }
  }

  /**
   * Updates the master error list. Combines the record level field errors with the child record field error
   * @param errs
   * @param {boolean} isParent
   */
  updateErrorList(errs, isParent: boolean = false) {
    // console.log("Starting update error list")
    if (!isParent) {
      this.childErrorList = errs;
    }
    this.parentErrorList = [];
    // do this so don't miss it on a race condition
    if (this.msgList) {
      this.msgList.forEach(
        error => {
          this.parentErrorList.push(error);
        }
      );
      // this.cdr.detectChanges(); // doing our own change detection
    }

    this.errorList = new Array();
    this.errorList = this.parentErrorList.concat(this.childErrorList);
    console.log("update error list", this.errorList);
    this.cdr.detectChanges();
  }

  /**
   * Changes the local model back to the last saved version of the device
   */
  public revertDeviceRecord(): void {
    console.log("revert device record - record component");
    this.revertRecord.emit(this.deviceRecordModel);
    this.deviceRecordModel.markAsPristine();
    //document.location.href = '#deviceName';
  }

  /***
   * Deletes the device reocord with the selected id from both the model and the form
   */
  public deleteDeviceRecord(): void {
    this.errorSummaryChild = null;
    this.deleteRecord.emit(this.deviceRecordModel.value.id);
    this._emitErrors();
    this.deviceRecordModel.markAsPristine();
    //document.location.href = '#addDevice';
  }

  public saveDeviceRecord(): void {
    // this.updateErrorList(null, true);
    if (!(this.errorList.length > 0)) { // If there are no errors -> Set null inputs that are invalid to valid
      this._setDeviceDetailsErrorsToNull(this.deviceDetailsForm);
    }
    if (this.deviceRecordModel.valid) {
      this.saveRecord.emit((this.deviceRecordModel));
      // this.showErrSummary = false;
      // this.showErrors = false;
      this.deviceRecordModel.markAsPristine();
      //document.location.href = '#addDevice';
    } else {
      // id is used for an error to ensure the record gets saved
      let temp = this.deviceRecordModel.value.id;
      this.deviceRecordModel.controls['id'].setValue(1);
      if (this.deviceRecordModel.valid) {
        this.deviceRecordModel.controls['id'].setValue(temp);
        this.saveRecord.emit((this.deviceRecordModel));
      } else {
        this.deviceRecordModel.controls['id'].setValue(temp);
        this.showErrSummary = true;
        this.showErrors = true;

        //document.location.href = '#deviceErrorSummary';
      }
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
  private _setDeviceDetailsErrorsToNull(formGroup : FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      formGroup.get(key).setErrors(null);
    });
  }

  /**
   * Changes the local model back to the last saved version of the device
   */
  public showErrorSummary(): boolean {
    return (this.showErrSummary && this.errorList.length > 0);
  }

  get deviceDetailsForm() {
    return this.deviceRecordModel.get('deviceDetails') as FormGroup;
  }
}
