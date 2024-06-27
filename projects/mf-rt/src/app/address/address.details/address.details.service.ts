import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ConverterService, ICode, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { GlobalService } from '../../global/global.service';
import { INameAddress } from '../../models/transaction';

@Injectable()
export class AddressDetailsService {

  constructor(private _utilsService: UtilsService, private _converterService: ConverterService, private _globalService: GlobalService) { }

  /**
   * Gets the reactive forms Model for address details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      companyName: [null, Validators.required],
      address: [null, Validators.required],
      provText: '',
      provState: '',
      city: ['', [Validators.required, Validators.min(5)]],
      country: [null, [Validators.required, ValidationService.countryValidator]],
      postal: ['', [Validators.required]]
    });
  }

  public mapFormModelToDataModel(formValue: any, addressModel: INameAddress) {

    const lang = this._globalService.currLanguage;
    const countryList: ICode[] = this._globalService.countryList;
    const combinedProvStatList: ICode[] = this._globalService.provinceList.concat(this._globalService.stateList);

    addressModel.company_name = formValue['companyName'];
    addressModel.street_address = formValue['address'];
    addressModel.city = formValue['city'];

    addressModel.country = formValue['country'] ? 
        this._converterService.findAndConverCodeToIdTextLabel(countryList, formValue['country'], lang) : null;

    if (addressModel.country) {
      if (this._utilsService.isCanadaOrUSA(addressModel.country._id)) {
        addressModel.province_text = '';
        addressModel.province_lov = formValue['provState'] ? 
          this._converterService.findAndConverCodeToIdTextLabel(combinedProvStatList, formValue['provState'], lang) : null;
        }else {
          addressModel.province_text = formValue['provText'];
          addressModel.province_lov = null;
        } 
    } else {
      addressModel.province_text = formValue['provText'];
    }
    addressModel.postal_code = formValue['postal'];
  }

  public mapDataModelToFormModel(addressModel, formRecord: FormGroup) {
    formRecord.controls['companyName'].setValue(addressModel.company_name);
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
  
}
