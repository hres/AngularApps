import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import { ControlMessagesComponent, YES, NO, UtilsService, ICode } from '@hpfb/sdk/ui';
import {DeviceDetailsService} from './device.details.service';
import {isArray} from 'util';
import { GlobalService } from '../../global/global.service';


@Component({
  selector: 'device-details',
  templateUrl: 'device.details.component.html',
  encapsulation: ViewEncapsulation.None
})

/**
 * Device Details Component is used for Company form
 */
export class DeviceDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  // public deviceFormLocalModel: FormGroup;
  @Input('group') public deviceRecord: FormGroup; // device detail form will use the reactive model passed in from the device record component - TODO
  // @Input() detailsChanged: number;
  @Input() recordId: string;
  @Input() showErrors: boolean;
  //@Input() lang;
  @Output() errorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  lang = this._globalService.lang();

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public showFieldErrors: boolean = false;
  private detailsService: DeviceDetailsService;

  public yesNoList: ICode[] = [];

  constructor(private _fb: FormBuilder, 
    private cdr: ChangeDetectorRef, 
    private _utilsService : UtilsService, 
    private _detailsService: DeviceDetailsService,
    private _globalService: GlobalService) {

    this.showFieldErrors = false;
    this.showErrors = false;
    this.detailsService = new DeviceDetailsService();
    this.yesNoList = this._globalService.$yesNoList;
    // this.yesNoList = this.detailsService.getYesNoList();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
     this.msgList.changes.subscribe(errorObjs => {
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
    this.errorList.emit(temp);

  }

  ngOnChanges(changes: SimpleChanges) {

    // since we can't detect changes on objects, using a separate flag
    // if (changes['detailsChanged']) { // used as a change indicator for the model
    //   // console.log("the details cbange");
    //   if (this.deviceRecord) {
    //     this.setToLocalModel();

    //   } else {
    //     this.deviceFormLocalModel = DeviceDetailsService.getReactiveModel(this._fb);
    //     this.deviceFormLocalModel.markAsPristine();
    //   }

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
      this.errorList.emit(temp);
    }

  }

  private _resetControlValues(listOfValues : string[]) {
    for (let i = 0; i < listOfValues.length; i++) {
      this._utilsService.resetControlsValues(this.deviceRecord.controls[listOfValues[i]]);
    }
  }

  isDeviceAuthorized() {
    if (this.deviceRecord.controls['deviceAuthorized'].value &&
        this.deviceRecord.controls['deviceAuthorized'].value === YES) {
          const valuesToReset = ['deviceApplicationSubmitted', 'deviceApplicationNumber', 'deviceExplain'];
          this._resetControlValues(valuesToReset)
      return true;
    }
    return false;
  }

  isDeviceNotAuthorized() {
    if (this.deviceRecord.controls['deviceAuthorized'].value &&
      this.deviceRecord.controls['deviceAuthorized'].value === NO) {
      this._resetControlValues(['licenceNum']);
      return true;
    }
    return false;
  }

  isDeviceApplicationSubmitted() {
    if (this.deviceRecord.controls['deviceApplicationSubmitted'].value &&
      this.deviceRecord.controls['deviceApplicationSubmitted'].value === YES) {
        this._resetControlValues(['deviceExplain'])
      return true;
    }
    return false;
  }

  isDeviceApplicationNotSubmitted() {
    if (this.deviceRecord.controls['deviceApplicationSubmitted'].value &&
      this.deviceRecord.controls['deviceApplicationSubmitted'].value === NO) {
        this._resetControlValues(['deviceApplicationNumber']);
      return true;
    }
    return false;
  }
}

