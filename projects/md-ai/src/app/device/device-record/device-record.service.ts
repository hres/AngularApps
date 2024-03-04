import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DeviceDetailsService} from '../device.details/device.details.service';

@Injectable()
export class DeviceRecordService {

  constructor(private _detailsService: DeviceDetailsService) {
  }

  public getReactiveModel(fb: FormBuilder): FormGroup {
    if (!fb) {
      return null;
    }
    return fb.group({
        id: -1,
        seqNumber: -1,
        detailsDirty: [false, Validators.required],
        isNew: true,
        expandFlag: false,
        noErrors: false,
        deviceDetails: this._detailsService.getReactiveModel(fb)
      }
    );
  }

  public mapFormModelToDataModel(formRecord: FormGroup, deviceRecordModel) {
  //  console.log (deviceRecordModel);
  //   console.log(formRecord);
    deviceRecordModel.id = formRecord.controls['id'].value;
    // deviceRecordModel.company = formRecord.controls.companyName.value;
    this._detailsService.mapFormModelToDataModel((<FormGroup>formRecord.controls['deviceDetails']), deviceRecordModel);

  }


  public mapDataModelFormModel(deviceRecordModel, formRecord: FormGroup) {
    formRecord.controls['id'].setValue(Number(deviceRecordModel.id));
    formRecord.controls['isNew'].setValue(false);
    // formRecord.controls.companyName.setValue(deviceRecordModel.company);
    this._detailsService.mapDataModelToFormModel(deviceRecordModel, <FormGroup>formRecord.controls['deviceDetails']);
  }

}
