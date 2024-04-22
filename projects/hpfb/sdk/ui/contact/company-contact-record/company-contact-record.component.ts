import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild,
  ViewChildren, ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ContactDetailsComponent} from '../contact.details/contact.details.component';
import {ContactDetailsService} from '../contact.details/contact.details.service';
import { ControlMessagesComponent } from '../../error-msg/control-messages/control-messages.component';
import { ErrorSummaryComponent } from '../../error-msg/error-summary/error-summary.component';
import { ICode } from '../../data-loader/data';
import { UtilsService } from '../../utils/utils.service';
import { ContactStatus } from '../../common.constants';
import {TranslateService} from '@ngx-translate/core';
import { ErrorNotificationService } from '../../error-msg/error.notification.service';

@Component({
  selector: 'company-contact-record',
  templateUrl: './company-contact-record.component.html',
  styleUrls: ['./company-contact-record.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None

})
export class CompanyContactRecordComponent implements OnInit, AfterViewInit {

  @Input() cRRow: FormGroup;
  @Input() languageList: ICode[];
  @Input() contactStatusList: ICode[];

  public contactRecordModel: FormGroup;
  @Input('group') public contactFormRecord: FormGroup;
  @Input() isInternal: boolean;
  @Input() showErrors: boolean;
  @Input() lang;
  @Input() helpTextSequences;
  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() errors = new EventEmitter();

  @ViewChild(ContactDetailsComponent, {static: true}) contactDetailsChild;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public updateChild: number = 0;
  public sequenceNum: number = 0;
  public errorList = [];
  private childErrorList: Array<any> = [];
  private parentErrorList: Array<any> = [];
  public isNew: boolean;
  public showErrSummary: boolean;
  private errorSummaryChild: ErrorSummaryComponent = null;
  
  public headingLevel = 'h4';
  headingPreamble: string = "heading.contactDetails";
  headingPreambleParams: any;
  translatedParentLabel: string;

  constructor( private cdr: ChangeDetectorRef, private _utilsService: UtilsService, 
    private _detailsService: ContactDetailsService, private _translateService: TranslateService, private _errorNotificationService: ErrorNotificationService) {
    this.showErrors = false;
    this.showErrSummary = false;
  }

  ngOnInit() {
    this.headingPreambleParams = this.cRRow.get('seqNumber').value;
    this.translatedParentLabel = this._translateService.instant(this.headingPreamble, {seqnumber: this.headingPreambleParams});
    this.contactRecordModel = this.cRRow;
  }

  ngAfterViewInit(){
    this.msgList.changes.subscribe(errorObjs => {
      // update is handled directly in the function
      this.updateErrorList(null, true);
      this._emitErrors();
    });
    /** this is processsing the errorSummary that is a child in  Contact record **/
    this.errorSummaryChildList.changes.subscribe(list => {
      this.processSummaries(list);
    });

  }

  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Contact List found >1 Error Summary ' + list.length);
    }
    this.errorSummaryChild = list.first;
    // notify subscriber(s) that contact records' error summaries are changed
    this._errorNotificationService.updateErrorSummary(this.contactRecordModel.controls['id'].value, this.errorSummaryChild);
 
    // this._emitErrors();
  }
  /***
   * Emits errors to higher level error summaries. Used for linking summaries
   * @private
   */
  private _emitErrors(): void {
    let emitErrors = [];
    if (this.errorSummaryChild) {
      emitErrors.push(this.errorSummaryChild);
    }
    this.errors.emit(emitErrors);
  }

  ngOnChanges (changes: SimpleChanges) {
    // console.log(this._utilsService.checkComponentChanges(changes));

    if (changes['showErrors']) {
      // console.log("contact.record", "onchange", "showErrors", changes['showErrors'].currentValue)
      this.showErrSummary = changes['showErrors'].currentValue;
      this._emitErrors();
    }
    this.cdr.detectChanges(); // doing our own change detection

  }

  /**
   * Updates the master error list. Combines the record level field errors with the child record field error
   * @param errs
   * @param {boolean} isParent
   */
  updateErrorList(errs, isParent: boolean = false) {
    // console.log("Starting update error list")
    if (!isParent) {
      this.childErrorList = errs;
    }
    this.parentErrorList = [];
    // do this so don't miss it on a race condition
    if (this.msgList) {
      this.msgList.forEach(
        error => {
          this.parentErrorList.push(error);
        }
      );
      // this.cdr.detectChanges(); // doing our own change detection
    }

    this.errorList = new Array();
    this.errorList = this.parentErrorList.concat(this.childErrorList);
    // console.log("====>updateErrorList", this.errorList)

    this.cdr.detectChanges(); // doing our own change detection
  }

  /**
   * Changes the local model back to the last saved version of the contact
   */
  public revertContactRecord(): void {
    this.revertRecord.emit(this.contactRecordModel);
    this.contactRecordModel.markAsPristine();
  }

  /***
   * Deletes the contact reocord with the selected id from both the model and the form
   */
  public deleteContactRecord(): void {
    this.errorSummaryChild = null;
    this.deleteRecord.emit(this.contactRecordModel.value.id);
    this._emitErrors();
    this.contactRecordModel.markAsPristine();
  }
 
  public setStatusToRevise(): void {
    this._detailsService.setFormContactStatus(this.contactDetailsForm, ContactStatus.Revise, this.contactStatusList, this.lang, true);
    this.saveContactRecord();
  }

  public setStatusToRemove(): void {
    this._detailsService.setFormContactStatus(this.contactDetailsForm, ContactStatus.Remove, this.contactStatusList, this.lang, true);
    this.saveContactRecord();
  }

  public activeContactRecord(): void {
    // this._detailsService.setFormContactStatus(this.contactDetailsForm, ContactStatus.Active, this.contactStatusList, this.lang, true);
    this.saveContactRecord(ContactStatus.Active)
  }

  public saveContactRecord(contactStatus?: ContactStatus): void {
    // console.log("====>saveContactRecord ", this.errorList);  
    if (this.contactRecordModel.valid || this._recordInvalidExcemption(contactStatus)) {
      if (contactStatus) {
        this._detailsService.setFormContactStatus(this.contactDetailsForm, contactStatus, this.contactStatusList, this.lang, true);
      }
      this.saveRecord.emit((this.contactRecordModel));
      this.contactRecordModel.markAsPristine();
    } else {
      // id is used for an error to ensure the record gets saved
      let temp = this.contactRecordModel.value.id;
      this.contactRecordModel.controls['id'].setValue(1);
      if (this.contactRecordModel.valid) {
        this.contactRecordModel.controls['id'].setValue(temp);
        this.saveRecord.emit((this.contactRecordModel));
      } else {
        this.contactRecordModel.controls['id'].setValue(temp);
        this.showErrSummary = true;
        this.showErrors = true;
      }
    }
  }

  // when user clicks the "Acitve Contact" button, if the current Contact Status is "REVISE", 
  // it will show the "error.msg.revise.contact" error 
  // if that is the only error on the record, we will allow user to continue to "Active Contact"
  private _recordInvalidExcemption(contactStatus?: ContactStatus){
    let returnValue: boolean = false;
    if (contactStatus) {
      if (contactStatus===ContactStatus.Active && this.errorList.length===1 && this.errorList[0].currentError === "error.msg.revise.contact") 
      returnValue =  true;
    }
    return returnValue;
  }

  /**
   * Changes the local model back to the last saved version of the contact
   */
  public showErrorSummary(): boolean {
    return (this.showErrSummary && this.errorList.length > 0);
  }

  /**
   * show revise and remove contact button
   */
  public isExternalNotNewContact(): boolean {
    return (!this.isInternal && !this.isContactStatus(ContactStatus.New));
  }

  /**
   * internal site show active contact button
   */
  public isInternalActiveContact(): boolean {
    return (this.isInternal && !this.isContactStatus(ContactStatus.Remove));
  }

  /**
   * External site show save contact button
   */
  public isExternalNewContact(): boolean {
    return (!this.isInternal && this.isContactStatus(ContactStatus.New));
  }

    /**
   * Internal/External site show discard record button
   */
    public isNewContact(): boolean {
      return (this.isContactStatus(ContactStatus.New));
    }

  /**
   * Internal site show delete contact button
   */
  public isInternalDeleteContact(): boolean {
    return (this.isInternal && this.isContactStatus(ContactStatus.Remove));
  }

  public isContactSetToRemove(): boolean {
    return (this.isContactStatus(ContactStatus.Remove));
  }
    
  get contactDetailsForm() {
    return this.contactRecordModel.get('contactDetails') as FormGroup;
  }

  private isContactStatus(status: ContactStatus) {
    const contStatusValue = this.contactDetailsForm.controls['status'].value;
    return contStatusValue===status;
  }
  

}
