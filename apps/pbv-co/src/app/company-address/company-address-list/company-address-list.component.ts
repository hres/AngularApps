import { Component, EventEmitter, Input, output, Output, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AddressDetailsService, INameAddress } from '@hpfb/pbv';
import { CheckboxOption, ErrorNotificationService, ErrorSummaryComponent, BaseListComponent, IRecordService, UtilsService, ICode, ENGLISH, FRENCH } from '@hpfb/sdk/ui';
import { FormDataLoaderService } from '../../container/form-data-loader.service';
import { GlobalService } from '../../global/global.service';
import { AddressRecord } from '../../models/Company';
import { AppSignalService } from '../../signal/app-signal.service';
import { CompanyAddressItemComponent } from '../company-address-item/company-address-item.component';
import { CompanyAddressItemService } from '../company-address-item/company-address-item.service';
import { CompanyAddressService } from '../company-address.service';
import { CompanyAddressListService } from './company-address-list.service';

@Component({
  selector: 'app-company-address-list',
  templateUrl: './company-address-list.component.html',
  styleUrl: './company-address-list.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CompanyAddressListComponent extends BaseListComponent<AddressRecord>{
  recordService: IRecordService;

  records: string = 'addresses';
  recordInfo: string = 'addressInfo';
  popupId: string = 'addressPopup';
  statusMessage : string = '';
  errorList;
  statusMessageSubject : string = '';
  focusField : string = 'companyName'
  addButton : string = 'addAddressBtn'

  companyRolesOptionList: CheckboxOption[] = []; // Store received data

  @Input() earlyVersion;
  @Input() disableForm : boolean;
  @Output() errorEmit = new EventEmitter(true);

  provinceList: ICode[] = [];

  constructor(private fb: FormBuilder, 
    private _addressService: CompanyAddressService,
    private _addressDetailsService: AddressDetailsService,
    private _errorNotifService: ErrorNotificationService,
    private _companyAddressItemService: CompanyAddressItemService,
    private _globalService: GlobalService,
    private _signalService: AppSignalService,
    private _utilsService: UtilsService,
    companyAddressListService: CompanyAddressListService) {
      super(fb, companyAddressListService);
      this.recordService = this._addressService;
        this.recordFormGroup = this.fb.group({
        addresses: this.fb.array([])
      });
  }

  ngOnInit():void {
    this.provinceList = this._globalService.provinceList;
    this._globalService.currLanguage === ENGLISH ? this.statusMessageSubject = 'Address details' : this.statusMessageSubject = 'coordonnées';
  }

  override ngAfterViewInit(): void {
    this._errorNotifService.errorSummaryChanged$.subscribe((errors => {
      this._processErrorSummaries(errors);
    }))
  }

  protected _expandInvalidRecordUponLoading() {
    this._expandNextInvalidRecord();
  }

  protected _patchRecordInfoValue(form, outputModel: AddressRecord) {
    if (this.companyRolesOptionList) {
      this._companyAddressItemService.mapDataModelToFormModel(outputModel, form.controls['addressInfo'], this.companyRolesOptionList, form.controls['id'].value)
    }
    const addressDetailsFormGroup = form.controls['addressInfo'].controls['addressDetails'];
    this._mapEarlyVersionCountryProvinceCodesAndPostal(outputModel.company_address_details);
    this._addressDetailsService.mapDataModelToFormModel(outputModel.company_address_details, addressDetailsFormGroup);
  }

  protected _patchLastSavedStateValue(lastSavedStateFormControl: any, outputModel: AddressRecord) {
    const [selectedRoles, companyRoles] = this._companyAddressItemService.getSelectedCompanyRolesFromOutputModel(outputModel);
    lastSavedStateFormControl.patchValue({
      manufacturer: null, // Patch companyRoles (array of booleans, indeces corresponds to order of roles) and selectedCompanyRoles (array of selected roles' ids)
      billing: null,
      mailing: null,
      selectedAddressCompanyRoles: selectedRoles,
      addressCompanyRoles: companyRoles,
      addressDetails: {
        address: outputModel.company_address_details.street_address,
        city: outputModel.company_address_details.city,
        provState: outputModel.company_address_details.province_lov ? outputModel.company_address_details.province_lov._id : null,
        provText: outputModel.company_address_details.province_text,
        country: outputModel.company_address_details.country._id,
        postal: outputModel.company_address_details.postal_code
      }
    })
  }

  handleRolesUpdated(updatedRoles: CheckboxOption[]) {
    this.companyRolesOptionList = updatedRoles;
  }

  handleRemoveRoleError(event : any) {
    // event: unchecked role
    const recordId = event.id;
    const role = event.role;
    const roleIndex = event.roleIndex;
    let id = null;

    // Check if there are any other records with the same role that's been unchecked,
    // If so, clear the errors

    // Look for other records that has the same role as the role that has been unchecked
    const currentRolesArray = this._signalService.getSelectedAddressCompanyRoles()();
    for (const item of currentRolesArray) {
      const idMatch = item.match(/^(\d+)/); // Extract the number (prefix)
      const itemRole = item.replace(/^\d+/, ''); // Extract role type
      
      if (itemRole === role && idMatch !== recordId) {
        id = Number(idMatch?.[1]); // Return the number as a number type
        break;
      }
    }

    // If id has been found, find FormGroup with matching recordId. Set role's errors to null
    if (id) {
      const formGroupWithId = this.recordFormArray.controls.find(
        (group) => group.get('recordId')?.value === id
      ) as FormGroup | undefined;
        
      if (formGroupWithId) {
        let addressRoles = formGroupWithId.get('addressInfo.addressCompanyRoles') as FormArray;
        const roleControl = addressRoles.at(roleIndex);
        if (roleControl.errors) {
          roleControl.setErrors(null);
        }
      }
    }
  }

  private _processErrorSummaries(errSummaryEntries: { key: string, errSummaryMessage: ErrorSummaryComponent }[]): void {
    // console.log('...._processErrorSummaries:', errSummaryEntries);
    // get the first entry where the errSummaryMessage property is not empty 
    // as we only need one summary entry of this list section if there is any to be bubbled up to the top level error summary section
    const filteredErrSummaryEntry = errSummaryEntries.find(summary => summary.errSummaryMessage && summary.errSummaryMessage.componentId.startsWith("addressListTable"));
    if (filteredErrSummaryEntry) {
      this.errorSummaryChild = filteredErrSummaryEntry.errSummaryMessage;
    } else {
      this.errorSummaryChild = null;
    }
    this.emitErrors();
  } 

  protected emitErrors(): void {
    let errorsToEmit = [];
    if (this.errorSummaryChild) {
      errorsToEmit.push(this.errorSummaryChild);
    }
    this.errorList = errorsToEmit;
    this.errorEmit.emit(errorsToEmit);
  }

  // An interceptor function for backwards compatibility.
  private _mapEarlyVersionCountryProvinceCodesAndPostal(addressModel : INameAddress) {
    this._mapCountryCodes(addressModel);
    this._mapProvinceAndCountryNoIdValue(addressModel);
    this._mapPostalCode(addressModel);
  }

  private _mapCountryCodes(addressModel: INameAddress) {
    if (this.earlyVersion && addressModel.country._id !='' && addressModel.country._id !== undefined){
      let newCountry = this._globalService.countryIdMappingList.find(
        (item) => item.id === addressModel.country._id);
      if (newCountry != null){
        addressModel.country._id = newCountry.newid;
      }
    }
  }

  private _mapProvinceAndCountryNoIdValue(addressModel: INameAddress) {
    if (this.earlyVersion && addressModel.country._id === undefined) { // Early version that doesn't have country id - take value as ID
      if (addressModel.country._id === undefined) {
        let newCountry = this._globalService.countryIdMappingList.find(
          (item) => item.id === addressModel.country.__text);
        if (newCountry != null){
          addressModel.country._id = newCountry.newid;
        }
      }
      
      if (addressModel.province_lov._id === undefined) {
        const provinceEnglish = this._utilsService.findAndTranslateCode(this.provinceList, ENGLISH, String(addressModel.province_lov));
        const provinceFrench = this._utilsService.findAndTranslateCode(this.provinceList, FRENCH, String(addressModel.province_lov));

        const provinceModel = this._utilsService.createIIdTextLabelObj(String(addressModel.province_lov), provinceEnglish, provinceFrench, this._globalService.currLanguage === ENGLISH ? provinceEnglish : provinceFrench);
        addressModel.province_lov = provinceModel;
      }
    }
  }

  private _mapPostalCode(addressModel: INameAddress) {
    if (this.earlyVersion && addressModel.postal_code) {
      let postalCode = addressModel.postal_code;
      // Check if postal code matches X#X #X# (space in between)
      if (postalCode.match(/^(?!.*[DFIOQU])[A-VXYa-vxy][0-9][A-Za-z] [0-9][A-Za-z][0-9]$/)) {
        postalCode = postalCode.replace(' ', '');
        addressModel.postal_code = postalCode;
      }
    }
  }
} 
