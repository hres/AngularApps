import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SpecyAndSubType } from '../../models/ProductInformation';
import { AccordionComponent, ERR_TYPE_LEAST_ONE_REC, ErrorNotificationService, ErrorSummaryComponent, ErrorSummaryObject, getEmptyErrorSummaryObj, ICode, UtilsService } from '@hpfb/sdk/ui';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SpeciesSubtypesListService } from './species-subtypes-list-service';
import { SpeciesSubtypesRecordService } from '../species-subtypes-record-comonent/species-subtypes-record-service';
import { SpeciesSubtypesDetailsService } from '../species-subtypes-detail-component/species-subtypes-detail-service';
import { SpeciesSubtypesListBaseComponent } from './species-subtypes-list-base.component';
import * as $ from 'jquery';
import { GlobalService } from '../../global/global.service';

@Component({
  selector: 'app-species-subtypes-list-component',
  templateUrl: './species-subtypes-list-component.html',
  styleUrl: './species-subtypes-list-component.css',
  standalone: false

})
export class SpeciesSubtypesListComponent extends SpeciesSubtypesListBaseComponent implements OnInit, OnChanges, AfterViewInit {


  recModel: FormGroup;
  updatedContactDetailsForm: FormGroup;
  @Input() public specyModel: SpecyAndSubType[] = [];
  @Input() public showErrors: boolean;
  @Input() public loadFileIndicator;
  @Input() public xmlStatus;
  @Input() lang;
  @Input() helpTextSequences;
  @Input() disableForm: boolean;
  @Input() showSpeciesForVerterinary;
   vetSpecies: ICode[];
   specySubTypes: ICode[];
   @Input()   yesNoList: ICode[];

  @Output() public specyErrors = new EventEmitter();
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChild(AccordionComponent) accordionChild: AccordionComponent;

  private errorSummaryChild = null;
  public specyListForm: FormGroup;
  public errorList = [];

  private specyModelChangesSubscription: Subscription;

  popupId = 'specyPopup';
  specyHeading: string = '';
  popupTrigger: HTMLElement = null;
  rowIndexToRefocus: number;

  saveRecordPopupID: string = "saveRecordPopupID";
  discardChangePopupID: string = "discardChangePopupID";
  discardRecordPopupID: string = "discardRecordPopupID";
  saveToDraftXMLPopupID: string = "saveToDraftXMLPopupID";
  private specytId: number;
  discardRecordHeading: string;
  discardChangeHeading: string;
  saveToDraftXMLHeading: string;

  @Output() speciesChanged = new EventEmitter<SpecyAndSubType[]>();

  constructor(private _fb: FormBuilder, private translate: TranslateService, private _utilsService: UtilsService,  private _globalService: GlobalService,
    private _listService: SpeciesSubtypesListService, private _recordService: SpeciesSubtypesRecordService, private _errorNotificationService: ErrorNotificationService, private _detailsService: SpeciesSubtypesDetailsService) {
    super();
    this.specyListForm = this._listService.getReactiveModel(_fb);     // it's an empty formArray
  }

  ngOnInit() {
    // console.log("onInit")
    this.vetSpecies = this._globalService.vetSpecies;
    this.specySubTypes = this._globalService.specySubTypes;
    this.yesNoList = this._globalService.yesnoList;
  }

