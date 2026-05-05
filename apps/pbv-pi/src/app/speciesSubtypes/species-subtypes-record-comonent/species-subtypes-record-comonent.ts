import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { SpeciesSubtypesDetailComponent } from '../species-subtypes-detail-component/species-subtypes-detail-component';
import { FormGroup } from '@angular/forms';
import { ControlMessagesComponent, ErrorNotificationService, ErrorSummaryComponent, ICode, UtilsService } from '@hpfb/sdk/ui';
import { SpeciesSubtypesDetailsService } from '../species-subtypes-detail-component/species-subtypes-detail-service';
import { TranslateService } from '@ngx-translate/core';
import { SpeciesSubtypesRecordService } from './species-subtypes-record-service';

@Component({
  selector: 'app-species-subtypes-record-comonent',
  templateUrl: './species-subtypes-record-comonent.html',
  styleUrl: './species-subtypes-record-comonent.css',
  standalone: false
})

export class SpeciesSubtypesRecordComonent implements OnInit, AfterViewInit {
  @Input() j: number;
  @Input() cRRow: FormGroup;


  public contactRecordModel: FormGroup;
  @Input('group') public speciesSubtypeRecord: FormGroup;
  @Input() showErrors: boolean;
  @Input() lang;
  @Input() helpTextSequences;
  @Input() disableForm: boolean;
  @Input() vetSpecies;
  @Input() specySubTypes;
  @Input() yesNoList;

  @Output() saveRecord = new EventEmitter<{
    recModel: FormGroup;
   }>();
  @Output() discardChangeEvent = new EventEmitter<{
    id: number;
    heading: string;
    buttonTrigger: HTMLElement;
    tempContactDetailsForm: FormGroup;
  }>();
  @Output() discardRecordEvent = new EventEmitter<{
    id: number;
    heading: string;
    buttonTrigger: HTMLElement;
  }>();
  // @Output() setRemoveStatusEvent = new EventEmitter<{
  //   id: number;
  //   heading: string;
  //   recModel: FormGroup;
  //   tempContactDetailsForm: FormGroup;
  //   buttonTrigger: HTMLElement;
  // }>();
  // @Output() setReviseStatusEvent = new EventEmitter<{
  //   id: number;
  //   heading: string;
  //   recModel: FormGroup;
  //   tempContactDetailsForm: FormGroup;
  //   buttonTrigger: HTMLElement;
  // }>();
  // @Output() setActiveStatusEvent = new EventEmitter<{
  //   id: number;
  //   heading: string;
  //   recModel: FormGroup;
  //   tempContactDetailsForm: FormGroup;
  //   buttonTrigger: HTMLElement;
  // }>();

  @Output() errors = new EventEmitter();

  @ViewChild(SpeciesSubtypesDetailComponent, { static: true }) contactDetailsChild;
  @ViewChildren(ErrorSummaryComponent)
  errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChildren(ControlMessagesComponent)
  msgList: QueryList<ControlMessagesComponent>;

  public updateChild: number = 0;
  public sequenceNum: number = 0;
  public errorList = [];
  private childErrorList: Array<any> = [];
  private parentErrorList: Array<any> = [];
  public isNew: boolean;
  public showErrSummary: boolean;
  private errorSummaryChild: ErrorSummaryComponent = null;

