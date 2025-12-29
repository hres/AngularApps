import {
  Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges, ViewChildren, QueryList, EventEmitter, Output,
  AfterViewInit, DoCheck, ViewEncapsulation
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CompanyContactRecordComponent } from '../company-contact-record/company-contact-record.component';
import { CompanyContactRecordService } from '../company-contact-record/company-contact-record.service';
import { ContactListService } from './contact-list.service';
import { TranslateService } from '@ngx-translate/core';
import { ContactStatus } from '../../app.constants';
import { Subscription } from 'rxjs';
import { ErrorSummaryComponent, ICode, ErrorNotificationService, ErrorSummaryObject, getEmptyErrorSummaryObj, ERR_TYPE_LEAST_ONE_REC, UtilsService, BaseListComponent } from '@hpfb/sdk/ui';
import { Contact } from '../../models/Enrollment';
import { ContactListBaseComponent } from './contact.list.base.component';
import { ContactDetailsService } from '../contact.details/contact.details.service';
import { AccordionComponent } from '@hpfb/sdk/ui';


@Component({
  selector: 'app-contact-list',
  templateUrl: './contact.list.component.html',
  styleUrls: ['./contact.list.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class ContactListComponent extends ContactListBaseComponent implements OnInit, OnChanges, AfterViewInit {
  recModel: FormGroup;
  updatedContactDetailsForm: FormGroup;
  @Input() public contactModel: Contact[] = [];
  @Input() public saveContact;
  @Input() public showErrors: boolean;
  @Input() public loadFileIndicator;
  @Input() public isInternal: boolean;
  @Input() languageList: ICode[];
  @Input() contactStatusList: ICode[];
  @Input() public xmlStatus;
  @Input() lang;
  @Input() helpTextSequences;
  @Input() disableForm: boolean;

  @Output() public errors = new EventEmitter();
  @Output() public contactsUpdated = new EventEmitter();

  @ViewChild(CompanyContactRecordComponent, { static: true }) companyContactChild: CompanyContactRecordComponent;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChild(AccordionComponent) accordionChild: AccordionComponent;

  private errorSummaryChild = null;
  public contactListForm: FormGroup;
  public errorList = [];

  private contactModelChangesSubscription: Subscription;

  popupId = 'contactPopup';
  statusMessage: string = '';
  contactHeading: string = '';
  popupTrigger: HTMLElement = null;
  rowIndexToRefocus: number;

  saveRecordPopupID: string = "saveRecordPopupID";
  setReviseStatusPopupID: string = "setReviseStatusPopupID";
  setRemoveStatusPopupID: string = "setRemoveStatusPopupID";
  setActiveStatusPopupID: string = "setActiveStatusPopupID";
  discardChangePopupID: string = "discardChangePopupID";
  discardRecordPopupID: string = "discardRecordPopupID";
  removeContactPopupID: string = "removeContactPopupID";
  saveToDraftXMLPopupID: string = "saveToDraftXMLPopupID";
  private contactId: number;
  contactStatus: any;
  discardRecordHeading: string;
  discardChangeHeading: string;
  setReviseStatusHeading: string;
  setRemoveStatusHeading: string;
  removeContactHeading: string;
  setActiveStatusHeading: string;
  saveToDraftXMLHeading: string;

  constructor(private _fb: FormBuilder, private translate: TranslateService, private _utilsService: UtilsService,
    private _listService: ContactListService, private _recordService: CompanyContactRecordService, private _errorNotificationService: ErrorNotificationService, private _detailsService: ContactDetailsService) {
    super();
    this.contactListForm = this._listService.getReactiveModel(_fb);     // it's an empty formArray
  }

  ngOnInit() {
    // console.log("onInit")
  }

  ngAfterViewInit() {
    this._errorNotificationService.errorSummaryChanged$.subscribe((errors) => {
      this._processErrorSummaries(errors);
    });

    // when contactModel changes, check if "at least one company record" rule is met and then execute emitting
    this.contactModelChangesSubscription = this._listService.contactModelChanges$.subscribe(changes => {
      // console.log('--------------------', changes);
      this._emitErrors(false);
    });
  }

  private _processErrorSummaries(errSummaryEntries: { key: string, errSummaryMessage: ErrorSummaryComponent }[]): void {
    // console.log('...._processErrorSummaries:', errSummaryEntries);
    // get the first entry where the errSummaryMessage property is not empty
    // as we only need one summary entry of this list section if there is any to be bubbled up to the top level error summary section
    const filteredErrSummaryEntry = errSummaryEntries.find(summary => summary.errSummaryMessage);
    // console.log('....', filteredErrSummaryEntry);
    if (filteredErrSummaryEntry) {
      this.errorSummaryChild = filteredErrSummaryEntry.errSummaryMessage;
    } else {
      this.errorSummaryChild = null;
    }
    this._emitErrors(true);
  }


  /**
   * Processes change events from inputs
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    // console.log(this._utilsService.checkComponentChanges(changes));

    if (changes['loadFileIndicator']) {
      this.contactListForm = this._listService.getReactiveModel(this._fb);     // reset contactListForm to an empty formArray
      this.newRecordIndicator = false;
    }
    if (changes['saveContact']) {
      this.saveContactRecord(changes['saveContact'].currentValue);
    }
    if (changes['contactModel'] && !changes['contactModel'].firstChange) {
      // when the enrollment form is first loaded, contactModel is loaded before contactStatusList because contactStatusList is loaded from an API call
      // wait until contactStatusList is avaialble then to init the contact list form;
      // when importing a file,  initing the contact list form with loaded contacts is triggered here
      this.initWithData();
    }
    if (changes['contactStatusList']) {
      this.initWithData();
    }

    if (changes['disableForm']) {
      const prev = changes['disableForm'].previousValue;
      const curr = changes['disableForm'].currentValue;

      // Always enable/disable form properly
      if (curr) {
        this.disableFormGroup();
      } else {
        this.enableFormGroup();

        // Only run this AFTER going from disabled → enabled (e.g: loading in a final xml and pressing amend enrolment)
        if (prev === true && curr === false) {
          this._handlePostEnableBehavior();
        }
      }
    }
  }

  private initWithData() {
    if (this.contactStatusList.length > 0 && this.contactModel) {

      this._listService.setModelRecordList(this.contactModel);
      this._listService.initIndex(this.contactModel);

      if (!this.contactModel || this.contactModel.length === 0) {
        this._createFormContact();
      } else {
        this._listService.createFormRecordList(this.contactModel, this._fb, this.contactList, this.isInternal);
        if (this.isInternal) {
          this._expandNextInvalidRecord();
        } else {
          // expand the first record
          const firstFormRecord = this.contactList.at(0) as FormGroup;
          firstFormRecord.controls['expandFlag'].setValue(true);
        }
      }

      this._listService.updateUIDisplayValues(this.contactList, this.contactStatusList, this.lang);
    }
  }

  get contactList(): FormArray {
    return <FormArray>(this.contactListForm.controls['contacts']);
  }

  /**
   * Adds an contact UI record to the contact List
   */
  public addContact(): void {
    const newIndex = this.contactList.length;
    let contactFocus = "";

    this._createFormContact();

    this._listService.updateUIDisplayValues(this.contactList, this.contactStatusList, this.lang);

    if (this.isInternal) {
      if (this.contactList.length >= 1) {
        contactFocus = "contactId" + newIndex;
      } else {
        contactFocus = "contactId" + 0;
      }
    } else {
      if (this.contactList.length >= 1) {
        contactFocus = "fullName" + newIndex;
      } else {
        contactFocus = "fullName" + 0;
      }
    }
    setTimeout(() => {
      document.getElementById(contactFocus).focus()
    }, 0);
    this.showErrors = false;
  }

  private _createFormContact() {
    const formContact = this._listService.createContactFormRecord(this._fb, this.isInternal);
    this.recModel = formContact;
    this.addRecord(formContact, this.contactList);
    this._listService.collapseFormRecordList(this._utilsService, this.contactList, formContact.controls['id'].value);
  }

  /**
   * Saves the record to the list. If new adds to the end of the list. Does no error Checking
   * @param record
   */
  public saveContactRecord(contactRecord) {
    let record: any = this.recModel;
    if (this.contactStatus && this.updatedContactDetailsForm) {
      record = this.recModel;
      this._detailsService.setFormContactStatus(this.updatedContactDetailsForm, this.contactStatus, this.contactStatusList, this.lang, true);
    } else {
      record = contactRecord.recModel;
    }

    const recordId = this.saveRecord(record, this._listService, this.lang, this.languageList, this.contactStatusList);

    // console.log(`recordId ${recordId} was saved`)

    // collapse this record
    for (let index = 0; index < this.contactList.controls.length; index++) {
      const element: FormGroup = this.contactList.controls[index] as FormGroup;
      // console.log(element);
      if (element.controls['id'].value === recordId) {
        element.controls['expandFlag'].setValue(false);
        break;
      }
    }

    // when it runs to here, it means no errors for the contact record, so we should also remove its ErrorSummary if there is any
    this._errorNotificationService.removeErrorSummary(recordId.toString());

    this._expandNextInvalidRecord(false);

    this.showErrors = true;

    if (status) {
      this.statusChange(record.controls['seqNumber'].value, status);
    } else {
      if (this.lang == "en") {
        this.statusMessage = "Contact record " + record.controls['seqNumber'].value + " has been saved."
      } else {
        this.statusMessage = "Enregistrement du contact " + record.controls['seqNumber'].value + " a été sauvegardé."
      }
    }
    this.contactListForm.markAsPristine();
    setTimeout(() => {
      document.getElementById('addContactBtn').focus()
    }, 0);

    this.contactsUpdated.emit(this.contactModel);
  }

  private _expandNextInvalidRecord(returnValue?: boolean): boolean | void {
    for (let index = 0; index < this.contactList.controls.length; index++) {
      const element = this.contactList.controls[index] as FormGroup;
      if (element.invalid) {
        element.controls['expandFlag'].setValue(true);
        return returnValue ? true : undefined;
      }
    }
    return returnValue ? false : undefined;
  }

  private _collapseValidRecords(): void {
    this.contactList.controls.forEach((ctrl) => {
      const group = ctrl as FormGroup;
      if (!group.invalid) {
        group.controls['expandFlag'].setValue(false);
      }
    });
  }

  /**
   *  Updates the error list
   * @param errs - the list of errors to broadcast
   */
  updateErrorList(errs) {
    // console.log("updateErrorList", errs)
    this.errorList = errs;

    this._emitErrors(false); // needed or will generate a valuechanged error
  }

  /***
   * Emits errors to higher level error summaries. Used for linking summaries
   * @private
   */
  private _emitErrors(checkErrorSummary: boolean): void {
    let emitErrors = [];

    if (!this.isInternal && this._noNonRemoveRecords(this.contactModel)) {
      const oerr: ErrorSummaryObject = getEmptyErrorSummaryObj();
      oerr.index = 0;
      oerr.type = ERR_TYPE_LEAST_ONE_REC;

      // If there are no current records, or if there's only one record and it is set to REMOVE -> Error link is set to Add Record button
      // Otherwise, set it to the contact records component
      if ( this.contactList.length === 0 ||
        (this.contactList.length === 1 && (this.contactListForm.get('contacts') as FormArray).at(0).get('contactDetails.status')?.value === ContactStatus.Remove)) {
        oerr.tableId = 'addContactBtn';
      } else {
        oerr.tableId = 'contactRecords';
      }

      oerr.label = 'error.msg.contact.one.record';
      emitErrors.push(oerr);
    } else {
      if (checkErrorSummary && this.errorSummaryChild) {
        emitErrors.push(this.errorSummaryChild);
      }
    }
    //console.log(emitErrors);
    this.errors.emit(emitErrors);
  }

  /***
   * Loads the last saved version of the record data
   * @param record
   */
  public revertContact(id): void {
    let discardMsg = "";

    let modelRecord = this._listService.getModelRecord(this.contactId);
    if (!modelRecord) {
      modelRecord = this._listService.getEmptyContactModel();
      modelRecord.id = this.contactId;
    }
    let rec = this.getRecord(this.contactId, this.contactList);
    if (rec) {
      this._recordService.mapDataModelFormModel(modelRecord, rec);
    } else {
      // should never happen, there should always be a UI record
      console.warn('ContactList:rec is null');
    }
    if (this.lang == "en") {
      discardMsg = "Contact record " + rec.controls['seqNumber'].value + "  changes have been discarded."
    } else {
      discardMsg = "Les modifications du contact " + rec.controls['seqNumber'].value + " ont été annulées."
    }

    this.statusMessage = discardMsg;

    // Screen reader will announce message again after the first time Discard Changes button has been clicked
    setTimeout(() => {
      this.statusMessage = ''; // Temporarily clear the message
      setTimeout(() => {
        this.statusMessage = discardMsg; // Restore the message
      }, 50); // Small delay before restoring
    }, 50);

    if (this.isInternal) {
      document.location.href = '#contactId';
    } else {
      document.location.href = '#status';
    }
    this.updatedContactDetailsForm.markAsPristine()
    // jQuery( "#" + this.discardPopupId ).trigger( "open.wb-overlay" );
  }

  /**
   * Deletes a record from the UI list and the model list, if it exists
   * @param id
   */
  public deleteContact(id): void {
    let deletedRec = this.getRecord(this.contactId, this.contactList);
    this.deleteRecord(this.contactId, this.contactList, this._listService);
    this.contactListForm.markAsPristine();
    // since the contact record is deleted, we should also remove its ErrorSummary if there is any
    this._errorNotificationService.removeErrorSummary(this.contactId.toString());
    this._listService.updateUIDisplayValues(this.contactList, this.contactStatusList, this.lang);
    this._expandNextInvalidRecord(false);
    if (this.lang == "en") {
      this.statusMessage = "Contact record " + deletedRec.controls['seqNumber'].value + " has been deleted."
    } else {
      this.statusMessage = "Enregistrement du contact  " + deletedRec.controls['seqNumber'].value + " a été supprimé."
    }
    document.location.href = '#contactListTable';

    this.contactsUpdated.emit(this.contactModel);

    setTimeout(() => {
      document.getElementById('addContactBtn').focus()
    }, 100);
  }

  public statusChange(seqNumber, status): void {

    if (this.lang == "en") {
      switch (status) {
        case ContactStatus.Active:
          this.statusMessage = "Contact record " + seqNumber + " status is now active.";
          break;
        case ContactStatus.Remove:
          this.statusMessage = "Contact record " + seqNumber + " status has been changed to remove.";
          break;
        case ContactStatus.Revise:
          this.statusMessage = "Contact record " + seqNumber + " status has been changed to revise.";
          break;
      }
    } else {
      switch (status) {
        case ContactStatus.Active:
          this.statusMessage = " Le statut d’enregistrement de contact " + seqNumber + " est maintenant actif.";
          break;
        case ContactStatus.Remove:
          this.statusMessage = "Le statut d’enregistrement de contact " + seqNumber + " a été modifié pour être supprimé.";
          break;
        case ContactStatus.Revise:
          this.statusMessage = "Le statut d’enregistrement de contact " + seqNumber + " a été modifié pour être révisé.";
          break;
      }
    }

    this.saveContactRecord(this.contactModel);
  }

  /**
   * check if its record exists
   */
  public disableAddButton(): boolean {
    // console.log("form is invalid: ", !this.contactListForm.valid,  "form has errors: ", this.errorList.length>0,
    //   "form is dirty: ", this.contactListForm.dirty);
    return (!this.contactListForm.valid || this.errorList.length > 0 || this.contactListForm.dirty);
  }

  /**
   * Changes the local model back to the last saved version of the requester
   */
  public showErrorsSummary(): boolean {
    return (this.showErrors && this.errorList.length > 0);
  }

  /**
   * check if there is any record in dataList whose status is not remove
   * @param id
   */
  private _noNonRemoveRecords(dataList): boolean {
    if (dataList && dataList.length > 0) {
      for (const index in dataList) {
        if (dataList[index].status._id !== ContactStatus.Remove) { return false; }     //todo use the constant
      }
      // dataList.forEach(record => {
      //   if (record.status._id !== 'Remove') {return false; }
      // });
    }

    return true;
  }

  handleRowClick(event: any) {
    const clickedIndex = event.index;
    const clickedRecordState = event.state;
    this.rowIndexToRefocus = event.index;

    // console.log(this._utilsService.logFormControlState(this.contactListForm))

    if (this.contactListForm.pristine) {
      this.contactList.controls.forEach((element: FormGroup, index: number) => {
        if (clickedIndex === index) {
          element.controls['expandFlag'].setValue(!clickedRecordState)
        }
      })
    } else {
      this.openPopup();
    }

  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.contactModelChangesSubscription.unsubscribe();
  }

  openPopup() {
    const popupSelector = "#" + this.popupId;
    jQuery(popupSelector).trigger("open.wb-overlay");

    // Wait for overlay to render to focus on Close button once it is shown on the UI
    setTimeout(() => {
      const btn = document.querySelector(`${popupSelector} button.overlay-close`) as HTMLButtonElement;
      if (btn) {
        btn.focus();
      }
    }, 100);
  }

  openConfirmationPopup(popupId: string) {
    const popupSelector = "#" + popupId;
    jQuery(popupSelector).trigger("open.wb-overlay");

    // Wait for overlay to render to focus on Close button once it is shown on the UI
    setTimeout(() => {
      const btn = document.querySelector(`${popupSelector} button.overlay-close`) as HTMLButtonElement;
      if (btn) {
        btn.focus();
      }
    }, 100);
  }

  handleClosedPopup() {
    setTimeout(() => {
      this.popupTrigger.focus();
    })
  }

  handleClosedPopupAccordion() {
    this.accordionChild.focusHeader(this.rowIndexToRefocus);
  }

  discarChangeContactConfirmation(event) {
    this.contactId = event.id;
    this.discardChangeHeading = event.heading;
    this.popupTrigger = event.buttonTrigger;
    this.openConfirmationPopup(this.discardChangePopupID);
    this.updatedContactDetailsForm = event.tempContactDetailsForm;
    this.updatedContactDetailsForm.markAsDirty()
  }
  discarRecordeContactConfirmation(event) {
    this.contactId = event.id;
    this.discardRecordHeading = event.heading;
    this.popupTrigger = event.buttonTrigger;
    this.openConfirmationPopup(this.discardRecordPopupID);
  }

  deleteContactConfirmation(event) { // NOT USED
    this.contactId = event.id;
    this.removeContactHeading = event.heading;
    this.popupTrigger = event.buttonTrigger;
    this.openConfirmationPopup(this.removeContactPopupID);
  }

  setReviseStatusConfirmation(event) {
    this.contactId = event.id;
    this.setReviseStatusHeading = event.heading;
    this.contactStatus = event.status;
    this.recModel = event.recModel;
    this.updatedContactDetailsForm = event.tempContactDetailsForm;
    this.popupTrigger = event.buttonTrigger;
    this.updatedContactDetailsForm.markAsDirty()
    this.openConfirmationPopup(this.setReviseStatusPopupID);
  }

  setRemoveStatusConfirmation(event) {
    this.contactId = event.id;
    this.contactStatus = event.status;
    this.setRemoveStatusHeading = event.heading;
    this.recModel = event.recModel;
    this.updatedContactDetailsForm = event.tempContactDetailsForm;
    this.popupTrigger = event.buttonTrigger;
    this.openConfirmationPopup(this.setRemoveStatusPopupID);
  }

  setActiveStatusConfirmation(event) {
    this.contactId = event.id;
    this.contactStatus = event.status;
    this.recModel = event.recModel;
    if (event.heading) {
      this.setActiveStatusHeading = event.heading;
      this.updatedContactDetailsForm = event.tempContactDetailsForm;
    }
    this.popupTrigger = event.buttonTrigger;
    this.openConfirmationPopup(this.setActiveStatusPopupID);
  }

  disableFormGroup() {
    if (this.contactListForm) {
      this.contactListForm.disable();
    }
  }

  enableFormGroup() {
    if (this.contactListForm) {
      this.contactListForm.enable();
    }
  }

  private _handlePostEnableBehavior(): void {
    // collapse valid records
    this._collapseValidRecords();
    // expand next invalid record
    const expanded = this._expandNextInvalidRecord(true);
    // if no invalid record exists, expand the first
    if (!expanded) {
      const firstFormRecord = this.contactList.at(0) as FormGroup;
      firstFormRecord.controls['expandFlag'].setValue(true);
    }
  }

/**
 * Checks if there are any new contact records in the contact list form
 * New records are identified by status === ContactStatus.New
 * Logs debug info for each record
 */
public hasNewRecords(): boolean {
  if (!this.contactList || this.contactList.length === 0) {
    return false;
  }

  return this.contactList.controls.some((ctrl: FormGroup) => {
    const contactDetails = ctrl.get('contactDetails') as FormGroup;
    return contactDetails?.controls['status']?.value === ContactStatus.New;
  });
}

}