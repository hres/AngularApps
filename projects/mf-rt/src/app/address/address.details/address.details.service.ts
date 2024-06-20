import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ConverterService, ICode, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { GlobalService } from '../../global/global.service';
import { INameAddress } from '../../models/transaction';

@Injectable()
export class AddressDetailsService {

  private countryList: Array<any>;
  private stateList: Array<any>;
  public provinces: Array<any> = [];


  constructor(private _utilsService: UtilsService, private _converterService: ConverterService, private _globalService: GlobalService) {
    this.countryList = [];
  }

  /**
   * Gets the reactive forms Model for address details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      companyName: [null, Validators.required],
      // businessNum: '',
      address: [null, Validators.required],
      provText: '',
      provState: '',
      city: ['', [Validators.required, Validators.min(5)]],
      country: [null, [Validators.required, ValidationService.countryValidator]],
      postal: ['', [Validators.required]]
    });
  }

  public mapFormModelToDataModel(formRecord: FormGroup, addressModel: INameAddress, countryList: ICode[], combinedProvStatList: ICode[], lang: string) {
    addressModel.company_name = formRecord.controls['companyName'].value;
    // addressModel.business_number = formRecord.controls.businessNum.value;
    addressModel.street_address = formRecord.controls['address'].value;
    addressModel.city = formRecord.controls['city'].value;
    if (formRecord.controls['country'].value && formRecord.controls['country'].value.length > 0) {
      addressModel.country =  this._converterService.findAndConverCodeToIdTextLabel(countryList, formRecord.controls['country'].value, lang);
    } else {
      addressModel.country = null;
    }

    const country_id = addressModel.country._id;
    if (this._utilsService.isCanadaOrUSA(country_id)) {
      addressModel.province_text = '';
      addressModel.province_lov = formRecord.controls['provState'].value ? 
        this._converterService.findAndConverCodeToIdTextLabel(combinedProvStatList, formRecord.controls['provState'].value, lang) : null;
    } else {
      addressModel.province_lov = null;
      addressModel.province_text = formRecord.controls['provText'].value
    }
    addressModel.postal_code = formRecord.controls['postal'].value;
  }

  public mapDataModelToFormModel(addressModel, formRecord: FormGroup) {
    formRecord.controls['companyName'].setValue(addressModel.company_name);
    // formRecord.controls.businessNum.setValue(addressModel.business_number);
    formRecord.controls['address'].setValue(addressModel.street_address);
    formRecord.controls['city'].setValue(addressModel.city);
    formRecord.controls['postal'].setValue(addressModel.postal_code);

    if (addressModel.country) {
      formRecord.controls['country'].setValue(addressModel.country._id);

      if (this._utilsService.isCanadaOrUSA(addressModel.country._id)) {
        formRecord.controls['provState'].setValue(addressModel.province_lov._id);
      } else {
        formRecord.controls['provText'].setValue(addressModel.province_text);
      }
    } else {
      formRecord.controls['country'].setValue(null);
    }
  }

  public setProvinceState(record: FormGroup, countryId: string, provinceList: ICode[], stateList: ICode[]): ICode[] {

    let listToReturn: ICode[] = [];

    if (this._utilsService.isCanadaOrUSA(countryId)) {

      this._utilsService.resetControlsValues(record.controls['provText'])
      record.controls['provList'].setValidators([Validators.required]);

      if (this._utilsService.isCanada(countryId)) {
        record.controls['postal'].setValidators([Validators.required, ValidationService.canadaPostalValidator]);
        listToReturn = provinceList;
      } else {
        record.controls['postal'].setValidators([Validators.required, ValidationService.usaPostalValidator]);
        listToReturn = stateList;
      }
      record.controls['provList'].updateValueAndValidity();
      record.controls['postal'].updateValueAndValidity();

    } else {
      record.controls['provList'].setValidators([]);
      record.controls['provList'].setValue('');
      record.controls['postal'].setValidators([Validators.required]);
      record.controls['provList'].updateValueAndValidity();
      record.controls['postal'].updateValueAndValidity();
    }

    return listToReturn;
  }
  
  /**
   * Sets the country list to be used for all addres details records
   * @param {Array<any>} value
   */
  public setCountryList(value: Array<any>) {
    this.countryList = value;

  }

}
