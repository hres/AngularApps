import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AMEND, FINAL, NEW } from '../app.constants';
import { NO, ValidationService, YES } from '@hpfb/sdk/ui';
import { GeneralInformation } from '../models/Enrollment';
// import {GlobalsService} from '../globals/globals.service';
// import {ValidationService} from '../validation.service';
// import {ListService} from '../list-service';

@Injectable()
export class CompanyInfoService {

  // public statusList: Array<any> = [
  //   NEW,
  //   AMEND,
  //   FINAL
  // ];

  constructor(private _fb: FormBuilder) {}

  /**
   * Gets the reactive forms Model for generalInfo details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  getReactiveModel() {
    return this._fb.group({
      firstname: [''],
      formStatus: NEW,
      // enrolVersion: '0.0',
      lastSavedDate: '',
      companyId: ['', [Validators.required, ValidationService.companyIdValidator]],
      amendReason: [null, Validators.required],
      nameChange: [false, []],
      addressChange: [false, []],
      facilityChange: [false, []],
      contactChange: [false, []],
      otherChange: [false, []],
      otherDetails: ['', [Validators.required]],
      areLicensesTransfered: ['', [Validators.required]]
    });
  }

  getAmendReasons() {
    return ['manuname', 'manuaddr', 'facility', 'other'];
  }

  /**
   * Gets an empty
   *
   */
  getEmptyModel() {
    return (
      {
        status: '',
        enrol_version: '0.0',
        last_saved_date: '',
        company_id: '',
        amend_reasons: {
          manufacturer_name_change: '',
          manufacturer_address_change: '',
          facility_change: '',
          contact_change: '',
          other_change: '',
          other_details: ''
        },
        are_licenses_transfered: ''
      }
    );
  }

  mapFormModelToDataModel(formRecord: FormGroup, generalInfoModel) {
    generalInfoModel.status = formRecord.controls['formStatus'].value;
    // generalInfoModel.enrol_version = formRecord.controls['enrolVersion.value;
    generalInfoModel.last_saved_date = formRecord.controls['lastSavedDate'].value;
    if (formRecord.controls['companyId'].value) {
      generalInfoModel.company_id = 'K' + formRecord.controls['companyId'].value;
    }
    generalInfoModel.amend_reasons.manufacturer_name_change = formRecord.controls['nameChange'].value ? YES : NO;
    generalInfoModel.amend_reasons.manufacturer_address_change =
      formRecord.controls['addressChange'].value ? YES : NO;
    generalInfoModel.amend_reasons.facility_change = formRecord.controls['facilityChange'].value ? YES : NO;
    generalInfoModel.amend_reasons.contact_change = formRecord.controls['contactChange'].value ? YES : NO;
    generalInfoModel.amend_reasons.other_change = formRecord.controls['otherChange'].value ? YES : NO;
    generalInfoModel.amend_reasons.other_details = formRecord.controls['otherDetails'].value;
    generalInfoModel.are_licenses_transfered = formRecord.controls['areLicensesTransfered'].value;
  }

  mapDataModelToFormModel(generalInfoModel : GeneralInformation, formRecord: FormGroup) {
    formRecord.controls['formStatus'].setValue(generalInfoModel.status);
    // formRecord.controls['enrolVersion'].setValue(generalInfoModel.enrol_version);
    formRecord.controls['lastSavedDate'].setValue(generalInfoModel.last_saved_date);
    if (generalInfoModel.company_id) {
      formRecord.controls['companyId'].setValue(generalInfoModel.company_id.slice(1));
    }
    const namec = generalInfoModel.amend_reasons.manufacturer_name_change === YES ? true : false;
    formRecord.controls['nameChange'].setValue(namec);
    const addc = generalInfoModel.amend_reasons.manufacturer_address_change === YES ? true : false;
    formRecord.controls['addressChange'].setValue(addc);
    const facc = generalInfoModel.amend_reasons.facility_change === YES ? true : false;
    formRecord.controls['facilityChange'].setValue(facc);
    const conc = generalInfoModel.amend_reasons.contact_change === YES ? true : false;
    formRecord.controls['contactChange'].setValue(conc);
    const othc = generalInfoModel.amend_reasons.other_change === YES ? true : false;
    formRecord.controls['otherChange'].setValue(othc);
    formRecord.controls['amendReason'].setValue((namec || addc || facc || othc) ? 'reasonFilled' : null);
    formRecord.controls['otherDetails'].setValue(generalInfoModel.amend_reasons.other_details);
    formRecord.controls['areLicensesTransfered'].setValue(generalInfoModel.are_licenses_transfered);
  }

  getRecordId(record: FormGroup) {
    // return (record.controls['id.value);
  }

  setRecordId(record: FormGroup, value: number): void {
    if (!record) {return; }
    // record.controls['id'].setValue(value);
  }

  /**
   * Sets the Final Status
   *
   */
  setAmendStatus() {
    return AMEND;
  }

  public setValidaors(record: FormGroup, eventValue) {
    // record.controls['companyId.setValidators([Validators.required, ValidationService.companyIdValidator]);
    // record.controls['companyId.updateValueAndValidity();
    return [];
  }


}
