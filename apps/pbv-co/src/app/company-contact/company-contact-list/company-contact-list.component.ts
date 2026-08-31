import { Component, computed, Signal, EventEmitter, Input, output, Output, SimpleChanges, ViewEncapsulation, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Form} from '@angular/forms';
import { CheckboxOption, ControlMessagesComponent, ConverterService, ENGLISH, ErrorNotificationService, ErrorSummaryComponent, FRENCH, ICode, RecordDeleteService, RecordDiscardService, UtilsService } from '@hpfb/sdk/ui';
import { ContactRecord } from '../../models/Company';
import { BaseListComponent } from '@hpfb/sdk/ui';
import { CompanyContactService } from '../company-contact.service';
import { ERR_TYPE_LEAST_ONE_REC, ErrorSummaryObject, getEmptyErrorSummaryObj } from '@hpfb/sdk/ui';
import { IRecordService } from '@hpfb/sdk/ui';
import { ContactDetailsService, IContact } from '@hpfb/pbv';
import { AppSignalService } from '../../signal/app-signal.service';
import { GlobalService } from '../../global/global.service';
import { FormDataLoaderService } from '../../container/form-data-loader.service';
import { CompanyContactItemService } from '../company-contact-item/company-contact-item.service';
import { CompanyContactListService } from './company-contact-list.service';
import { CompanyContactItemComponent } from '../company-contact-item/company-contact-item.component';
import { RecordFormGroup } from '../../../../../../projects/hpfb/sdk/ui';

@Component({
  selector: 'app-company-contact-list',
  templateUrl: './company-contact-list.component.html',
  styleUrl: './company-contact-list.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class CompanyContactListComponent extends BaseListComponent<ContactRecord>{
  recordService: IRecordService;

  records: string = 'contacts';
  recordInfo: string = 'companyInfo';
  popupId: string = 'contactPopup';
  discardPopupId: string = 'contactDiscardPopup';
  deletePopupId: string = 'contactDeletePopup';

  statusMessage : string = '';
  errorList;

  statusMessageSave : string = '';
  statusMessageDiscard: string = '';
  statusMessageDelete: string = '';

  focusField : string = 'firstName'
  addButton : string = 'addContactBtn'

  companyRolesOptionList: CheckboxOption[] = []; // Store received data

  private selectedContactCompanyRoles : Signal<string[]> = this._signalService.getSelectedContactCompanyRoles();
  allRolesSelected = computed(() => {return this.isRolesComplete(this.selectedContactCompanyRoles());})

  languageList: ICode[] = [];

  @Input() disableForm : boolean;
  @Input() earlyVersion;
  @Output() errorEmit = new EventEmitter(true);
  @ViewChildren(CompanyContactItemComponent) itemComponents: QueryList<CompanyContactItemComponent>;


  constructor(private fb: FormBuilder,
              private _contactService: CompanyContactService,
              private _contactDetailsService: ContactDetailsService,
              private _errorNotifService: ErrorNotificationService,
              private _companyContactItemService: CompanyContactItemService,
              private _signalService: AppSignalService,
              private _utilsService: UtilsService,
              private _globalService: GlobalService,
              deleteService : RecordDeleteService,
              discardService : RecordDiscardService,
              companyContactListService: CompanyContactListService) {
    super(fb, companyContactListService, discardService, deleteService);
    this.recordService = this._contactService;
    this.recordFormGroup = this.fb.group({
      contacts: this.fb.array([])
    });
  }

  ngOnInit():void {
    this.languageList = this._globalService.languageList;
    if (this._globalService.currLanguage === ENGLISH) {
      this.statusMessageSave = this.statusMessageDelete = this.statusMessageDiscard = 'Comapny representative details records';
    } else {
      this.statusMessageSave = this.statusMessageDelete = 'du représentant de la compagnie';
      this.statusMessageDiscard = 'au représentant de la compagnie'
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
      if (!group.get('companyInfo.isRoleSelected') || group.invalid) {
       group.controls['expandFlag'].setValue(true);
       group.markAsDirty();
       group.markAsTouched();
      }
    }
  }

  protected _patchRecordInfoValue(form, outputModel: ContactRecord) {
    if (this.companyRolesOptionList) {
      this._companyContactItemService.mapDataModelToFormModel(outputModel, form.controls['companyInfo'], this.companyRolesOptionList, form.controls['id'].value)
    }
    const contactDetailsFormGroup = form.controls['companyInfo'].controls['contactDetails'];
    this._mapEarlyVersionLanguageField(outputModel.company_contact_details);
    this._mapEarlyVersionPhoneFaxField(outputModel.company_contact_details);
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

  /**
   * Deprecated
   * @param
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
  //   const currentRolesArray = this._signalService.getSelectedContactCompanyRoles()();
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
  //       let contactRoles = formGroupWithId.get('companyInfo.companyRoles') as FormArray;
  //       const roleControl = contactRoles.at(roleIndex);
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

  private _mapEarlyVersionLanguageField(contactModel: IContact) {
    if (this.earlyVersion && contactModel.language_correspondance._id === undefined) {
      const langEnglish = this._utilsService.findAndTranslateCode(this.languageList, ENGLISH, String(contactModel.language_correspondance));
      const langFrench = this._utilsService.findAndTranslateCode(this.languageList, FRENCH, String(contactModel.language_correspondance));

      const languageModel = this._utilsService.createIIdTextLabelObj(String(contactModel.language_correspondance), langEnglish, langFrench, this._globalService.currLanguage === ENGLISH ? langEnglish : langFrench);
      contactModel.language_correspondance = languageModel;
    }
  }

  private _mapEarlyVersionPhoneFaxField(contactModel: IContact) {
    if (this.earlyVersion) {
      contactModel.phone_num = contactModel.phone_num.replace(/[^0-9]*/g, '');
      contactModel.fax_num = contactModel.fax_num.replace(/[^0-9]*/g, '');
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

    return this.recordFormArray.controls.some((group: FormGroup) => {
      const isRoleSelectedControl = group.get('companyInfo.isRoleSelected');
      return !isRoleSelectedControl?.value;
    });
  }

  override onDeleteHandled(event: any): void {
    if (event) {
      for (let index = 0; index < this.recordFormArray.controls.length; index++) {
        const group: RecordFormGroup = this.recordFormArray.controls[index] as RecordFormGroup;
        if (!group.get('companyInfo.isRoleSelected').value ||
              (group.get('companyInfo.isRoleSelected').value && !group.pristine)) {
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
          if (element.get('companyInfo.isRoleSelected').value) {
            element.controls['expandFlag'].setValue(!clickedRecordState)
          } else {
            this.openPopup();
          }
        }
    })} else {
      this.openPopup();
    }
  }



  // ✅ ADD THIS METHOD
  public enableContactsForAmend(): void {
    this.recordFormArray.controls.forEach((group: FormGroup) => {
      const hasId = group.get('id')?.value;
      if (hasId) {  // Only existing contacts (from XML)
        group.enable();
        group.controls['expandFlag'].setValue(false);
      }
    });
    this.disableForm = false;
  }
}
