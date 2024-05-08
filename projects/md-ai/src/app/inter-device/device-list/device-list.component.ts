import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren, ViewEncapsulation, effect, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlMessagesComponent, ErrorModule, ErrorSummaryComponent, ExpanderModule, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../global/global.service';
import { Device } from '../../models/Enrollment';
import { first } from 'rxjs';
import { DeviceService } from '../device.service';
import { DeviceListService } from './device-list.service';
import { ErrorNotificationService } from '@hpfb/sdk/ui/error-msg/error.notification.service';

@Component({
    selector: 'app-device-list',
    templateUrl: './device-list.component.html',
    encapsulation: ViewEncapsulation.None
})

export class DeviceListComponent implements OnInit, OnChanges, AfterViewInit {
  deviceListForm: FormGroup;
  @Input() public deviceListData: Device[];
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // @Output() public contactsUpdated = new EventEmitter();

  // errors = signal<ControlMessagesComponent[]>([]);

  deviceService = inject(DeviceService)
  deviceListService = inject(DeviceListService)

  public showErrors = false;
  public errorList = [];
  errorSummaryChild = null;

  constructor(private fb: FormBuilder, 
              private _utilsService: UtilsService, 
              private _globalService: GlobalService, 
              private _deviceService : DeviceService,
              private _errorDeviceNotificationService : ErrorNotificationService) {

    this.deviceListForm = this.fb.group({
      devices: this.fb.array([])
    });

    effect(() => {
      // console.log('[effect2]', this._deviceService.errors());
    });
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(this._utilsService.checkComponentChanges(changes));
    if (changes['deviceListData']) {
      this._init(changes['deviceListData'].currentValue);
    }
  }

  ngAfterViewInit(): void {
    this.msgList.changes.subscribe(errorObjs => {
      this._updateLocalErrorList(errorObjs);
    });
    this.msgList.notifyOnChanges();
    
    this._errorDeviceNotificationService.errorSummaryChanged$.subscribe((errors) => {
      this._processErrorSummaries(errors);
    });
  }

  private _processErrorSummaries(errSummaryEntries: { key: string, errSummaryMessage: ErrorSummaryComponent }[]): void {
    // console.log('...._processErrorSummaries:', errSummaryEntries);
    // get the first entry where the errSummaryMessage property is not empty 
    // as we only need one summary entry of this list section if there is any to be bubbled up to the top level error summary section
    // console.log("processing error summary in contact list component...", errSummaryEntries);
    const filteredErrSummaryEntry = errSummaryEntries.find(summary => summary.errSummaryMessage && summary.errSummaryMessage.componentId !== "materialListTable");
    // console.log('....', filteredErrSummaryEntry);
    if (filteredErrSummaryEntry) {
      this.errorSummaryChild = filteredErrSummaryEntry.errSummaryMessage;
    } else {
      this.errorSummaryChild = null;
    }
    this._emitErrors();
  } 

  addDevice() {
    const group = this.deviceService.createDeviceFormGroup(this.fb);
    this.devicesFormArr.push(group);
  }

  saveDeviceRecord(event: any) {  
    const index = event.index;

    const group = this.devicesFormArr.at(index) as FormGroup;
    // if this is a new record, assign next available id, otherwise, use it's existing id
    const id = group.get('isNew').value? this.deviceListService.getNextId(): group.get('id').value
    group.patchValue({ 
      id: id,
      isNew: false,
      expandFlag: false,    // collapse this record
    });

    const deviceInfo = this.getDeviceInfo(group);

    // Update the status if it is passed in
    // if (status) {
    //   contactInfo.controls['status'].setValue(status);
    // }

    // Update lastSavedState with the current value of contactInfo
    group.get('lastSavedState').setValue(deviceInfo.value);

    this._expandNextInvalidRecord();

    // this.contactsUpdated.emit(this.getContactsFormArrValues());
    this._globalService.setDevicesFormArrValue(this.getDevicesFormArrValues());
  }

  private _expandNextInvalidRecord(){
    // expand next invalid record
    for (let index = 0; index < this.devicesFormArr.controls.length; index++) {
     const group: FormGroup = this.devicesFormArr.controls[index] as FormGroup;
     if (group.invalid) {
      group.controls['expandFlag'].setValue(true);
       break;
     } 
   }     
 }

  deleteDeviceRecord(index){
    const group = this.devicesFormArr.at(index) as FormGroup;
    const deviceInfo = this.getDeviceInfo(group);
    deviceInfo.reset();
    this.devicesFormArr.removeAt(index);

    if (this.devicesFormArr.length == 0) {
      this._deviceService.showDeviceErrorSummary.set(false);
      
    }

    // this.contactsUpdated.emit(this.getContactsFormArrValues());
    this._globalService.setDevicesFormArrValue(this.getDevicesFormArrValues());
  }

