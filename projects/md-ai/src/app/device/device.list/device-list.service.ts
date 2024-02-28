import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {DeviceRecordService} from '../device-record/device-record.service';

import {DeviceDetailsService} from '../device.details/device.details.service';
import { RecordListBaseService, RecordListServiceInterface } from '@hpfb/sdk/ui';
import { Observable, Subject } from 'rxjs';
import { Device } from '../../models/Enrollment';
import { ApplicationInfoBaseService } from '../../form-base/application-info-base.service';

@Injectable()
export class DeviceListService extends RecordListBaseService implements RecordListServiceInterface {

  /***
   *  The data list of device records
   * @type {{id: number; device: string; country: {id: string; text: string}}[]}
   */
  private deviceList = [];

  // to facilitate to subscribe to deviceModel's changes
  private deviceModelSubject: Subject<any> = new Subject<any>();
  deviceModelChanges$: Observable<any> = this.deviceModelSubject.asObservable(); 

  // whenever deviceList changes, notify subscribers
  notifyDeviceModelChanges(changes: any) {
    this.deviceModelSubject.next(changes);
  }

  constructor(private _baseService: ApplicationInfoBaseService, private _recordService: DeviceRecordService, private _detailsService: DeviceDetailsService) {
    super();
    this.deviceList = [];
    this.initIndex(this.deviceList);
  }

  /**
   * Gets the array of  model records
   * @returns {{id: number; device: string; city: string; country: {id: string; text: string}}[]}
   */
  public getModelRecordList() {
    return this.deviceList;
  }

  /**
   * Sets the data model. Converts the data model to the form model
   * @param value
   */
  public setModelRecordList(value) {
    this.deviceList = value;
    this.notifyDeviceModelChanges({...this.deviceList});
  }

  getEmptyDeviceModel(): Device {
    let device: Device = this._baseService.getEmptyDeviceModel();
    // this value is used when reverting an unsaved device formRecord
    return device;
  }

  public getReactiveModel(fb: FormBuilder): FormGroup {
    return fb.group({
      devices: fb.array([])
    });
  }

  // /**
  //  * Adds
  //  * @param record
  //  */
  // addDevice(record) {
  //   // TODO error checking
  //   this.deviceList.push(record);
  // }

  // getDeviceModel() {

  //   return DeviceRecordService.getEmptyModel();
  // }

  // getDeviceFormRecord(fb: FormBuilder) {

  //   return DeviceRecordService.getReactiveModel(fb);
  // }

  createDeviceFormRecord(fb: FormBuilder) {
    const formRecord = this._recordService.getReactiveModel(fb);
    const nextId = this.getNextIndex();
    formRecord.controls['id'].setValue(nextId);
    return formRecord;
  }


  public deviceFormToData(record: FormGroup, deviceModel) {
    this._recordService.mapFormModelToDataModel(record, deviceModel);
    // return (record);
  }

  public createFormDataList(modelDataList, fb: FormBuilder, theList) {
    for (let i = 0; i < modelDataList.length; i++) {
      const formRecord = this._recordService.getReactiveModel(fb);
      this.deviceDataToForm(modelDataList[i], formRecord);
      theList.push(formRecord);
    }
  }

  public deviceDataToForm(deviceModel, record: FormGroup) {
    this._recordService.mapDataModelFormModel(deviceModel, record);
    // return (record);
  }

  public saveRecord(formRecord: FormGroup) {
    let modelList = this.getModelRecordList();
    let id:number;
    let deviceModel: Device = null;

    if (formRecord.controls['isNew'].value) {
      // this.setRecordId(record, this.getNextIndex());
      formRecord.controls['isNew'].setValue(false);
      deviceModel = this.getEmptyDeviceModel();
      modelList.push(deviceModel);
      this.deviceFormToData(formRecord, deviceModel);
      // return deviceModel.id;
    } else {
      deviceModel = this.getModelRecord(formRecord.controls['id'].value);
      if (!deviceModel) {
        deviceModel = this.getEmptyDeviceModel();
        modelList.push(deviceModel);
      }
      this.deviceFormToData(formRecord, deviceModel);

      // let modelRecord = this.getModelRecord(record.controls.id.value);
      // let updatedModel = this.deviceFormToData(record, modelRecord);
    }

    this.notifyDeviceModelChanges({ ...modelList });
    id = deviceModel.id;
    return id;
  }

  public getModelRecord(id: number) {
    let modelList = this.getModelRecordList();

    for (let i = 0; i < modelList.length; i++) {
      if (Number(modelList[i].id) === id) {
        return modelList[i];
      }
    }
    return null;
  }

  deleteModelRecord(id): boolean {
    let modelList = this.getModelRecordList();
    for (let i = 0; i < modelList.length; i++) {
      if (Number(modelList[i].id) === id) {
        modelList.splice(i, 1);
        if (id === this.getCurrentIndex()) {
          this.setIndex(id - 1);
        }
        this.notifyDeviceModelChanges({ ...modelList });
        return true;
      }
    }
    return false;
  }

  // public getRecordId(record: FormGroup) {
  //   return DeviceDetailsService.getRecordId(record);
  // }

  // public setRecordId(record: FormGroup, value: number): void {
  //   DeviceDetailsService.setRecordId(record, value);
  // }

  updateUIDisplayValues(formRecordList: FormArray){
    // update Contact Record seqNumber
    this.updateFormRecordListSeqNumber(formRecordList); 
    
  }

}