  public headingLevel = 'h4';
  headingPreamble: string = 'heading.contactDetails';
  headingPreambleParams: any;
  translatedParentLabel: string;
  disableDiscardBtn: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    private _utilsService: UtilsService,
    private _detailsService: SpeciesSubtypesDetailsService,
    private _translateService: TranslateService,
    private _errorNotificationService: ErrorNotificationService,
    private _companyRecordService: SpeciesSubtypesRecordService
  ) {
    this.showErrors = false;
    this.showErrSummary = false;
  }

  ngOnInit() {
    this.headingPreambleParams = this.cRRow.get('seqNumber').value;
    this.translatedParentLabel = this._translateService.instant(
      this.headingPreamble,
      { seqnumber: this.headingPreambleParams }
    );
    this.contactRecordModel = this.cRRow;
    const speciesSubtypeForm = <FormGroup>this.cRRow.controls['speciesSubtypesDetail'];
    if (speciesSubtypeForm.controls['specy'].value) {
      this.disableDiscardBtn = true
    } else {
      this.disableDiscardBtn = false;
    }
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe((errorObjs) => {
      // update is handled directly in the function
      this.updateErrorList(null, true);
      this._emitErrors();
    });
    /** this is processsing the errorSummary that is a child in  Contact record **/
    this.errorSummaryChildList.changes.subscribe((list) => {
      this.processSummaries(list);
    });
  }

  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Contact List found >1 Error Summary ' + list.length);
    }
    this.errorSummaryChild = list.first;
    // notify subscriber(s) that contact records' error summaries are changed
    this._errorNotificationService.updateErrorSummary(
      this.contactRecordModel.controls['id'].value,
      this.errorSummaryChild
    );

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

  ngOnChanges(changes: SimpleChanges) {
    // console.log(this._utilsService.checkComponentChanges(changes));
    if (changes['showErrors']) {
      // console.log("contact.record", "onchange", "showErrors", changes['showErrors'].currentValue)
      this.showErrSummary = changes['showErrors'].currentValue;
      this._emitErrors();
    }
    this.cdr.detectChanges(); // doing our own change detection

    if (this.disableForm) {
      this.disableFormGroup();
    } else {
      this.enableFormGroup();
    }
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
      this.msgList.forEach((error) => {
        this.parentErrorList.push(error);
      });
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
  public revertContactRecord(event: Event, index: number): void {
    const heading = this._companyRecordService.getHeading(index); // Await here
    const trigger = event.target as HTMLElement;

    this.discardChangeEvent.emit({
      id: this.contactRecordModel.value.id,
      heading: heading,
      buttonTrigger: trigger,
      tempContactDetailsForm: this.speciesSubtypesDetailsForm,
    });
     this.disableDiscardBtn = true
  }

  /***
   * Deletes the contact reocord with the selected id from both the model and the form
   */
  public deleteContactRecord(event: Event, index: number): void {
    this.errorSummaryChild = null;
    const heading = this._companyRecordService.getHeading(index); // Await here
    const trigger = event.target as HTMLElement;

    this.discardRecordEvent.emit({
      id: this.contactRecordModel.value.id,
      heading: heading,
      buttonTrigger: trigger
    });
    //this._emitErrors();
   }

  public setStatusToRevise(event: Event, index: number): void {
    const heading = this._companyRecordService.getHeading(index); // Await here
    const trigger = event.target as HTMLElement;
 //   this.saveContactRecord(index, heading, ContactStatus.Revise, trigger);
   }

  public setStatusToRemove(event: Event, index: number): void {
    const heading = this._companyRecordService.getHeading(index); // Await here
    const trigger = event.target as HTMLElement;
   // this.saveContactRecord(index, heading, ContactStatus.Remove, trigger);
  }

  public activeContactRecord(event: Event, index: number): void {
    const heading = this._companyRecordService.getHeading(index); // Await here
    const trigger = event.target as HTMLElement;
//    this.saveContactRecord(index, heading, ContactStatus.Active, trigger);
  }

  public saveContactRecord(id?: number, heading?: string,  trigger?: HTMLElement): void {
    //console.log("====>saveContactRecord ", this.contactStatusList);
    this.disableDiscardBtn = true;
    if (this.contactRecordModel.valid ) {
      // if (!contactStatus) {
        this.saveRecord.emit({ recModel: this.contactRecordModel});
    //  }
      this.contactRecordModel.markAsPristine();
      // switch (contactStatus) {
      //   case ContactStatus.Active:
      //     this.setActiveStatusEvent.emit({ id, heading, recModel: this.contactRecordModel, status: contactStatus, tempContactDetailsForm: this.contactDetailsForm, buttonTrigger: trigger });
      //     break;
      //   case ContactStatus.Remove:
      //     this.setRemoveStatusEvent.emit({ id, heading, recModel: this.contactRecordModel, status: contactStatus, tempContactDetailsForm: this.contactDetailsForm, buttonTrigger: trigger });
      //     break;
      //   case ContactStatus.Revise:
      //     this.contactRecordModel.markAsDirty();
      //     this.setReviseStatusEvent.emit({ id, heading, recModel: this.contactRecordModel, status: contactStatus, tempContactDetailsForm: this.contactDetailsForm, buttonTrigger: trigger });
      //     break;
      // }

    } else {
      // id is used for an error to ensure the record gets saved
      let temp = this.contactRecordModel.value.id;
      this.contactRecordModel.controls['id'].setValue(1);
      if (this.contactRecordModel.valid) {
        this.contactRecordModel.controls['id'].setValue(temp);
        this.saveRecord.emit({
          recModel: this.contactRecordModel,

        });

      } else {
        this.contactRecordModel.controls['id'].setValue(temp);
        this.showErrSummary = true;
        this.showErrors = true;
        document.location.href = '#contactErrorSummary' + temp;
      }
    }
  }

  // when user clicks the "Acitve Contact" button, if the current Contact Status is "REVISE",
  // it will show the "error.msg.revise.contact" error
  // if that is the only error on the record, we will allow user to continue to "Active Contact"
  // private _recordInvalidExcemption(contactStatus?: ContactStatus) {
  //   let returnValue: boolean = false;
  //   if (contactStatus) {
  //     if (
  //       contactStatus === ContactStatus.Active &&
  //       this.errorList.length === 1 &&
  //       this.errorList[0].currentError === 'error.msg.revise.contact'
  //     )
  //       returnValue = true;
  //   }
  //   return returnValue;
  // }

  /**
   * Changes the local model back to the last saved version of the contact
   */
  public showErrorSummary(): boolean {
    return this.showErrSummary && this.errorList.length > 0;
  }

  /**
   * show revise and remove contact button
   */
  // public isExternalNotNewContact(): boolean {
  //   return !this.isInternal && !this.isContactStatus(ContactStatus.New);
  // }

  // /**
  //  * internal site show active contact button
  //  */
  // public isInternalActiveContact(): boolean {
  //   return this.isInternal && !this.isContactStatus(ContactStatus.Remove);
  // }

  // /**
  //  * External site show save contact button
  //  */
  // public isExternalNewContact(): boolean {
  //   return !this.isInternal && this.isContactStatus(ContactStatus.New);
  // }

  // /**
  //  * Internal/External site show discard record button
  //  */
  // public isNewContact(): boolean {
  //   return this.isContactStatus(ContactStatus.New);
  // }

  // /**
  //  * Internal site show delete contact button
  //  */
  // public isInternalDeleteContact(): boolean {
  //   return this.isInternal && this.isContactStatus(ContactStatus.Remove);
  // }

  // public isContactSetToRemove(): boolean {
  //   return this.isContactStatus(ContactStatus.Remove);
  // }

  get speciesSubtypesDetailsForm() {
    return this.contactRecordModel.get('speciesSubtypesDetailForm') as FormGroup;
  }

  // private isContactStatus(status: ContactStatus) {
  //   const contStatusValue = this.contactDetailsForm.controls['status'].value;
  //   return contStatusValue === status;
  // }

  disableFormGroup() {
    if (this.contactRecordModel) {
      this.contactRecordModel.disable();
    }
  }

  enableFormGroup() {
    if (this.contactRecordModel) {
      this.contactRecordModel.enable();
    }
  }

  public disabledDiscardButton() {
    if (this.disableDiscardBtn && this.speciesSubtypesDetailsForm.dirty) {
      return false
    }
    else {
      return true;
    }
  }

  // public disabledReviseAndSaveButton() {
  //   if ( this.contactDetailsForm.dirty) {
  //     return false
  //   }
  //   else {
  //     return true;
  //   }
  // }
}