  revertDevice(event: any) {  
    const index = event.index;
    const id = event.id;

    const group = this.devicesFormArr.at(index) as FormGroup;
    const deviceInfo =this.getDeviceInfo(group);

    // Revert to the last saved state
    const lastSavedState = group.get('lastSavedState').value;

    deviceInfo.patchValue(lastSavedState);    
  }

  
  private _init(devicesData: Device[]) {
      // Clear existing controls
    this.devicesFormArr.clear();

    if (devicesData) {
      if (devicesData.length > 0) {
        devicesData.forEach(device => {
          const group = this.deviceService.createDeviceFormGroup(this.fb);

          // Set values after defining the form controls
          group.patchValue({
            id: device.device_id,
            isNew: false,
            expandFlag: false,
          });

          this._patchDeviceInfoValue(group, device);

          this._deviceService.setDeviceDetailsErrorsToNull(group.controls['deviceInfo']);
          this.devicesFormArr.push(group);
        });
      }
    } else {
      const group = this.deviceService.createDeviceFormGroup(this.fb);
      this.devicesFormArr.push(group);
      const firstFormRecord = this.devicesFormArr.at(0) as FormGroup;
      firstFormRecord.controls['expandFlag'].setValue(true);
    }

    this._globalService.setDevicesFormArrValue(this.getDevicesFormArrValues());

    // if (this.isInternal) {
    //   this._expandNextInvalidRecord();
    // } else {
      // expand the first record

      // Set the list of form groups
    this.deviceListService.setList(this.devicesFormArr.controls as FormGroup[]);
  }

  // todo add contact type
  private _patchDeviceInfoValue(group: FormGroup, device): void {
    group.controls['deviceInfo'].patchValue({
      deviceName: device.device_name,
      deviceAuthorized: device.device_authorized,
      licenceNum: device.licence_number,
      deviceApplicationSubmitted: device.device_application_submitted,
      //deviceApplicationNumber: [null, [Validators.required, ValidationService.appNumValidator ]],
      deviceApplicationNumber: device.device_application_number,
      deviceExplain: device.device_explain
    });
  }

  handleRowClick(event: any) {  
    const clickedIndex = event.index;
    const clickedRecordState = event.state;


    if (this.deviceListForm.pristine) {
      this.devicesFormArr.controls.forEach( (element: FormGroup, index: number) => {
        if (clickedIndex===index) {
          element.controls['expandFlag'].setValue(!clickedRecordState)
        }
      })
    } else {
      // if (this._utilsService.isFrench(this.lang)) {
      //   alert(
      //     "Veuillez sauvegarder les données d'entrée non enregistrées."
      //   );
      // } else {
        alert(
          'Please save the unsaved input data.'
        );
      // }
    }

  } 

  /**
   * Method to check if child device item has any errors
   * 
   * @param errs 
   */
  showError(errs) {
    if (errs.length > 0) {
      this.showErrors = true;
    } else {
      this.showErrors = false;
    }
  }
  
  public disableAddButton(): boolean {
    // console.log("device list form", this.deviceListForm);
    // console.log("form is invalid: ", !this.deviceListForm.valid,  "form has errors: ", this.showErrors, "form is dirty: ", this.deviceListForm.dirty);
    return ( !this.deviceListForm.valid  || this.showErrors ||  this.deviceListForm.dirty );
  }

  private _updateLocalErrorList(errs) {
    if (errs) {
      errs.forEach(err => {
       this.errorList.push(err);
      });
    } 
    if (errs.length == 0) {
      this.errorList = errs;
    }

    this._emitErrors(); // needed or will generate a valuechanged error
  }

  private _emitErrors(): void {
    let emitErrors = [];

    if (this.errorSummaryChild) {
      emitErrors.push(this.errorSummaryChild);
    }
    
    // Error List is a QueryList type
    if (this.errorList) {
      this.errorList.forEach(err => {
        emitErrors.push(err);
      })
    }
   
    this._deviceService.deviceErrors.update( errors => emitErrors );
  }

  get devicesFormArr(): FormArray {
    return this.deviceListForm.get('devices') as FormArray;
  }

  getDeviceInfo(deviceFormGroup : FormGroup): FormGroup {
    return deviceFormGroup.get('deviceInfo') as FormGroup;
  }

  getDevicesFormArrValues(): any {
    return this.devicesFormArr.value;
  }  

}