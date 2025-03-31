import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddressDetailsService } from './address.details.service';
import { BaseComponent, CANADA, HelpIndex, ICode, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { INameAddress } from '../../model/entity-base';

@Component({
  selector: 'pbv-address-details',
  templateUrl: 'address.details.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AddressDetailsComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() showErrors: boolean;
  @Input() addressModel;
  @Input() lang;
  @Input() countryList;
  @Input() provinceList;
  @Input() stateList;
  @Input() canadaDefault: boolean;
  @Input() addrType;
  @Input() addrGroupLabelKey;
  @Output() errorList = new EventEmitter(true);

  @Input() formGroup?: FormGroup;
  @Input() recordId?: number | null = null;

  public addressForm: FormGroup;
  // public provinceLabel = 'addressDetails.province';
  // public postalLabel = 'addressDetails.postalZipCode';
  public showFieldErrors = false;

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef, private _detailsService: AddressDetailsService,
    private _utilsService: UtilsService) {
    super();
    this.showFieldErrors = false;
    this.showErrors = false;
  }

  ngOnInit() {
    if (!this.addressForm) {
      this.addressForm = this._detailsService.getReactiveModel(this._fb);
    }
    if (this.canadaDefault) {
      this.addressForm.controls['country'].setValue(CANADA);
      this.addressForm.controls['country'].disable(); // Method to grey out/disable the country dropdown
      this.onCountryChange(null); // Call onCountryChange to change Postal/ZIP code -> Postal Code, Province or state -> Province
    }
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.showFieldErrors = this.showErrors || this.showFieldErrors;
    const isFirstChange = this._utilsService.isFirstChange(changes);
    if (changes['formGroup']) {
      this.addressForm = this.formGroup;
    }
    if (!isFirstChange) {
      if (changes['addressModel']) {
        const dataModel = changes['addressModel'].currentValue as INameAddress;
        if (dataModel) {
          this._detailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.addressForm));
          this.onCountryChange(null);
        }
      }
    }
  }

  onCountryChange(e: any): void {

    if (e) {
      // reset provText etc fields when the action is triggered from the UI
      const valuesToReset = ['provText', 'postal', 'provState'];
      this._resetControlValues(valuesToReset);
    }

    if (this.isCanadaOrUSA()) {
      // update provState and postal fields' validator
      this.addressForm.controls['provState'].setValidators([Validators.required]);
      this.addressForm.controls['provState'].updateValueAndValidity();

      if (this.isCanada()) {
        this.addressForm.controls['postal'].setValidators([Validators.required, ValidationService.canadaPostalValidator]);
      } else {
        this.addressForm.controls['postal'].setValidators([Validators.required, ValidationService.usaPostalValidator]);
      }
      this.addressForm.controls['postal'].updateValueAndValidity();

    } else {
      // update provState and postal fields' validator
      this.addressForm.controls['provState'].setValidators([]);
      this.addressForm.controls['provState'].updateValueAndValidity();

      this.addressForm.controls['postal'].setValidators([Validators.required]);     
      this.addressForm.controls['postal'].updateValueAndValidity();
    }
  }

  getFormValue() {
    return this.addressForm.value;
  }

  private _resetControlValues(controlNames: string[]) {
    for (let i = 0; i < controlNames.length; i++) {
      this._utilsService.resetControlsValues(this.addressForm.controls[controlNames[i]]);
    }
  }

  isCanadaOrUSA() {
    return this._utilsService.isCanadaOrUSA(this.getCountryValue());
  }

  isCanada() {
    return this._utilsService.isCanada(this.getCountryValue());
  }

  isUsa() {
    return this._utilsService.isUsa(this.getCountryValue());
  }

  getCountryValue() {
    return this.addressForm.controls['country'].value
  }

  /**
   * Reactive funtion to return the provStateList based on selected country
   * 
   * @returns ICode[] of either states or provinces or empty if neither Canada or USA is selected
   */
  provStateList() : ICode[]{
    if (this.isCanada()) {
      return this.provinceList;
    } else if (this.isUsa()) {
      return this.stateList;
    } else {
      return [];
    }
  }

  /**
   * Reactive function to return province label if country is Canada or USA
   * @returns Either "Province" or "State"
   */
  provinceLabel() : string {
    if (this.isCanada()) {
      return 'addressDetails.province'
    } else {
      return 'addressDetails.state';
    }
  }

  /**
   * Reactive function to return postal code label if country is Canada/USA/neither
   * @returns Either "Postal code"/"ZIP code"/"Postal/ZIP code"
   */
  postalLabel(): string {
    if (this.isCanada()) {
      return 'addressDetails.postalCode'
    } else if (this.isUsa()) {
      return 'addressDetails.zipCode';
    } else {
      return 'addressDetails.postalZipCode';
    }
  }

}
