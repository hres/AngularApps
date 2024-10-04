import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, Output, OnInit, QueryList, ViewChildren, effect, ViewEncapsulation, SimpleChange, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlMessagesComponent, ErrorModule, ErrorSummaryComponent, ICode, NO, PipesModule, UtilsService, YES } from '@hpfb/sdk/ui';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from '../../global/global.service';
import { TISSUE_OTHER_ID, DERIVATIVE_OTHER_ID, DEVICE_ERROR_PREFIX } from '../../app.constants';
import { ErrorNotificationService } from '@hpfb/sdk/ui/error-msg/error.notification.service';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-device-item',
  templateUrl: './device-item.component.html',
  encapsulation: ViewEncapsulation.None
})

export class DeviceItemComponent implements OnInit, AfterViewInit {
  @Input() cRRow: FormGroup;
  @Input() j: number;

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
  private errorSummaryChild: ErrorSummaryComponent = null;


  public headingLevel = 'h4';
  headingPreamble: string = "heading.interdependent.device";
  headingPreambleParams: any;
  translatedParentLabel: string;

  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;

  constructor(private _globalService: GlobalService, 
              private _utilsService: UtilsService, 
              private _translateService: TranslateService,
              private _errorNotificationService : ErrorNotificationService,
              private _deviceService : DeviceService){
    //this.isInternal = this._globalService.$isInternal;

    effect(() => {
      // this._deviceService.showDeviceErrorSummary() 
      if (this._deviceService.showDeviceErrorSummaryOneRec()) {
      this.showErrors = this._globalService.showErrors()
      this.showErrSummary = this.showErrors;

        if (this._globalService.showErrors()) {
          this._updateErrorList(this.msgList);
        }
      }
    
    });
  }

  ngOnChanges(changes : SimpleChanges) {
    this.onDeviceAuthorizedChange(null);
    this.onDeviceAppChange(null); 
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
    /** this is processsing the errorSummary that is a child in  Contact record **/
    this.errorSummaryChildList.changes.subscribe(list => {
      //console.log("error summary child change,", list);
      this.processSummaries(list);
    });
  }

  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Device List found >1 Error Summary ' + list.length);
    }
    this.errorSummaryChild = list.first;
    // notify subscriber(s) that contact records' error summaries are changed
    this._errorNotificationService.updateErrorSummary(DEVICE_ERROR_PREFIX + this.cRRow.get('id').value, this.errorSummaryChild);
 
    // this._emitErrors();
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
    this.onDeviceAuthorizedChange(null);
    this.onDeviceAppChange(null); 

    this.cRRow.markAsPristine();
  }

  public deleteDeviceRecord(index: number): void {
    this.errorSummaryChild = null;
    this.deleteRecord.emit(index);
    this.cRRow.markAsPristine();
    this._updateErrorList([]);
  }


  public saveDeviceRecord(index: number): void {
    this._save(index);
  }

  private _save(index: number): void {
    if (!(this.errorList.length > 0)) { // If there are no errors -> Set null inputs that are invalid to valid
      this._deviceService.setDeviceDetailsErrorsToNull(this.cRRow.get('deviceInfo'));
    }
    // console.log("saving record - device item", this.cRRow);
    if (this.cRRow.valid) {
      // console.log("cRRow valid, emitting event..");
      this.saveRecord.emit({ index: index });
      this.cRRow.markAsPristine();
    } else {
      this.showErrSummary = true;
      this.showErrors = true;
      document.location.href = '#deviceErrorSummary'
    }
  } 

  onDeviceAuthorizedChange(e: any) {
    let deviceAuthorized;

    if (e) {
      deviceAuthorized = e.target.value;
    } else {
      deviceAuthorized = this.cRRow.get('deviceInfo.deviceAuthorized').value;
    }

    const deviceApplicationSubmitted = this.cRRow.get('deviceInfo.deviceApplicationSubmitted');
    const deviceApplicationNumber = this.cRRow.get('deviceInfo.deviceApplicationNumber');
    const deviceExplain = this.cRRow.get('deviceInfo.deviceExplain');
    const licenceNum = this.cRRow.get('deviceInfo.licenceNum');

    if (deviceAuthorized) {
      if (deviceAuthorized === YES) {
        this.deviceAppSubmitted = false;
        this.deviceAppNotSubmitted = false; 
        this.deviceAuthorized = true;
        this.deviceNotAuthorized = false;
        this._utilsService.resetControlsValues(deviceApplicationSubmitted, deviceApplicationNumber, deviceApplicationSubmitted, deviceExplain)
      } else {
        this.deviceAuthorized = false;
        this.deviceNotAuthorized = true;
        this._utilsService.resetControlsValues(licenceNum);
      }
    }
  }

  onDeviceAppChange(e: any) {
    let deviceApplicationSubmitted;

    if (e) {
      deviceApplicationSubmitted = e.target.value;
    } else {
      deviceApplicationSubmitted = this.cRRow.get('deviceInfo.deviceApplicationSubmitted').value;
    }

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
    return ((this.showErrSummary) && this.errorList.length > 0);
  }
  
  // todo use include, not !Remove
  // public isActiveContact(): boolean {
  //   return (!this.isContactStatus(ContactStatus.Remove));
  // }

 
}