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
import { FINAL, errorSummClassName } from '../../common.constants';
import { ICode } from '../../data-loader/data';
import { UtilsService } from '../../utils/utils.service';
import { Contact } from '../../model/entity-base';

//  import {ExpanderComponent} from '../../common/expander/expander.component';
@Component({
  selector: 'contact-list',
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
  // private prevRow = -1;
  public updateContactDetails = 0;
  public contactListForm: FormGroup;
  public newContactForm: FormGroup;
  public service: ContactListService;
  public addRecordMsg = 0;
  public deleteRecordMsg = 0;
  public errorList = [];
  // public dataModel = [];
  public validRec = true;
  
  constructor(private _fb: FormBuilder, private translate: TranslateService, private _utilsService: UtilsService, 
    private _listService: ContactListService, private _recordService: CompanyContactRecordService) {
    super();
    // this.dataModel = this._listService.getModelRecordList();
    // this.translate.get('error.msg.required').subscribe(res => {
    //   // console.log(res);
    // });
    this.contactListForm = this._listService.getReactiveModel(_fb);     // it's an empty formArray
  }

  ngOnInit() {
    this.initFormWithData(this.contactModel);
  }

  ngAfterViewInit() {
    // this.setExpander(this.expander);
    this.processSummaries(this.errorSummaryChildList);
    this.errorSummaryChildList.changes.subscribe(list => {
      this.processSummaries(list);
    });

    //   this.cd.detectChanges();
  }

  /**
   * Updates the error list to include the error summaries. Messages upwards
   * @param {QueryList<ErrorSummaryComponent>} list
   */
  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Contact List found >1 Error Summary ' + list.length);
    }
    // console.log('ContactList process Summaries');
    this.errorSummaryChild = list.first;
    // TODO what is this for need to untangle
    this.setErrorSummary(this.errorSummaryChild);
    if (this.errorSummaryChild) {
      this.errorSummaryChild.index = this.getExpandedRow();
    }
    // console.log(this.errorSummaryChild);
    this._emitErrors();
  }


  // ngDoCheck() {
    // this.isValid();
    // this._syncCurrentExpandedRow();
  // }

  /**
   *
   * @private syncs the contact details record with the reactive model. Uses view child functionality
   */
  // private _syncCurrentExpandedRow(): void {
  //   if (this.companyContactChild) {
  //     const contactFormList = this.getFormContactList();
  //     const result = this.syncCurrentExpandedRow(contactFormList);
  //     // Onlu update the results if there is a change. Otherwise the record will not be dirty

  //     if (result) {
  //       this.companyContactChild.contactFormRecord = result;
  //       this.updateContactDetails++;
  //     }
  //   } else {
  //     console.warn('There is no company contact child');
  //   }
  // }

  /**
   * Processes change events from inputs
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);

    // Ignore first trigger of ngOnChanges
    if (!isFirstChange) {

      if (changes['loadFileIndicator']) {
        console.log("changes['loadFileIndicator'].currentValue", changes['loadFileIndicator'].currentValue);
        this.contactListForm = this._listService.getReactiveModel(this._fb);     // reset contactListForm to an empty formArray
        this.newRecordIndicator = false;
        // this._deleteContactInternal(0);
      }
      if (changes['saveContact']) {
        this.saveContactRecord(changes['saveContact'].currentValue);
      }
      if (changes['contactModel']) {
        // this._listService.setModelRecordList(changes['contactModel'].currentValue);
        // this._listService.initIndex(changes['contactModel'].currentValue);
        // this.dataModel = this._listService.getModelRecordList();
        // // this.contactListForm.controls['contacts'] = this._fb.array([]);
        // this._listService.createFormDataList(this.dataModel, this._fb, this.contactListForm.controls['contacts'], this.isInternal);
        this.initFormWithData(changes['contactModel'].currentValue);
        // this.validRec = true;
      }

      // if (changes['isInternal']) {
      //   if (!this.isInternal && (!this.contactModel || this.contactModel.length === 0)) {
      //     this.addContactInit();
      //     this.showErrors = false;
      //   }
      // }
    }
  }

  private initFormWithData(contactModelData: Contact[]){
    this._listService.setModelRecordList(contactModelData);
    this._listService.initIndex(contactModelData);
    // this.dataModel = this._listService.getModelRecordList();

    if (!this.isInternal && (!this.contactModel || this.contactModel.length === 0)) {
      this.addContactInit();
      this.showErrors = false;
    } else {
      this._listService.createFormDataList(contactModelData, this._fb, this.contactListForm.controls['contacts'], this.isInternal);
    }

    if (this.xmlStatus!==FINAL) {
      // if xmlStatus is FINAL, collapse all records by default, otherwise expand the first record
      const firstFormRecord = (this.contactListForm.controls['contacts'] as FormArray).at(0) as FormGroup;
      firstFormRecord.controls['expandFlag'].setValue(true);
    }
  }

  // public isValid(override: boolean = false): boolean {
  //   if (override) {
  //     return true;
  //   }
  //   if (this.newRecordIndicator) { 
  //     this.validRec = false;
  //     return false;
  //   } else if (this.companyContactChild && this.companyContactChild.contactFormRecord) {
  //     this.validRec = this.contactListForm.valid && !this.companyContactChild.contactFormRecord.dirty;
  //     return true; //(this.contactListForm.valid && !this.companyContactChild.contactFormRecord.dirty);
  //   }
  //   this.validRec = this.contactListForm.valid;
  //   console.log("isValid", "this.validRec", this.validRec)
  //   return (this.contactListForm.valid);
  // }

  // public getFormContactList(): FormArray {
  //   return <FormArray>(this.contactListForm.controls['contacts']);
  // }

  get contactList(): FormArray {
    return <FormArray>(this.contactListForm.controls['contacts']);
  }

  /**
   * returns an contact record with a given id
   * @param {number} id - the identifier for that contact record
   * @returns {FormGroup} -the contact record, null if theere is no match
   * @private
   */
  // private _getFormContact(id: number): FormGroup {
  //   // let contactList = this.getFormContactList();
  //   return this.getRecord(id, this.contactList);
  // }

  /**
   * Adds an contact UI record to the contact List
   */
  public addContactInit(): void {

    // add contact to the list
    // console.log('adding an contact');
    // 1. Get the list of reactive form Records
    // let contactFormList = <FormArray>this.contactListForm.controls['contacts'];
    // console.log(contactFormList);
    // 2. Get a blank Form Model for the new record
    let formContact = this._recordService.getReactiveModel(this._fb, this.isInternal);
    // formContact.controls['expandFlag'].setValue(true);
    // 3. set record id
    this._listService.setRecordId(formContact, this._listService.getNextIndex());
    // 4. Add the form record using the super class. New form is addded at the end
    this.addRecord(formContact, this.contactList);
    // console.log(contactFormList);
    // 5. Set the new form to the new contact form reference.
    this.newContactForm = <FormGroup> this.contactList.controls[this.contactList.length - 1];
  }

  /**
   * Adds an contact UI record to the contact List
   */
  public addContact(): void {

    // add contact to the list
    // console.log('adding an contact');
    // 1. Get the list of reactive form Records
    // let contactFormList = <FormArray>this.contactListForm.controls['contacts'];
    // console.log(contactFormList);
    // 2. Get a blank Form Model for the new record
    let formContact = this._recordService.getReactiveModel(this._fb, this.isInternal);
    // 3. set record id
    this._listService.setRecordId(formContact, this._listService.getNextIndex());
    // 4. Add the form record using the super class. New form is addded at the end
    this.addRecord(formContact, this.contactList);
    // console.log(contactFormList);
    // 5. Set the new form to the new contact form reference.
    this.newContactForm = <FormGroup> this.contactList.controls[this.contactList.length - 1];
    if (this.isInternal) {
      document.location.href = '#contactId';
    } else {
      document.location.href = '#status';
    }
    this.showErrors = false;
  }

  /**
   * Saves the record to the list. If new adds to the end of the list. Does no error Checking
   * @param record
   */
  public saveContactRecord(record: FormGroup) {
    this.saveRecord(record, this._listService, this.lang, this.languageList, this.contactStatusList);
    
    const recordId = record.controls['id'].value;
    // collapse this formRecord
    this.contactList.controls.forEach( (element: FormGroup, recordId: number) => {
      if (element.controls['id'].value===recordId) {
        element.controls['expandFlag'].setValue(false); 
      }
    });  

    this.addRecordMsg++;
    this.showErrors = true;
    if (!this.isInternal) {
      document.location.href = '#addContactBtn';
    }
    this.contactsUpdated.emit(this.contactModel);
  }

  /**
   * Sets the contact details controls form to a given row (not an id)
   * @param row
   */
  // public getRow(row): void {
  //   if (row > -1) {
  //     let mycontrol = this.getFormContactList();
  //     this.companyContactChild.contactFormRecord = <FormGroup> mycontrol.controls[row];
  //     this.updateContactDetails++;
  //   } else {
  //     console.info('Contact List row number is ' + row);
  //   }
  // }

  /**
   *  Updates the error list
   * @param errs - the list of errors to broadcast
   */
  updateErrorList(errs) {
    this.errorList = errs;
    // this.errorList = (errs && errs.length > 0) ? this.errorList.concat(errs) : [];
    for (const err of this.errorList) {
      err.index = this.getExpandedRow();
      if (err.type === errorSummClassName) {
        err.expander = this.expander; // associate the expander
      }
    }
    this._emitErrors(); // needed or will generate a valuechanged error
  }

  /***
   * Emits errors to higher level error summaries. Used for linking summaries
   * @private
   */
  private _emitErrors(): void {
    let emitErrors = [];
    // adding the child errors
    if (this.errorList) { //  && !this.isInternal
      // emitErrors = this.errorList;
      this.errorList.forEach((error: any) => {
        emitErrors.push(error);
      });
    }
    if (this.errorSummaryChild) {
      emitErrors.push(this.errorSummaryChild);
    }
    if (!this.isInternal && this._noNonRemoveRecords(this.contactModel)) { // && this.errorList.length === 0
      const oerr = new ErrorSummaryComponent(null);
      oerr.index = 0;
      oerr.tableId = 'contactListTable';
      oerr.type = 'leastOneRecordError';
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
      modelRecord = this._listService.getContactModel();
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
  private _deleteContactInternal(id): void {
    // const contactList = this.getFormContactList();
    this.deleteRecord(id, this.contactList, this._listService);
    // this.validRec = true;
    this.deleteRecordMsg++;
  }

  /**
   * Deletes a record from the UI list and the model list, if it exists
   * @param id
   */
  public deleteContact(id): void {
    this._deleteContactInternal(id);
    document.location.href = '#addContactBtn';
    this.contactsUpdated.emit(this.contactModel);
  }

  /**
   * check if its record exists
   */
  public isDirty(): boolean {
    return (!(this.contactListForm.valid  || !this.contactListForm.errors) ||
      this.contactListForm.dirty || this.newRecordIndicator);
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
        if (dataList[index].status._id !== 'REMOVE') {return false; }     //todo use the constant
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
    // toggle the clicked formRecord's expand state
    this.contactList.controls.forEach( (element: FormGroup, index: number) => {
      // console.log(element);
      element.controls['expandFlag'].setValue(clickedIndex===index? !clickedRecordState : false)
    });  
    // this.contactList.controls.forEach( e => console.log(e.value))
  }

}

