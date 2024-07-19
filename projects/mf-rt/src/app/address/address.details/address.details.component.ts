import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation,
  signal,
  computed
} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AddressDetailsService} from './address.details.service';
import { BaseComponent, HelpIndex, ICode, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { GlobalService } from '../../global/global.service';
import { INameAddress } from '../../models/transaction';

@Component({
  selector: 'app-address-details',
  templateUrl: 'address.details.component.html',
  styleUrls: ['address.details.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AddressDetailsComponent extends BaseComponent implements OnInit, OnChanges {
  lang: string;
  helpTextSequences: HelpIndex; 
  countryList: ICode[] = [];
  provinceList: ICode[] = [];
  stateList: ICode[] = [];

  @Input() showErrors: boolean;
  @Input() addressModel;
  @Input() addrType;
  @Input() addrGroupLabelKey;
  @Output() errorList = new EventEmitter(true);

  public addressForm: FormGroup;
  public provStateList: ICode[] = [];
  public provinceLabel = 'addressDetails.province';
  public postalLabel = 'addressDetails.postalZipCode';
  
  public showFieldErrors = false;

 // writable signal for the answer of "Country" field
  readonly selectedCountrySignal = signal<string>('');
  // computed signal for rendering of different "Postal/Zipcode"field
  isCanada = computed(() => {
    return this._utilsService.isCanada(this.selectedCountrySignal());
  });
  isUsa = computed(() => {
    return this._utilsService.isUsa(this.selectedCountrySignal());
  });
  isCanadaOrUSA = computed(() => {
    return this._utilsService.isCanadaOrUSA(this.selectedCountrySignal());
  });

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef, private _detailsService: AddressDetailsService, 
    private _utilsService: UtilsService, private _globalService: GlobalService) {
    super();
    this.showFieldErrors = false;
    this.showErrors = false;
  }

  ngOnInit() {
    this.lang = this._globalService.currLanguage;
    this.helpTextSequences = this._globalService.helpIndex;
    this.countryList = this._globalService.countryList;
    this.provinceList = this._globalService.provinceList;
    this.stateList = this._globalService.stateList; 

    if (!this.addressForm) {
      this.addressForm = this._detailsService.getReactiveModel(this._fb);
    }
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);
    // console.log("isFirstChange:", isFirstChange);
    if (!isFirstChange) {
      if (changes['showErrors']) {
        this.showFieldErrors = changes['showErrors'].currentValue;
      }

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
    const selectedCountryId = this.addressForm.controls['country'].value;
    this.selectedCountrySignal.set(selectedCountryId);

    if (e) {
      // reset provText etc fields when the action is triggered from the UI
      const valuesToReset = ['provText', 'postal', 'provState'];
      this._resetControlValues(valuesToReset);
    }

    if (this.isCanadaOrUSA()) {
      // updte provState and postal fields' validator and refresh the provStateList based on country
      this.addressForm.controls['provState'].setValidators([Validators.required]);
      this.addressForm.controls['provState'].updateValueAndValidity();

      if (this.isCanada()) {
        this.addressForm.controls['postal'].setValidators([Validators.required, ValidationService.canadaPostalValidator]);
        this.provStateList = this.provinceList;

        this.postalLabel = 'addressDetails.postalCode';
        this.provinceLabel = 'addressDetails.province';

      } else {
        this.addressForm.controls['postal'].setValidators([Validators.required, ValidationService.usaPostalValidator]);
        this.provStateList = this.stateList;

        this.postalLabel = 'addressDetails.zipCode';
        this.provinceLabel = 'addressDetails.state';
      }
      this.addressForm.controls['postal'].updateValueAndValidity();

    } else {
      // updte provState and postal fields' validator
      this.addressForm.controls['provState'].setValidators([]);
      this.addressForm.controls['provState'].updateValueAndValidity();

      this.addressForm.controls['postal'].setValidators([Validators.required]);     
      this.addressForm.controls['postal'].updateValueAndValidity();

      this.postalLabel = 'addressDetails.postalZipCode';
      this.provinceLabel = '';
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

}

