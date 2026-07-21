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

  companyRolesOptionList: CheckboxOption[] = [];

  @Input() earlyVersion;
  @Input() disableForm : boolean;
  @Output() errorEmit = new EventEmitter(true);
  @ViewChildren(CompanyAddressItemComponent) itemComponents: QueryList<CompanyAddressItemComponent>;

  provinceList: ICode[] = [];

  // Flag to track if we've already initialized
  private _initialized: boolean = false;

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
    }));

    // --- CHANGE: Only create empty record on initial load ---
    setTimeout(() => {
      if (!this._initialized) {
        this.ensureAtLeastOneRecord();
        this._initialized = true;
      }
    }, 0);
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

  // Ensure at least one record exists (only called on initialization)
  private ensureAtLeastOneRecord(): void {
    if (this.recordFormArray.length === 0) {
      this.addEmptyRecord();
    }
  }

  // Create an empty record
  private addEmptyRecord(): void {
    const group = this.recordService.createRecordFormGroup(this.fb);
    group.patchValue({
      recordId: this.listService.getId()
    });
    this.recordFormArray.push(group);
    const firstFormRecord = this.recordFormArray.at(0) as FormGroup;
    firstFormRecord.controls['expandFlag'].setValue(true);

    this.recordService.setRecordsFormArrValue(this.getRecordFormArrValues());
    this.listService.setList(this.recordFormArray.controls as FormGroup[]);
  }

  // --- CHANGE: deleteRecord - allow deleting the last record ---
  override deleteRecord(event: any): void {
    // Call parent delete (this removes the record)
    super.deleteRecord(event);

    // Do NOT auto-create - allow the list to be empty
  }

  // --- CHANGE: deleteRecordConfirmation - always allow deletion ---
  override deleteRecordConfirmation(event: any): void {
    // Always allow deletion - parent will handle the popup
    super.deleteRecordConfirmation(event);
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
      manufacturer: null,
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

  private _processErrorSummaries(errSummaryEntries: { key: string, errSummaryMessage: ErrorSummaryComponent }[]): void {
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
    if (this.earlyVersion && addressModel.country._id === undefined) {
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
      if (postalCode.match(/^(?!.*[DFIOQU])[A-VXYa-vxy][0-9][A-Za-z] [0-9][A-Za-z][0-9]$/)) {
        postalCode = postalCode.replace(' ', '');
        addressModel.postal_code = postalCode;
      }
    }
  }

  private isRolesComplete(selectedRoles : string[]) {
    const companyRolesList = this._globalService.companyRolesList.map(role => role.id);
    const cleanSelectedRoles = selectedRoles.map(role => role.replace(/^\d+/, ''));
    return companyRolesList.every(role => cleanSelectedRoles.includes(role));
  }

  public hasNoRolesSelected(): boolean {
    if (!this.recordFormArray || this.recordFormArray.length === 0) {
      return false;
    }

    return this.recordFormArray.controls.some((group: FormGroup) => {
      const isRoleSelectedControl = group.get('addressInfo.isRoleSelected');
      return !isRoleSelectedControl?.value;
    });
  }

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

  override addRecord(): void {
    super.addRecord();
  }
}
