import { Component, computed, Signal, EventEmitter, Input, output, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray} from '@angular/forms';
import { CheckboxOption, ControlMessagesComponent, ErrorNotificationService, ErrorSummaryComponent, ICode } from '@hpfb/sdk/ui';
import { ContactRecord } from '../../models/Company';
import { BaseListComponent } from '../../record-base/base.list.component';
import { ListService } from '../../record-base/list.service';
import { CompanyContactService } from '../company-contact.service';
import { ERR_TYPE_LEAST_ONE_REC, ErrorSummaryObject, getEmptyErrorSummaryObj } from '@hpfb/sdk/ui';
import { IRecordService } from '../../record-base/record.service.interface';
import { ContactDetailsService } from '@hpfb/pbv';
import { AppSignalService } from '../../signal/app-signal.service';
import { GlobalService } from '../../global/global.service';
import { FormDataLoaderService } from '../../container/form-data-loader.service';
import { CompanyContactItemService } from '../company-contact-item/company-contact-item.service';

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

  companyRolesOptionList: CheckboxOption[] = []; // Store received data

  @Output() errorList = new EventEmitter(true);

  // Computed signal is used to determine if a role is not selected across the list 
  // of contact records. 
  private selectedCompanyRoles : Signal<string[]> = this._signalService.getSelectedCompanyRoles();
  isRoleMissing: Signal<boolean> = computed(() => 
  {
    const companyRolesList = this._globalService.companyRolesList;
    const selectedRoles = this.selectedCompanyRoles(); // Get the current value of selected roles
    const requiredRoles = companyRolesList.map((role) => role.id); // Extract required role codes
    return requiredRoles.some((role) => !selectedRoles.includes(role)); // Check if any required role is missing
  });

  constructor(private fb: FormBuilder, 
              private _contactService: CompanyContactService,
              private _contactDetailsService: ContactDetailsService,
              private _errorNotifService: ErrorNotificationService,
              private _signalService: AppSignalService,
              private _globalService: GlobalService,
              private _formDataLoaderService: FormDataLoaderService,
              private _companyContactItemService: CompanyContactItemService) {
    super(fb);
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
      console.log("contact list: ", this.companyRolesOptionList, form);
      this._companyContactItemService.mapDataModelToFormModel(outputModel, form.controls['companyInfo'], this.companyRolesOptionList)
    }
    const contactDetailsFormGroup = form.controls['companyInfo'].controls['contactDetails'];
    this._contactDetailsService.mapDataModelToFormModel(outputModel.company_contact_details, contactDetailsFormGroup);
  }

  protected _patchLastSavedStateValue(lastSavedStateFormControl, outputModel: ContactRecord) {
    lastSavedStateFormControl.patchValue({
      manufacturer: null,
      billing: null,
      mailing: null,
      selectedCompanyRoles: "",
      companyRoles: [],
      contactDetails: {
        firstName: outputModel.company_contact_details.given_name,
        initials: outputModel.company_contact_details.initials,
        lastName: outputModel.company_contact_details.surname,
        language: outputModel.company_contact_details.language_correspondance._id,
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
    const filteredErrSummaryEntry = errSummaryEntries.find(summary => summary.errSummaryMessage && !summary.errSummaryMessage.componentId.startsWith("deviceListTable"));
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
    
    if (this.isRoleMissing) {
      const errObj = this._makeMissingRoleError(); // Make an error summ object for missing role.
      console.log("co role is missing: ", errObj) 
      errorsToEmit.push(errObj);
    }

    this.errorList.emit(errorsToEmit);
  }

  /**
   * A method to make an error summary object for "role is misisng" err. 
   * A custom validator in the Form Array, contacts, is initialized before the service injections.
   * Company role list is not fetched when validator is called -> would need an asynch validator...?
   * For now, a computed signal is used when a role has not been selected. The logic to determine if a role is missing
   * requires the list of company roles from the Global Service. Global Service does not load before custom
   * validator, therefore signals + method ot make errobj are used.
   */
  private _makeMissingRoleError() : ErrorSummaryObject{
    let oerr : ErrorSummaryObject = null;

    oerr = getEmptyErrorSummaryObj();
    oerr.index = 0;
    oerr.tableId = 'contactListTable';
    oerr.type = ERR_TYPE_LEAST_ONE_REC;
    oerr.label = 'error.msg.contactRolesMissing';
  
    return oerr;
  }

}
