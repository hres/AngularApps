import { Component, computed, Signal, EventEmitter, Input, output, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray} from '@angular/forms';
import { CheckboxOption, ControlMessagesComponent, ConverterService, ErrorNotificationService, ErrorSummaryComponent, ICode } from '@hpfb/sdk/ui';
import { ContactRecord } from '../../models/Company';
import { BaseListComponent } from '../../record-base/base.list.component';
import { CompanyContactService } from '../company-contact.service';
import { ERR_TYPE_LEAST_ONE_REC, ErrorSummaryObject, getEmptyErrorSummaryObj } from '@hpfb/sdk/ui';
import { IRecordService } from '../../record-base/record.service.interface';
import { ContactDetailsService } from '@hpfb/pbv';
import { AppSignalService } from '../../signal/app-signal.service';
import { GlobalService } from '../../global/global.service';
import { FormDataLoaderService } from '../../container/form-data-loader.service';
import { CompanyContactItemService } from '../company-contact-item/company-contact-item.service';
import { CompanyContactListService } from './company-contact-list.service';

@Component({
  selector: 'app-company-contact-list',
  templateUrl: './company-contact-list.component.html',
  styleUrl: './company-contact-list.component.css'
})
export class CompanyContactListComponent extends BaseListComponent<ContactRecord>{
  recordService: IRecordService;

  records: string = 'contacts';
  recordInfo: string = 'companyInfo';
  popupId: string = 'contactPopup';
  statusMessage : string = '';
  errorList;

  companyRolesOptionList: CheckboxOption[] = []; // Store received data

  @Output() errorEmit = new EventEmitter(true);

  constructor(private fb: FormBuilder, 
              private _contactService: CompanyContactService,
              private _contactDetailsService: ContactDetailsService,
              private _errorNotifService: ErrorNotificationService,
              private _companyContactItemService: CompanyContactItemService,
              companyContactListService: CompanyContactListService) {
    super(fb, companyContactListService);
    this.recordService = this._contactService;
    this.recordFormGroup = this.fb.group({
      contacts: this.fb.array([])
    });
  }

  ngOnInit():void {

  }

  override ngAfterViewInit(): void {
    this._errorNotifService.errorSummaryChanged$.subscribe((errors => {
      this._processErrorSummaries(errors);
    }))
  }

  protected _patchRecordInfoValue(form, outputModel: ContactRecord) {
    if (this.companyRolesOptionList) {
      this._companyContactItemService.mapDataModelToFormModel(outputModel, form.controls['companyInfo'], this.companyRolesOptionList, form.controls['id'].value)
    }
    const contactDetailsFormGroup = form.controls['companyInfo'].controls['contactDetails'];
    this._contactDetailsService.mapDataModelToFormModel(outputModel.company_contact_details, contactDetailsFormGroup);
  }

  protected _patchLastSavedStateValue(lastSavedStateFormControl, outputModel: ContactRecord) {
    const [selectedRoles, companyRoles] = this._companyContactItemService.getSelectedCompanyRolesFromOutputModel(outputModel);
    lastSavedStateFormControl.patchValue({
      manufacturer: null, // Patch companyRoles (array of booleans, indeces corresponds to order of roles) and selectedCompanyRoles (array of selected roles' ids)
      billing: null,
      mailing: null,
      selectedCompanyRoles: selectedRoles,
      companyRoles: companyRoles,
      contactDetails: {
        firstName: outputModel.company_contact_details.given_name,
        initials: outputModel.company_contact_details.initials,
        lastName: outputModel.company_contact_details.surname,
        language: outputModel.company_contact_details.language_correspondance ?  outputModel.company_contact_details.language_correspondance._id : null,
        jobTitle: outputModel.company_contact_details.job_title,
        faxNumber: outputModel.company_contact_details.fax_num,
        phoneNumber: outputModel.company_contact_details.phone_num,
        phoneExtension: outputModel.company_contact_details.phone_ext,
        email: outputModel.company_contact_details.email
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
    const filteredErrSummaryEntry = errSummaryEntries.find(summary => summary.errSummaryMessage && summary.errSummaryMessage.componentId.startsWith("contactListTable"));
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

}