  ngAfterViewInit() {
    this._errorNotificationService.errorSummaryChanged$.subscribe((errors) => {
      this._processErrorSummaries(errors);
    });

    // when specyModel changes, check if "at least one specy record" rule is met and then execute emitting
    this.specyModelChangesSubscription = this._listService.specyModelChanges$.subscribe(changes => {

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
      this.specyListForm = this._listService.getReactiveModel(this._fb);     // reset specyListForm to an empty formArray
      this.newRecordIndicator = false;
    }
    if (changes['saveSpecy']) {
      this.saveSpecyRecord(changes['saveContact'].currentValue);
   }
    if (changes['specyModel'] && !changes['specyModel'].firstChange) {

      // when importing a file,  initing the contact list form with loaded contacts is triggered here
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
    if ( this.specyModel) {

      this._listService.setModelRecordList(this.specyModel);
      this._listService.initIndex(this.specyModel);

      if (!this.specyModel || this.specyModel.length === 0) {
        this._createFormContact();
      } else {
        this._listService.createFormRecordList(this.specyModel, this._fb, this.specyList, false);
               // expand the first record
          const firstFormRecord = this.specyList.at(0) as FormGroup;
          firstFormRecord.controls['expandFlag'].setValue(true);
      }

      this._listService.updateUIDisplayValues(this.specyList);
    }
  }

  get specyList(): FormArray {
    return <FormArray>(this.specyListForm.controls['contacts']);
  }

  /**
   * Adds an contact UI record to the specy List
   */
  public addSpecy(): void {
    const newIndex = this.specyList.length;
    let specyFocus = "";

    this._createFormContact();

    this._listService.updateUIDisplayValues(this.specyList);



    if (this.specyList.length >= 1) {
      specyFocus = "specy" + newIndex;
        } else {
          specyFocus = "specy" + 0;
        }
    setTimeout(() => {
    //  document.getElementById(contactFocus).focus()
    }, 0);
    this.showErrors = false;
  }

  private _createFormContact() {
    const formContact = this._listService.createContactFormRecord(this._fb);
    this.recModel = formContact;
    this.addRecord(formContact, this.specyList);
    this._listService.collapseFormRecordList(this._utilsService, this.specyList, formContact.controls['id'].value);
  }

  /**
   * Saves the record to the list. If new adds to the end of the list. Does no error Checking
   * @param record
   */
  public saveSpecyRecord(specyRecord) {
    let record: any = this.recModel;
    if ( this.updatedContactDetailsForm) {
      record = this.recModel;
     } else {
      record = specyRecord.recModel;
    }

    const recordId = this.saveRecord(record, this._listService, this.lang);

    // console.log(`recordId ${recordId} was saved`)

    // collapse this record
    for (let index = 0; index < this.specyList.controls.length; index++) {
      const element: FormGroup = this.specyList.controls[index] as FormGroup;
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


    //update specy list
    this.syncSpecies();

    this.specyListForm.markAsPristine();
    setTimeout(() => {
      document.getElementById('addSpecyBtn').focus()
    }, 0);
  }

  private _expandNextInvalidRecord(returnValue?: boolean): boolean | void {
    for (let index = 0; index < this.specyList.controls.length; index++) {
      const element = this.specyList.controls[index] as FormGroup;
      if (element.invalid) {
        element.controls['expandFlag'].setValue(true);
        return returnValue ? true : undefined;
      }
    }
    return returnValue ? false : undefined;
  }

  private _collapseValidRecords(): void {
    this.specyList.controls.forEach((ctrl) => {
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
    if(this.showSpeciesForVerterinary ){



      const oerr: ErrorSummaryObject = getEmptyErrorSummaryObj();
      oerr.index = 0;
      oerr.type = ERR_TYPE_LEAST_ONE_REC;

      // If there are no current records, or if there's only one record and it is set to REMOVE -> Error link is set to Add Record button
      // Otherwise, set it to the contact records component
      if ( this.specyList.length === 0 ||
        (this.specyList.length === 1 )) {
        oerr.tableId = 'addSpecyBtn';
      } else {
        oerr.tableId = 'specyRecords';
      }

      oerr.label = 'error.msg.specy.one.record';
      emitErrors.push(oerr);


    } else {
      if (checkErrorSummary && this.errorSummaryChild) {
        emitErrors.push(this.errorSummaryChild);
      }
    }

     this.specyErrors.emit(emitErrors);
  }

  /***
   * Loads the last saved version of the record data
   * @param record
   */
  public revertSpecy(id): void {
    let discardMsg = "";

    let modelRecord = this._listService.getModelRecord(this.specytId);
    if (!modelRecord) {
      modelRecord = this._listService.getEmptyContactModel();
      modelRecord.id = this.specytId;
    }
    let rec = this.getRecord(this.specytId, this.specyList);
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

//update specy list
this.syncSpecies();

    this.updatedContactDetailsForm.markAsPristine()
    // jQuery( "#" + this.discardPopupId ).trigger( "open.wb-overlay" );
  }

  /**
   * Deletes a record from the UI list and the model list, if it exists
   * @param id
   */
  public deleteSpecy(id): void {
    let deletedRec = this.getRecord(this.specytId, this.specyList);
    this.deleteRecord(this.specytId, this.specyList, this._listService);
    this.specyListForm.markAsPristine();
    // since the specy record is deleted, we should also remove its ErrorSummary if there is any
    this._errorNotificationService.removeErrorSummary(this.specytId.toString());
    this._listService.updateUIDisplayValues(this.specyList);
    this._expandNextInvalidRecord(false);

        //update specy list
        this.syncSpecies();

    document.location.href = '#contactListTable';
    setTimeout(() => {
      document.getElementById('addSpecyBtn').focus()
    }, 100);


  }

  /**
   * check if its record exists
   */
  public disableAddButton(): boolean {
    // console.log("form is invalid: ", !this.specyListForm.valid,  "form has errors: ", this.errorList.length>0,
    //   "form is dirty: ", this.specyListForm.dirty);
    return (!this.specyListForm.valid || this.errorList.length > 0 || this.specyListForm.dirty);
  }

  /**
   * Changes the local model back to the last saved version of the requester
   */
  public showErrorsSummary(): boolean {
    return (this.showErrors && this.errorList.length > 0);
  }

  handleRowClick(event: any) {
    const clickedIndex = event.index;
    const clickedRecordState = event.state;
    this.rowIndexToRefocus = event.index;

    // console.log(this._utilsService.logFormControlState(this.specyListForm))

    if (this.specyListForm.pristine) {
      this.specyList.controls.forEach((element: FormGroup, index: number) => {
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
    this.specyModelChangesSubscription.unsubscribe();
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

  discarChangeSpecyConfirmation(event) {
    this.specytId = event.id;
    this.discardChangeHeading = event.heading;
    this.popupTrigger = event.buttonTrigger;
    this.openConfirmationPopup(this.discardChangePopupID);
    this.updatedContactDetailsForm = event.tempContactDetailsForm;
    this.updatedContactDetailsForm.markAsDirty()
  }
  discarRecordeSpecyConfirmation(event) {
    this.specytId = event.id;
    this.discardRecordHeading = event.heading;
    this.popupTrigger = event.buttonTrigger;
    this.openConfirmationPopup(this.discardRecordPopupID);
  }


  disableFormGroup() {
    if (this.specyListForm) {
      this.specyListForm.disable();
    }
  }

  enableFormGroup() {
    if (this.specyListForm) {
      this.specyListForm.enable();
    }
  }

  private _handlePostEnableBehavior(): void {
    // collapse valid records
    this._collapseValidRecords();
    // expand next invalid record
    const expanded = this._expandNextInvalidRecord(true);
    // if no invalid record exists, expand the first
    if (!expanded) {
      const firstFormRecord = this.specyList.at(0) as FormGroup;
      firstFormRecord.controls['expandFlag'].setValue(true);
    }
  }



private syncSpecies() {
  const list = this._listService.getModelRecordListFromForm(this.specyList);
  this.speciesChanged.emit(list);
}

}
