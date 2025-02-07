import { Component, EventEmitter, output, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AddressDetailsService } from '@hpfb/pbv';
import { CheckboxOption, ErrorNotificationService, ErrorSummaryComponent } from '@hpfb/sdk/ui';
import { BaseListService } from '../../../../../../projects/hpfb/sdk/ui/record-list/base.list.service';
import { FormDataLoaderService } from '../../container/form-data-loader.service';
import { GlobalService } from '../../global/global.service';
import { AddressRecord } from '../../models/Company';
import { BaseListComponent } from '../../record-base/base.list.component';
import { IRecordService } from '../../record-base/record.service.interface';
import { AppSignalService } from '../../signal/app-signal.service';
import { CompanyAddressItemService } from '../company-address-item/company-address-item.service';
import { CompanyAddressService } from '../company-address.service';
import { CompanyAddressListService } from './company-address-list.service';

@Component({
  selector: 'app-company-address-list',
  templateUrl: './company-address-list.component.html',
  styleUrl: './company-address-list.component.css',
})
export class CompanyAddressListComponent extends BaseListComponent<AddressRecord>{
  recordService: IRecordService;

  records: string = 'addresses';
  recordInfo: string = 'addressInfo';
  popupId: string = 'addressPopup';
  statusMessage : string = '';

  companyRolesOptionList: CheckboxOption[] = []; // Store received data

  @Output() errorList = new EventEmitter(true);

  constructor(private fb: FormBuilder, 
    private _addressService: CompanyAddressService,
    private _addressDetailsService: AddressDetailsService,
    private _errorNotifService: ErrorNotificationService,
    private _companyAddressItemService: CompanyAddressItemService,
    companyAddressListService: CompanyAddressListService) {
      super(fb, companyAddressListService);
      this.recordService = this._addressService;
        this.recordFormGroup = this.fb.group({
        addresses: this.fb.array([])
      });
  }

  ngOnInit():void {

  }

  override ngAfterViewInit(): void {
    this._errorNotifService.errorSummaryChanged$.subscribe((errors => {
      this._processErrorSummaries(errors);
    }))
  }

  protected _patchRecordInfoValue(form, outputModel: AddressRecord) {
    if (this.companyRolesOptionList) {
      this._companyAddressItemService.mapDataModelToFormModel(outputModel, form.controls['addressInfo'], this.companyRolesOptionList)
    }
    const addressDetailsFormGroup = form.controls['addressInfo'].controls['addressDetails'];
    this._addressDetailsService.mapDataModelToFormModel(outputModel.company_address_details, addressDetailsFormGroup);
  }

  protected _patchLastSavedStateValue(lastSavedStateFormControl: any, outputModel: AddressRecord) {
    lastSavedStateFormControl.patchValue({
      manufacturer: null, // Patch companyRoles (array of booleans, indeces corresponds to order of roles) and selectedCompanyRoles (array of selected roles' ids)
      billing: null,
      mailing: null,
      selectedCompanyRoles: "",
      companyRoles: [],
      addressDetails: {
        address: outputModel.company_address_details.street_address,
        city: outputModel.company_address_details.city,
        provState: outputModel.company_address_details.province_lov,
        provText: outputModel.company_address_details.province_text,
        country: outputModel.company_address_details.country,
        postal: outputModel.company_address_details.postal_code
      }
    })
  }

  handleRolesUpdated(updatedRoles: CheckboxOption[]) {
    this.companyRolesOptionList = updatedRoles;
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
    this.errorList.emit(errorsToEmit);
  }
} 
