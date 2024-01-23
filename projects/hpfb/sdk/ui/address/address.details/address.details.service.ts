import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidationService } from '../../validation/validation.service';
import { UtilsService } from '../../utils/utils.service';
import { ConverterService } from '../../converter/converter.service';
import { ICode } from '../../data-loader/data';
import { INameAddress } from '../../model/entity-base';

@Injectable()
export class AddressDetailsService {

  constructor(private _fb: FormBuilder, private _utilsService: UtilsService, private _converterService: ConverterService) {}

  getReactiveModel() {
    return this._fb.group({
      companyName: [null, Validators.required],
      address: [null, Validators.required],
      provText: '',
      provList: '',
      city: ['', [Validators.required, Validators.min(5)]],
      country: [null, [Validators.required, ValidationService.countryValidator]],
      postal: ['', []]
    });
  }

  mapFormModelToDataModel(formRecord: FormGroup, addressModel: INameAddress, countryList: ICode[], provStatList: ICode[], lang: string) {
    addressModel.company_name = formRecord.controls['companyName'].value;
    // addressModel.business_number = formRecord.controls['businessNum'].value;
    addressModel.street_address = formRecord.controls['address'].value;
    addressModel.city = formRecord.controls['city'].value;

    const countryCodeValue = this._utilsService.findCodeById(countryList, formRecord.controls['country'].value);
    addressModel.country = countryCodeValue? this._converterService.convertCodeToIdTextLabel(countryCodeValue, lang) : null;
    
    const provCodeValue = this._utilsService.findCodeById(provStatList, formRecord.controls['provList'].value);
    addressModel.province_lov = provCodeValue? this._converterService.convertCodeToIdTextLabel(provCodeValue, lang) : null;

    addressModel.province_text = formRecord.controls['provText'].value;
    addressModel.postal_code = formRecord.controls['postal'].value;
  }

  mapDataModelToFormModel(addressModel: INameAddress, formRecord: FormGroup) {
    formRecord.controls['companyName'].setValue(addressModel.company_name);
    // formRecord.controls['businessNum'].setValue(addressModel.business_number);
    formRecord.controls['address'].setValue(addressModel.street_address);
    formRecord.controls['city'].setValue(addressModel.city);
    formRecord.controls['postal'].setValue(addressModel.postal_code);

    const countryId: string | undefined = this._utilsService.getIdFromIdTextLabel(addressModel.country);
    formRecord.controls['country'].setValue(countryId? countryId : null);
   
    const provLovId: string | undefined = this._utilsService.getIdFromIdTextLabel(addressModel.province_lov);
    formRecord.controls['provList'].setValue(provLovId? provLovId : null);

    formRecord.controls['provText'].setValue(addressModel.province_text);
  }

  public setProvinceState(record: FormGroup, countryValue: string, provList: ICode[], stateList: ICode[]) {

    let provinceStateList: ICode[] = null;

    if (this._utilsService.isCanadaOrUSA(countryValue)) {

      record.controls['provText'].setValue('');
      record.controls['provList'].setValidators([Validators.required]);

      if (this._utilsService.isCanada(countryValue)) {
        // Canada
        record.controls['postal'].setValidators([Validators.required, ValidationService.canadaPostalValidator]);
        provinceStateList = provList;
      } else {
        // USA
        record.controls['postal'].setValidators([Validators.required, ValidationService.usaPostalValidator]);
        provinceStateList = stateList;
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

    return provinceStateList;

  }

  /**
   * Find a record by its unique id,. If a dup, returns first instance
   * @param list
   * @param criteria
   * @returns {any}
   */
  findRecordByTerm(list, criteria, searchTerm) {

    let result = list.filter(
      item => item[searchTerm] === criteria[searchTerm]);
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  }

}
