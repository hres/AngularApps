import {
  Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges, ViewChildren, QueryList, EventEmitter, Output,
  AfterViewInit, ChangeDetectorRef, DoCheck, ViewEncapsulation
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

import {DeviceRecordComponent} from '../device-record/device-record.component';
import {DeviceRecordService} from '../device-record/device-record.service';
import {DeviceListService} from './device-list.service';
// import {ListOperations} from '../../list-operations';
import {TranslateService} from '@ngx-translate/core';
import { GlobalService } from '../../global/global.service';
// import {GlobalsService} from '../../globals/globals.service';
import { UtilsService, ErrorSummaryComponent, RecordListBaseComponent } from '@hpfb/sdk/ui';
import { Subscription } from 'rxjs';
import { ErrorNotificationService } from '@hpfb/sdk/ui/error-msg/error.notification.service';
import { ERR_TYPE_LEAST_ONE_REC, ErrorSummaryObject, getEmptyErrorSummaryObj } from '@hpfb/sdk/ui/error-msg/error-summary/error-summary-object';
import { Device } from '../../models/Enrollment';

@Component({
  selector: 'device-list',
  templateUrl: './device.list.component.html',
  styleUrls: ['./device.list.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class DeviceListComponent extends RecordListBaseComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() public deviceModel: Device[] = [];
  @Input() public saveDevice;
  @Input() public showErrors: boolean;
  @Input() public loadFileIndicator;
  @Input() lang;
  @Output() public errors = new EventEmitter();

  @ViewChild(DeviceRecordComponent, {static: true}) deviceChild: DeviceRecordComponent;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;

  private errorSummaryChild = null;
  // private prevRow = -1;
  // public updateDeviceDetails = 0;
  public deviceListForm: FormGroup;
  public newDeviceForm: FormGroup;
  public service: DeviceListService;
  public addRecordMsg = 0;
  public deleteRecordMsg = 0;
  public errorList = [];
  public dataModel = [];
  public validRec = true;

  private deviceModelChangesSubscription: Subscription;
  // public recModified = false;

  // public columnDefinitions = [
  //   {
  //     label: 'Name of Compatible Device',
  //     binding: 'device_name',
  //     width: '65'
  //   },
  //   {
  //     label: 'Licence Number',
  //     binding: 'licence_number',
  //     width: '35'
  //   }
  // ];

  constructor(private _fb: FormBuilder, private translate: TranslateService, private _utilsService: UtilsService, private _listService: DeviceListService,
              private _errorNotificationService : ErrorNotificationService,
              private _recordService : DeviceRecordService) {
    super();
    this.deviceListForm = this._listService.getReactiveModel(_fb);
    //console.log("device list form - list component", this.deviceListForm);
    // this.service = new DeviceListService();
    // this.dataModel = this.service.getModelRecordList();
    // this.translate.get('error.msg.required').subscribe(res => {
    //   // console.log(res);
    // });
    // this.deviceListForm = this._fb.group({
    //   devices: this._fb.array([])
    // });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.setExpander(this.expander);
    // this.processSummaries(this.errorSummaryChildList);
    // this.errorSummaryChildList.changes.subscribe(list => {
    //   this.processSummaries(list);
    // });

    //   this.cd.detectChanges();

    // subscribe and process the updated contact records' error summaries
    this._errorNotificationService.errorSummaryChanged$.subscribe((errors) => {
      this._processErrorSummaries(errors);
    });

    // when contactModel changes, check if "at least one company record" rule is met and then execute emitting
    this.deviceModelChangesSubscription = this._listService.deviceModelChanges$.subscribe(changes => {
      // console.log('--------------------', changes);
      this._emitErrors(false);
    });
  }

  /**
   * Updates the error list to include the error summaries. Messages upwards
   * @param {QueryList<ErrorSummaryComponent>} list
   */
  private _processErrorSummaries(errSummaryEntries: { key: string, errSummaryMessage: ErrorSummaryComponent }[]): void {
    // console.log('...._processErrorSummaries:', errSummaryEntries);
    // get the first entry where the errSummaryMessage property is not empty 
    // as we only need one summary entry of this list section if there is any to be bubbled up to the top level error summary section
    const filteredErrSummaryEntry = errSummaryEntries.find(summary => summary.errSummaryMessage);
    // console.log('....', filteredErrSummaryEntry);
    if (filteredErrSummaryEntry) {
      this.errorSummaryChild = filteredErrSummaryEntry.errSummaryMessage;
    } else {
      this.errorSummaryChild = null;
    }
    this._emitErrors(true);
  }


  // ngDoCheck() {
  //   this.isValid();
  //   this._syncCurrentExpandedRow();
  // }

  // /**
  //  *
  //  * @private syncs the device details record with the reactive model. Uses view child functionality
  //  */
  // private _syncCurrentExpandedRow(): void {
  //   if (this.deviceChild) {
  //     const deviceFormList = this.getFormDeviceList();
  //     const result = this.syncCurrentExpandedRow(deviceFormList);
  //     // Onlu update the results if there is a change. Otherwise the record will not be dirty

  //     if (result) {
  //       this.deviceChild.deviceFormRecord = result;
  //       this.updateDeviceDetails++;
  //     }
  //   } else {
  //     console.warn('There is no device child');
  //   }
  // }

  /**
   * Processes change events from inputs
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['loadFileIndicator']) {
      this.deviceListForm = this._listService.getReactiveModel(this._fb);     // reset contactListForm to an empty formArray
      this.newRecordIndicator = false;
    }
    if (changes['saveDevice']) {
      this.saveDeviceRecord(changes['saveDevice'].currentValue);
    }
    if (changes['deviceModel'] && !changes['deviceModel'].firstChange) { // && changes['deviceModel'].currentValue && changes['deviceModel'].currentValue.length > 0) {
      //console.log("init with data");
      this.initWithData();
    }
    if (changes['deviceModel'].firstChange) {
      //console.log("first change");
      this.initWithData();
    }

  }

  private initWithData(){
    if (this.deviceModel) { 

      this._listService.setModelRecordList(this.deviceModel);
      this._listService.initIndex(this.deviceModel);

      if ( !this.deviceModel || this.deviceModel.length === 0 ) {
        // Commented this out so that the the device form doesn't appear when user 
        // first loads form
        // console.log("creating form device...");
        // this._createFormDevice();
      } else {
        this._listService.createFormDataList(this.deviceModel, this._fb, this.deviceList); 
        const firstFormRecord = this.deviceList.at(0) as FormGroup;
        firstFormRecord.controls['expandFlag'].setValue(true);
      }

      this._listService.updateUIDisplayValues(this.deviceList);
    }
  }

  private _createFormDevice(){
    const formDevice = this._listService.createDeviceFormRecord(this._fb);
    this.addRecord(formDevice, this.deviceList);
    this._listService.collapseFormRecordList(this._utilsService, this.deviceList, formDevice.controls['id'].value);
  }

  // public isValid(override: boolean = false): boolean {
  //   if (override) {
  //     return true;
  //   }
  //   if (this.newRecordIndicator) {
  //     this.validRec = false;
  //     return false;
  //   } else if (this.deviceChild && this.deviceChild.deviceFormRecord) {
  //     this.validRec = this.deviceListForm.valid && !this.deviceChild.deviceFormRecord.dirty;
  //     return (this.deviceListForm.valid && !this.deviceChild.deviceFormRecord.dirty);
  //   }
  //   this.validRec = this.deviceListForm.valid;
  //   return (this.deviceListForm.valid);
  // }

  public getFormDeviceList(): FormArray {
    return <FormArray>(this.deviceListForm.controls['devices']);
  }

  /**
   * returns an device record with a given id
   * @param {number} id - the identifier for that device record
   * @returns {FormGroup} -the device record, null if theere is no match
   * @private
   */
  // private _getFormDevice(id: number): FormGroup {
  //   let deviceList = this.getFormDeviceList();
  //   return this.getRecord(id, deviceList);
  // }

  /**
   * Adds an device UI record to the device List
   */
  public addDevice(): void {
    this._createFormDevice();

    this._listService.updateUIDisplayValues(this.deviceList);

    document.location.href = "#deviceName"
    this.showErrors = false;
  }

  /**
   * Saves the record to the list. If new adds to the end of the list. Does no error Checking
   * @param record
   */
  public saveDeviceRecord(record: FormGroup) {
    const recordId = this.saveRecord(record, this._listService, this.lang);
    // console.log(`recordId ${recordId} was saved`)

    // collapse this record
    for (let index = 0; index < this.deviceList.controls.length; index++) {
      const element: FormGroup = this.deviceList.controls[index] as FormGroup;
      // console.log(element);
      if (element.controls['id'].value===recordId) {
        element.controls['expandFlag'].setValue(false);
        break;
      } 
    }  

    // when it runs to here, it means no errors for the contact record, so we should also remove its ErrorSummary if there is any
    this._errorNotificationService.removeErrorSummary(recordId.toString());

    this._expandNextInvalidRecord();

    this.showErrors = true;
    
    document.location.href = '#addDeviceBtn';
  }

  private _expandNextInvalidRecord(){
    // expand next invalid record
    for (let index = 0; index < this.deviceList.controls.length; index++) {
     const element: FormGroup = this.deviceList.controls[index] as FormGroup;
     // console.log(element);
     if (element.invalid) {
       element.controls['expandFlag'].setValue(true);
       break;
     } 
   }     
 }

  /**
   *  Updates the error list
   * @param errs - the list of errors to broadcast
   */
  updateErrorList(errs) {
    // console.log("updateErrorList", errs)
    this.errorList = errs;
    // this.errorList = (errs && errs.length > 0) ? this.errorList.concat(errs) : [];
    // for (const err of this.errorList) {
    //   err.index = this.getExpandedRow();
    //   if (err.type === ERR_TYPE_COMPONENT) {
    //     err.expander = this.expander; // associate the expander
    //   }
    // }
    this._emitErrors(false); // needed or will generate a valuechanged error
  }

  /***
   * Emits errors to higher level error summaries. Used for linking summaries
   * @private
   */
  private _emitErrors(checkErrorSummary : boolean): void {
    let emitErrors = [];
    // adding the child errors
    // if (this.errorList) { //  && !this.isInternal
    //   // emitErrors = this.errorList;
    //   this.errorList.forEach((error: any) => {
    //     emitErrors.push(error);
    //   });
    // }
    if (checkErrorSummary && this.errorSummaryChild) {
      emitErrors.push(this.errorSummaryChild);
    }
    // if (!this._isAtLeastOneRecord(this.deviceModel)) {
    //   const oerr: ErrorSummaryObject = getEmptyErrorSummaryObj();
    //   oerr.index = 0;
    //   oerr.tableId = 'deviceListTable';
    //   oerr.type = ERR_TYPE_LEAST_ONE_REC;
    //   oerr.label = 'error.msg.device.one.record';
    //   emitErrors.push(oerr);
    // }
    this.errors.emit(emitErrors);
  }

  private _isAtLeastOneRecord(dataList) : boolean {
    if (dataList && dataList.length > 0) {
      return true;
    }
    return false;
  }


  /***
   * Loads the last saved version of the record data
   * @param record
   */
  public revertDevice(record): void {
    console.log("revert device - list component");
    let recordId = record.controls.id.value;

    let modelRecord = this._listService.getModelRecord(recordId);
    console.log("1: ", modelRecord);
    if (!modelRecord) { 
      modelRecord = this._listService.getEmptyDeviceModel();
      modelRecord.id = recordId;
      console.log("2: ", modelRecord);
    } 
    let rec = this.getRecord(recordId, this.deviceList);
    if (rec) {
      console.log("3: rec value", rec);
      this._recordService.mapDataModelFormModel(modelRecord, rec);
    } else {
      // should never happen, there should always be a UI record
      console.warn('ContactList:rec is null');
    }

    document.location.href = '#deviceName';

  }

  /**
   * Deletes a record from the UI list and the model list, if it exists
   * @param id
   */
  public deleteDevice(id): void {
    this.deleteRecord(id, this.deviceList, this._listService);
    // since the contact record is deleted, we should also remove its ErrorSummary if there is any
    this._errorNotificationService.removeErrorSummary(id);
    this._listService.updateUIDisplayValues(this.deviceList);
    this._expandNextInvalidRecord();
    document.location.href = '#deviceListTable';
    // this.contactsUpdated.emit(this.contactModel);
  }

  /**
   * check if its record exists
   */
  // public isDirty(): boolean {
  //     const isd = !(this.deviceListForm.valid || !this.deviceListForm.errors);
  //     return (isd || this.deviceListForm.dirty || this.newRecordIndicator);
  // }

  /**
   * check if its record exists
   */
  public disableAddButton(): boolean {
    console.log("form is invalid: ", !this.deviceListForm.valid,  "form has errors: ", this.errorList.length>0, 
      "form is dirty: ", this.deviceListForm.dirty);
    return ( !this.deviceListForm.valid  || this.errorList.length > 0 ||  this.deviceListForm.dirty );
  }

  /**
   * Changes the local model back to the last saved version of the requester
   */
  public showErrorsSummary(): boolean {
    return (this.showErrors && this.errorList.length > 0);
  }

  handleRowClick(event: any) {  
    const clickedIndex = event.index;
    const clickedRecordState = event.state;

    // console.log(this._utilsService.logFormControlState(this.contactListForm))

    if (this.deviceListForm.pristine) {
      this.deviceList.controls.forEach( (element: FormGroup, index: number) => {
        if (clickedIndex===index) {
          element.controls['expandFlag'].setValue(!clickedRecordState)
        }
      })
    } else {
      if (this._utilsService.isFrench(this.lang)) {
        alert(
          "Veuillez sauvegarder les données d'entrée non enregistrées."
        );
      } else {
        alert(
          'Please save the unsaved input data.'
        );
      }
    }

  }

  get deviceList(): FormArray {
    return <FormArray>(this.deviceListForm.controls['devices']);
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.deviceModelChangesSubscription.unsubscribe();
  }
}
