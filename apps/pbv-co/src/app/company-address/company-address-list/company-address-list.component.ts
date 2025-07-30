import { Component, computed, EventEmitter, Input, Output, QueryList, Signal, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AddressDetailsService, INameAddress } from '@hpfb/pbv';
import { CheckboxOption, ErrorNotificationService, ErrorSummaryComponent, BaseListComponent, IRecordService, UtilsService, ICode, ENGLISH, FRENCH, RecordFormGroup, RecordDeleteService, RecordDiscardService } from '@hpfb/sdk/ui';
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
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class CompanyAddressListComponent extends BaseListComponent<AddressRecord>{
  recordService: IRecordService;

  records: string = 'addresses';
  recordInfo: string = 'addressInfo';
  popupId: string = 'addressPopup';
  discardPopupId: string = 'addressDiscardPopup';
  deletePopupId: string = 'addressDeletePopup';

  statusMessage : string = '';
  errorList;

  statusMessageSave : string = '';
  statusMessageDiscard: string = '';
  statusMessageDelete: string = '';

  focusField : string = 'companyName';
  addButton : string = 'addAddressBtn';
  private selectedAddressCompanyRoles : Signal<string[]> = this._signalService.getSelectedAddressCompanyRoles();
  allRolesSelected = computed(() => {return this.isRolesComplete(this.selectedAddressCompanyRoles());})

  companyRolesOptionList: CheckboxOption[] = []; // Store received data

  @Input() earlyVersion;
  @Input() disableForm : boolean;
  @Output() errorEmit = new EventEmitter(true);
  @ViewChildren(CompanyAddressItemComponent) itemComponents: QueryList<CompanyAddressItemComponent>;

  provinceList: ICode[] = [];

  constructor(private fb: FormBuilder,
    private _addressService: CompanyAddressService,
    private _addressDetailsService: AddressDetailsService,
    private _errorNotifService: ErrorNotificationService,
    private _companyAddressItemService: CompanyAddressItemService,
    private _globalService: GlobalService,
    private _signalService: AppSignalService,
    private _utilsService: UtilsService,
    deleteService : RecordDeleteService,
    discardService : RecordDiscardService,
    companyAddressListService: CompanyAddressListService) {
      super(fb, companyAddressListService, discardService, deleteService);
      this.recordService = this._addressService;
        this.recordFormGroup = this.fb.group({
        addresses: this.fb.array([])
      });
  }

  ngOnInit():void {
    this.provinceList = this._globalService.provinceList;
    if (this._globalService.currLanguage === ENGLISH) {
      this.statusMessageSave = this.statusMessageDelete = this.statusMessageDiscard = 'Address details record';
    } else {
      this.statusMessageSave = this.statusMessageDelete = 'des détails de l’adresse';
      this.statusMessageDiscard = 'aux détails de l’adresse'
    }
  }

  override ngAfterViewInit(): void {
    this._errorNotifService.errorSummaryChanged$.subscribe((errors => {
      this._processErrorSummaries(errors);
    }))
  }

  protected _expandInvalidRecordUponLoading() {
    this.expandAllInvalidRecords();
  }

  expandAllInvalidRecords() {
    for (let index = 0; index < this.recordFormArray.controls.length; index++) {
      const group: RecordFormGroup = this.recordFormArray.controls[index] as RecordFormGroup;
      if (!group.get('addressInfo.isRoleSelected').value || group.invalid) {
       group.controls['expandFlag'].setValue(true);
       group.markAsDirty();
       group.markAsTouched();
      }
    }
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
      companyName: outputModel.company_name,
      addressDetails: {
        address: outputModel.company_address_details.street_address,
        city: outputModel.company_address_details.city,
        provState: outputModel.company_address_details.province_lov ? outputModel.company_address_details.province_lov._id : null,
        provText: outputModel.company_address_details.province_text,
        country: outputModel.company_address_details.country ? outputModel.company_address_details.country._id : null,
        postal: outputModel.company_address_details.postal_code
      }
    })
  }

  handleRolesUpdated(updatedRoles: CheckboxOption[]) {
    this.companyRolesOptionList = updatedRoles;
  }

  /**
   * Deprecated
   * @param event
   */
  // handleRemoveRoleError(event : any) {
  //   // event: unchecked role
  //   const recordId = event.id;
  //   const role = event.role;
  //   const roleIndex = event.roleIndex;
  //   let id = null;

  //   // Check if there are any other records with the same role that's been unchecked,
  //   // If so, clear the errors

  //   // Look for other records that has the same role as the role that has been unchecked
  //   const currentRolesArray = this._signalService.getSelectedAddressCompanyRoles()();
  //   for (const item of currentRolesArray) {
  //     const idMatch = item.match(/^(\d+)/); // Extract the number (prefix)
  //     const itemRole = item.replace(/^\d+/, ''); // Extract role type

  //     if (itemRole === role && idMatch !== recordId) {
  //       id = Number(idMatch?.[1]); // Return the number as a number type
  //       break;
  //     }
  //   }

  //   // If id has been found, find FormGroup with matching recordId. Set role's errors to null
  //   if (id) {
  //     const formGroupWithId = this.recordFormArray.controls.find(
  //       (group) => group.get('recordId')?.value === id
  //     ) as FormGroup | undefined;

  //     if (formGroupWithId) {
  //       let addressRoles = formGroupWithId.get('addressInfo.addressCompanyRoles') as FormArray;
  //       const roleControl = addressRoles.at(roleIndex);
  //       if (roleControl.errors) {
  //         roleControl.setErrors(null);
  //       }
  //     }
  //   }
  // }

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

  private isRolesComplete(selectedRoles : string[]) {
    const companyRolesList = this._globalService.companyRolesList.map(role => role.id); // Required roles
    const cleanSelectedRoles = selectedRoles.map(role => role.replace(/^\d+/, '')); // Remove number prefixes
    return companyRolesList.every(role => cleanSelectedRoles.includes(role));
  }

  public hasNoRolesSelected(): boolean {
    if (!this.recordFormArray || this.recordFormArray.length === 0) {
      return false;
    }

    // Check if a role has been selected
    return this.recordFormArray.controls.some((group: FormGroup) => {
      const isRoleSelectedControl = group.get('addressInfo.isRoleSelected');
      return !isRoleSelectedControl?.value;
    });
  }

  /**
   * Override onDeleteHandled to check if there is no role selected for record -> expand the record
   *                                      record has been touched -> expand the record
   * TODO: Remove "group.get('addressInfo.isRoleSelected').value" from (group.get('addressInfo.isRoleSelected').value && !group.pristine)
   * @param event
   */
  override onDeleteHandled(event: any): void {
    if (event) {
      for (let index = 0; index < this.recordFormArray.controls.length; index++) {
        const group: RecordFormGroup = this.recordFormArray.controls[index] as RecordFormGroup;
        if (!group.get('addressInfo.isRoleSelected').value ||
              (group.get('addressInfo.isRoleSelected').value && !group.pristine)) {
                group.controls['expandFlag'].setValue(true);
        } else {
          group.controls['expandFlag'].setValue(false);
        }
      }
    }
  }

  override handleRowClick(event: any): void {
    const clickedIndex = event.index;
    const clickedRecordState = event.state;
    if (this.recordFormGroup.pristine) {
      this.recordFormArray.controls.forEach( (element: FormGroup, index: number) => {
        if (clickedIndex===index) {
          if (element.get('addressInfo.isRoleSelected').value) {
            element.controls['expandFlag'].setValue(!clickedRecordState)
          } else {
            this.openPopup();
          }
        }
    })} else {
      this.openPopup();
    }
  }

}
