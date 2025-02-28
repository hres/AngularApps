import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {AddressDetailsService} from './address.details.service';
import { ControlMessagesComponent, LoggerService, UtilsService } from '@hpfb/sdk/ui';
import { INameAddress } from '../../models/Enrollment';

@Component({
  selector: 'lib-address-details',
  templateUrl: 'address.details.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AddressDetailsComponent implements OnInit {

  public addressFormLocalModel: FormGroup;
  @Input('group') public addressFormRecord: FormGroup;
  @Input() public addressDetailsModel;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() countryList: Array<any>;
  @Input() provinceList: Array<any>;
  @Input() stateList: Array<any>;
  @Input() addressModel: INameAddress;
  @Input() lang: string;
  @Input() helpTextSequences;
  @Input() addrType: string;    // optional, used to set unique html id if there are different types of address, eg. companyAddress, contactAddress etc
  @Input() appName: string;    // optional, the subform could have different fields or behaviour for different applications

  @Output() errorList = new EventEmitter(true);

  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public countries: Array<any> = [];
  public provinces: Array<any> = [];
  public provStateList: Array<any> = [];
  public showProvText: boolean = true;
  public provinceLabel: string = 'addressDetails.province';
  public postalPattern: RegExp = null;
  public postalLabel: string = 'postal.canada';
  public postalCode = false;
  public zipCode = false;

  public showFieldErrors = false;

  constructor(private cdr: ChangeDetectorRef, private _addressDetailsService: AddressDetailsService, private _utilsService: UtilsService, private _loggerService: LoggerService) {
    this.showFieldErrors = false;
    this.showErrors = false;
  }

  ngOnInit() {

    if (!this.addressFormLocalModel) {
      this.addressFormLocalModel = this._addressDetailsService.getReactiveModel();
    }
    // init the subform's data
    this._addressDetailsService.mapDataModelToFormModel(this.addressModel, this.addressFormLocalModel);
    this._setCountryState(this.addressFormLocalModel);
    this.detailsChanged = 0;
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      this._updateErrorList(errorObjs);
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
    // this.onCountryChange()
    // this._setCountryState(event,this.addressFormLocalModel);
  }

  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);

    // Ignore first trigger of ngOnChanges
    if (!isFirstChange) {
      // since we can't detect changes on objects, using a separate flag
      if (changes['detailsChanged']) { // used as a change indicator for the model
        // this._loggerService.log('address.detail', "the details cbange");
        if (this.addressFormRecord) {
          this._setCountryState(this.addressFormRecord);
          // this.setToLocalModel();

        } else {
          this.addressFormLocalModel = this._addressDetailsService.getReactiveModel();
          this._setCountryState(this.addressFormLocalModel);
          this.addressFormLocalModel.markAsPristine();
        }
      }
      if (changes['showErrors']) {

        this.showFieldErrors = changes['showErrors'].currentValue;
        let temp = [];
        if (this.msgList) {
          this.msgList.forEach(item => {
            temp.push(item);
            // this._loggerService.log('address.detail', item);
          });
        }
        this.errorList.emit(temp);
      }
      if (changes['countryList']) {
        this.countries = changes['countryList'].currentValue;
      }
      if (changes['addressFormLocalModel']) {
        this._loggerService.log('address.detail', '**********the ADDRESS details changed');
        this.addressFormRecord = this.addressFormLocalModel;
      }
      if (changes['addressModel']) {
        const dataModel = changes['addressModel'].currentValue;
        this._addressDetailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.addressFormLocalModel));
        if (this.addressFormLocalModel.controls['country'] &&
            this.addressFormLocalModel.controls['country'].value) {
          this._setCountryState(this.addressFormLocalModel);
        }
      }
    }
  }

  
  _setCountryState(formModel: FormGroup) {
    const countryControl = this.addressFormLocalModel.get('country');
    const countryValue: string = countryControl?.value;

    // this._loggerService.log('address.detail', '_setCountryState', countryValue);

    let tempProvStateList = this._addressDetailsService.setProvinceState(
      formModel, countryValue, this.provinceList, this.stateList);
    // this._loggerService.log('address.detail', tempProvStateList);

    if ( tempProvStateList !== null) {
      this.provStateList = tempProvStateList;
      this.showProvText = false;
    } else {
      this.showProvText = true;
    }
    this._setPostalPattern(countryValue);
    // update errors manually?
    if (this.showFieldErrors) {
  //     this.cdr.detectChanges(); // doing our own change detection
    }
  }

  onCountryChange(event) {
    // this._loggerService.log('address.detail', "onCountryChange");
    this._setCountryState(this.addressFormLocalModel);
    this._saveData();
  }

  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.addressFormLocalModel = this.addressFormRecord;
    if (!this.addressFormLocalModel.pristine) {
      this.addressFormLocalModel.markAsPristine();
    }
  }

  // note ng-select expects an array of values even with a single select
  selected(rec) {

    // this.addressFormLocalModel.controls['country.setValue([rec.id]);
    // this.addressFormLocalModel.controls['country.setValue([rec]);
  }

  removed(rec) {
    this._loggerService.log('address.detail', rec);
    // this.addressFormLocalModel.controls['country.setValue(null)
  }

  typed(rec) {
    // this._loggerService.log('address.detail', 'country is typed');
    let content = rec.toString().replace(/[\x00-\x7F]/g, '', '');
    if (content && this.existsInList(content)) {
      this.addressFormLocalModel.controls['country'].setValue([content]);
      this._saveData();
    }
  }

  tempCountryOnblur(rec) {
    // this._loggerService.log('address.detail', 'country is tempCountryOnblur');
    this.typed(rec)
  }

  onblur() {
    // this._loggerService.log('address.detail', 'input is typed');
    this._saveData();
  }

  private _saveData() {
    this._addressDetailsService.mapFormModelToDataModel((<FormGroup>this.addressFormLocalModel),
      this.addressModel, this.countryList, this.provStateList, this.lang);
  }

  existsInList(rec) {
    for (let country of this.countries) {
      if (country.id === rec) {
        return true;
      }
    }
    return false;
  }

  /* _showProvText(value):boolean{
     this._loggerService.log('address.detail', value)
     this._addressDetailsService.setProvinceState(this.addressFormLocalModel, value);
     if(Address_addressDetailsService.isCanadaOrUSA(value)){
       this._loggerService.log('address.detail', "hide province text")
       this.showProvText=false;
       return false
     }
     this._loggerService.log('address.detail', "show province text")
     this.showProvText=true;
     return true;
   }*/

  private _setPostalPattern(countryValue) {
    //  this._loggerService.log('address.detail', "starting the postal Pattern");
    // this.postalPattern=
    if (this._utilsService.isCanada(countryValue)) {

      this.postalLabel = 'postal.canada';
      this.provinceLabel = 'addressDetails.province';
      this.postalPattern = /^(?!.*[DFIOQU])[A-VXYa-vxy][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/;
      this.postalCode = true;
      this.zipCode = false;
    } else if (this._utilsService.isUsa(countryValue)) {
      this.postalPattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
      this.postalLabel = 'postal.usa';
      //  this._loggerService.log('address.detail', "This is the postal label"+this.postalLabel);
      this.provinceLabel = 'addressDetails.state';
      this.postalCode = false;
      this.zipCode = true;
    } else {
      this.postalPattern = null;
      this.postalLabel = 'addressDetails.postalCodeZip';
      this.postalCode = false;
      this.zipCode = false;
    }
  }

}

