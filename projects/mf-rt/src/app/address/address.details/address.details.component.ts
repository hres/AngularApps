import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation,
  signal,
  computed
} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AddressDetailsService} from './address.details.service';
import { ControlMessagesComponent, HelpIndex, ICode, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { GlobalService } from '../../global/global.service';
import { INameAddress } from '../../models/transaction';

@Component({
  selector: 'address-details',
  templateUrl: 'address.details.component.html',
  styleUrls: ['address.details.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AddressDetailsComponent implements OnInit, OnChanges, AfterViewInit {
  lang: string;
  helpTextSequences: HelpIndex; 
  countryList: ICode[] = [];
  provinceList: ICode[] = [];
  stateList: ICode[] = [];

  public addressFormLocalModel: FormGroup;
  @Input('group') public addressFormRecord: FormGroup;
  @Input() public addressDetailsModel;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;

  @Input() addressModel;
  @Input() addrType;
  @Output() errorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert

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
    this.showFieldErrors = false;
    this.showErrors = false;
  }

  ngOnInit() {
    this.lang = this._globalService.currLanguage;
    this.helpTextSequences = this._globalService.helpIndex;
    this.countryList = this._globalService.countryList;
    this.provinceList = this._globalService.provinceList;
    this.stateList = this._globalService.stateList; 

    if (!this.addressFormLocalModel) {
      this.addressFormLocalModel = this._detailsService.getReactiveModel(this._fb);
    }
    // this._setCountryState(this.addressFormLocalModel.controls['country'].value,this.addressFormLocalModel);
    this.detailsChanged = 0;
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      let temp = [];
      this._updateErrorList(errorObjs);

      /* errorObjs.forEach(
         error => {
           temp.push(error);
         }
       );
       this.errorList.emit(temp);*/
    });
    this.msgList.notifyOnChanges();

  }

  private _updateErrorList(errorObjs) {
    let temp = [];
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
    }
    this.errorList.emit(temp);

  }


  ngDoCheck() {
    /*  this.isValid();
      this._syncCurrentExpandedRow();*/
    // this.processCountry()
    // this._setCountryState(event,this.addressFormLocalModel);
  }


  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);
    console.log("isFirstChange:", isFirstChange);

    // since we can't detect changes on objects, using a separate flag
    // if (changes['detailsChanged']) { // used as a change indicator for the model
    //   // console.log("the details cbange");
    //   if (this.addressFormRecord) {
    //     this._setCountryState(this.addressFormRecord.controls['country'].value, this.addressFormRecord);
    //     this.setToLocalModel();

    //   } else {
    //     this.addressFormLocalModel = AddressDetailsService.getReactiveModel(this._fb);
    //     this._setCountryState(this.addressFormLocalModel.controls['country'].value, this.addressFormLocalModel);
    //     this.addressFormLocalModel.markAsPristine();
    //   }
    // }

    if (!isFirstChange) {
      if (changes['showErrors']) {

        this.showFieldErrors = changes['showErrors'].currentValue;
        let temp = [];
        if (this.msgList) {
          this.msgList.forEach(item => {
            temp.push(item);
            // console.log(item);
          });
        }
        this.errorList.emit(temp);
      }

      if (changes['addressModel']) {
        const dataModel = changes['addressModel'].currentValue as INameAddress;
        // if (!this.addressFormLocalModel)
        //   this.addressFormLocalModel = this._detailsService.getReactiveModel(this._fb);
        // if (dataModel.country) {
        //   this.countrySelected = dataModel.country.__text;
        //   this._setCountryState(dataModel.country._id, this.addressFormLocalModel);
        // }
        this._detailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.addressFormLocalModel));
        // if (dataModel.country) {
        //   this._setCountryState(dataModel.country._id, this.addressFormLocalModel);
        // }
        this.onCountryChange();
      }
    }
  }

  // _setCountryState(countryValue, formModel) {
  //   this.provStateList = this._detailsService.setProvinceState(formModel, countryValue, this.provinceList, this.stateList);
  //   this._setPostalPattern(countryValue);
  //   // update errors manually?
  //   if (this.showFieldErrors) {
  //     this.cdr.detectChanges(); // doing our own change detection
  //   }
  // }


  onCountryChange() {
    const selectedCountryId = this.addressFormLocalModel.controls['country'].value;
    this.selectedCountrySignal.set(selectedCountryId);

    // reset provText field
    const valuesToReset = ['provText', 'postal', 'provState'];
    this._resetControlValues(valuesToReset);

    if (this.isCanadaOrUSA()) {
      // updte provState and postal fields' validator and refresh the provStateList based on country
      this.addressFormLocalModel.controls['provState'].setValidators([Validators.required]);
      this.addressFormLocalModel.controls['provState'].updateValueAndValidity();

      if (this.isCanada()) {
        this.addressFormLocalModel.controls['postal'].setValidators([Validators.required, ValidationService.canadaPostalValidator]);
        this.provStateList = this.provinceList;

        this.postalLabel = 'addressDetails.postalCode';
        this.provinceLabel = 'addressDetails.province';

      } else {
        this.addressFormLocalModel.controls['postal'].setValidators([Validators.required, ValidationService.usaPostalValidator]);
        this.provStateList = this.stateList;

        this.postalLabel = 'addressDetails.zipCode';
        this.provinceLabel = 'addressDetails.state';
      }
      this.addressFormLocalModel.controls['postal'].updateValueAndValidity();

    } else {
      // updte provState and postal fields' validator
      this.addressFormLocalModel.controls['provState'].setValidators([]);
      this.addressFormLocalModel.controls['provState'].updateValueAndValidity();

      this.addressFormLocalModel.controls['postal'].setValidators([Validators.required]);     
      this.addressFormLocalModel.controls['postal'].updateValueAndValidity();

      this.postalLabel = 'addressDetails.postalZipCode';
      this.provinceLabel = '';
    }    
    
  }


  // /**
  //  * Uses the updated reactive forms model locally
  //  */

  // setToLocalModel() {
  //   this.addressFormLocalModel = this.addressFormRecord;
  //   if (!this.addressFormLocalModel.pristine) {
  //     this.addressFormLocalModel.markAsPristine();
  //   }
  // }

  onblur() {
    // console.log('input is typed');
    // this._detailsService.mapFormModelToDataModel((<FormGroup>this.addressFormLocalModel),
    //   this.addressModel, this.countryList, this.provStateList, this.lang);
  }

  private _resetControlValues(controlNames: string[]) {
    for (let i = 0; i < controlNames.length; i++) {
      this._utilsService.resetControlsValues(this.addressFormLocalModel.controls[controlNames[i]]);
    }
  }
}

