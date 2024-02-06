import {
  Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges, ViewChildren, QueryList, EventEmitter, Output,
  AfterViewInit, DoCheck, ViewEncapsulation
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CompanyContactRecordComponent} from '../company-contact-record/company-contact-record.component';
import {CompanyContactRecordService} from '../company-contact-record/company-contact-record.service';
import {ContactListService} from './contact-list.service';
import { RecordListBaseComponent } from '../../record-list/record.list.base.component';
import {TranslateService} from '@ngx-translate/core';
import { ErrorSummaryComponent } from '../../error-msg/error-summary/error-summary.component';
import { FINAL, ContactStatus } from '../../common.constants';
import { ICode } from '../../data-loader/data';
import { UtilsService } from '../../utils/utils.service';
import { Contact } from '../../model/entity-base';
import { Subscription } from 'rxjs';
import { ERR_TYPE_LEAST_ONE_REC, ErrorSummaryObject, getEmptyErrorSummaryObj } from '../../error-msg/error-summary/error-summary-object';
import { ErrorNotificationService } from '../../error-msg/error.notification.service';

//  import {ExpanderComponent} from '../../common/expander/expander.component';
@Component({
  selector: 'lib-contact-list',
  templateUrl: './contact.list.component.html',
  styleUrls: ['./contact.list.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class ContactListComponent extends RecordListBaseComponent implements OnInit, OnChanges, AfterViewInit {
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
  @Output() public errors = new EventEmitter();
  @Output() public contactsUpdated = new EventEmitter();

  @ViewChild(CompanyContactRecordComponent, {static: true}) companyContactChild: CompanyContactRecordComponent;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;

  private errorSummaryChild = null;
  public contactListForm: FormGroup;
  public errorList = [];

  private contactModelChangesSubscription: Subscription;
  
  constructor(private _fb: FormBuilder, private translate: TranslateService, private _utilsService: UtilsService, 
    private _listService: ContactListService, private _recordService: CompanyContactRecordService, private _errorNotificationService: ErrorNotificationService) {
    super();
    this.contactListForm = this._listService.getReactiveModel(_fb);     // it's an empty formArray
  }

  ngOnInit() {
    // console.log("onInit")
  }

  ngAfterViewInit() {
    // ContactListComponent doesn't have ErrorSummaryComponent in the template, so the subscribe won't be triggered.
    /*
    // this.setExpander(this.expander);
    this.processSummaries(this.errorSummaryChildList);
    this.errorSummaryChildList.changes.subscribe(list => {
      this.processSummaries(list);
    });

    //   this.cd.detectChanges();
    */
    // subscribe and process the updated contact records' error summaries
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

  // /**
  //  * Updates the error list to include the error summaries. Messages upwards
  //  * @param {QueryList<ErrorSummaryComponent>} list
  //  */
  // private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
  //   if (list.length > 1) {
  //     console.warn('Contact List found >1 Error Summary ' + list.length);
  //   }
  //   // console.log('ContactList process Summaries');
  //   this.errorSummaryChild = list.first;
  //   // TODO what is this for need to untangle
  //   // this.setErrorSummary(this.errorSummaryChild);
  //   // if (this.errorSummaryChild) {
  //   //   this.errorSummaryChild.index = this.getExpandedRow();
  //   // }
  //   // console.log(this.errorSummaryChild);
  //   this._emitErrors();
  // }

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
      
  }

  private initWithData(){
    if (this.contactStatusList.length > 0 && this.contactModel) {

      this._listService.setModelRecordList(this.contactModel);
      this._listService.initIndex(this.contactModel);

      if ( !this.contactModel || this.contactModel.length === 0 ) {
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

    this._createFormContact();

    this._listService.updateUIDisplayValues(this.contactList, this.contactStatusList, this.lang);

    if (this.isInternal) {
      document.location.href = '#contactId';
    } else {
      document.location.href = '#status';
    }
    this.showErrors = false;
  }

  private _createFormContact(){
    const formContact = this._listService.createContactFormRecord(this._fb, this.isInternal);
    this.addRecord(formContact, this.contactList);
    this._listService.collapseFormRecordList(this._utilsService, this.contactList, formContact.controls['id'].value);
  }

  /**
   * Saves the record to the list. If new adds to the end of the list. Does no error Checking
   * @param record
   */
  public saveContactRecord(record: FormGroup) {
    const recordId = this.saveRecord(record, this._listService, this.lang, this.languageList, this.contactStatusList);
    // console.log(`recordId ${recordId} was saved`)

    // collapse this record
    for (let index = 0; index < this.contactList.controls.length; index++) {
      const element: FormGroup = this.contactList.controls[index] as FormGroup;
      // console.log(element);
      if (element.controls['id'].value===recordId) {
        element.controls['expandFlag'].setValue(false);
        break;
      } 
    }  

    // when it runs to here, it means no errors for the contact record, so we should also remove its ErrorSummary if there is any
    this._errorNotificationService.removeErrorSummary(recordId.toString());

    this._expandNextInvalidRecord();

    this.showErrors = true;
    if (!this.isInternal) {
      document.location.href = '#addContactBtn';
    }
    this.contactsUpdated.emit(this.contactModel);
  }

  private _expandNextInvalidRecord(){
     // expand next invalid record
     for (let index = 0; index < this.contactList.controls.length; index++) {
      const element: FormGroup = this.contactList.controls[index] as FormGroup;
      // console.log(element);
      if (element.invalid) {
        element.controls['expandFlag'].setValue(true);
        break;
      } 
    }     
  }
  /**
   *  Updates the error list
   * @param errs - the list of errors to broadcast
   */
  updateErrorList(errs) {
    // console.log("updateErrorList", errs)
    this.errorList = errs;
    // this.errorList = (errs && errs.length > 0) ? this.errorList.concat(errs) : [];
    // for (const err of this.errorList) {
    //   err.index = this.getExpandedRow();
    //   if (err.type === ERR_TYPE_COMPONENT) {
    //     err.expander = this.expander; // associate the expander
    //   }
    // }
    this._emitErrors(false); // needed or will generate a valuechanged error
  }

  /***
   * Emits errors to higher level error summaries. Used for linking summaries
   * @private
   */
  private _emitErrors(checkErrorSummary: boolean): void {
    let emitErrors = [];
    // adding the child errors
    // if (this.errorList) { //  && !this.isInternal
    //   // emitErrors = this.errorList;
    //   this.errorList.forEach((error: any) => {
    //     emitErrors.push(error);
    //   });
    // }
    if (checkErrorSummary && this.errorSummaryChild) {
      emitErrors.push(this.errorSummaryChild);
    }
    if (!this.isInternal && this._noNonRemoveRecords(this.contactModel)) {
      const oerr: ErrorSummaryObject = getEmptyErrorSummaryObj();
      oerr.index = 0;
      oerr.tableId = 'contactListTable';
      oerr.type = ERR_TYPE_LEAST_ONE_REC;
      oerr.label = 'error.msg.contact.one.record';
      emitErrors.push(oerr);
    }
    this.errors.emit(emitErrors);
  }

  /***
   * Loads the last saved version of the record data
   * @param record
   */
  public revertContact(record): void {
    let recordId = record.controls.id.value;

    let modelRecord = this._listService.getModelRecord(recordId);
    if (!modelRecord) { 
      modelRecord = this._listService.getEmptyContactModel();
      modelRecord.id = recordId;
    } 
    let rec = this.getRecord(recordId, this.contactList);
    if (rec) {
      this._recordService.mapDataModelFormModel(modelRecord, rec);
    } else {
      // should never happen, there should always be a UI record
      console.warn('ContactList:rec is null');
    }
    if (this.isInternal) {
      document.location.href = '#contactId';
    } else {
      document.location.href = '#status';
    }
  }

  /**
   * Deletes a record from the UI list and the model list, if it exists
   * @param id
   */
  public deleteContact(id): void {
    this.deleteRecord(id, this.contactList, this._listService);
    // since the contact record is deleted, we should also remove its ErrorSummary if there is any
    this._errorNotificationService.removeErrorSummary(id);
    this._listService.updateUIDisplayValues(this.contactList, this.contactStatusList, this.lang);
    this._expandNextInvalidRecord();
    document.location.href = '#contactListTable';
    this.contactsUpdated.emit(this.contactModel);
  }

  /**
   * check if its record exists
   */
  public disableAddButton(): boolean {
    // console.log("form is invalid: ", !this.contactListForm.valid,  "form has errors: ", this.errorList.length>0, 
    //   "form is dirty: ", this.contactListForm.dirty);
    return ( !this.contactListForm.valid  || this.errorList.length > 0 ||  this.contactListForm.dirty );
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
        if (dataList[index].status._id !== ContactStatus.Remove) {return false; }     //todo use the constant
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

    // console.log(this._utilsService.logFormControlState(this.contactListForm))

    if (this.contactListForm.pristine) {
      this.contactList.controls.forEach( (element: FormGroup, index: number) => {
        if (clickedIndex===index) {
          element.controls['expandFlag'].setValue(!clickedRecordState)
        }
      })
    } else {
      if (this._utilsService.isFrench(this.lang)) {
        alert(
          "Veuillez sauvegarder les données d'entrée non enregistrées."
        );
      } else {
        alert(
          'Please save the unsaved input data.'
        );
      }
    }

  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.contactModelChangesSubscription.unsubscribe();
  }
}

