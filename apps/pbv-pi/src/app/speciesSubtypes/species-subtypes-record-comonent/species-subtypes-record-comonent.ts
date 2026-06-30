import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
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


  public specyRecordModel: FormGroup;
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


  @Output() errors = new EventEmitter();
  @ViewChildren(ErrorSummaryComponent)
  errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChildren(ControlMessagesComponent)
  msgList: QueryList<ControlMessagesComponent>;

  public updateChild: number = 0;
  public sequenceNum: number = 0;
  public errorList = [];
  private childErrorList: Array<any> = [];
  private parentErrorList: Array<any> = [];
  public showErrSummary: boolean;
  private errorSummaryChild: ErrorSummaryComponent = null;

  public headingLevel = 'h4';
  headingPreamble: string = 'heading.specyDetails';
  headingPreambleParams: any;
  translatedParentLabel: string;
  disableDiscardBtn: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
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
    this.specyRecordModel = this.cRRow;
    const speciesSubtypeForm = <FormGroup>this.cRRow.controls['speciesSubtypeDetail'];
    if (speciesSubtypeForm.controls['species'].value) {
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
      console.warn('Specy List found >1 Error Summary ' + list.length);
    }
    this.errorSummaryChild = list.first;
    // notify subscriber(s) that contact records' error summaries are changed
    this._errorNotificationService.updateErrorSummary(
      this.specyRecordModel.controls['id'].value,
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
      // ✅ NEW: Handle cRRow changes
      if (changes['cRRow'] && changes['cRRow'].currentValue) {
        this.specyRecordModel = changes['cRRow'].currentValue;
        this.headingPreambleParams = this.specyRecordModel.get('seqNumber')?.value || this.j + 1;
        this.translatedParentLabel = this._translateService.instant(
          this.headingPreamble,
          { seqnumber: this.headingPreambleParams }
        );

      }
    if (changes['showErrors']) {
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
   * Changes the local model back to the last saved version of the specy
   */
  public revertSpecyRecord(event: Event, index: number): void {
    const heading = this._companyRecordService.getHeading(index); // Await here
    const trigger = event.target as HTMLElement;

    this.discardChangeEvent.emit({
      id: this.specyRecordModel.value.id,
      heading: heading,
      buttonTrigger: trigger,
      tempContactDetailsForm: this.speciesSubtypesDetailsForm,
    });
     this.disableDiscardBtn = true
  }

  /***
   * Deletes the specy reocord with the selected id from both the model and the form
   */
  public deleteSpecyRecord(event: Event, index: number): void {
    this.errorSummaryChild = null;
    const heading = this._companyRecordService.getHeading(index); // Await here
    const trigger = event.target as HTMLElement;

    this.discardRecordEvent.emit({
      id: this.specyRecordModel.value.id,
      heading: heading,
      buttonTrigger: trigger
    });
    //this._emitErrors();
   }



  public saveSpecyRecord(id?: number, heading?: string,  trigger?: HTMLElement): void {

    this.disableDiscardBtn = true;
    if (this.specyRecordModel.valid ) {
         this.saveRecord.emit({ recModel: this.specyRecordModel});
       this.specyRecordModel.markAsPristine();


    } else {
      // id is used for an error to ensure the record gets saved
      let temp = this.specyRecordModel.value.id;
      this.specyRecordModel.controls['id'].setValue(1);
      if (this.specyRecordModel.valid) {
        this.specyRecordModel.controls['id'].setValue(temp);
        this.saveRecord.emit({
          recModel: this.specyRecordModel,

        });

      } else {
        this.specyRecordModel.controls['id'].setValue(temp);
        this.showErrSummary = true;
        this.showErrors = true;
        document.location.href = '#contactErrorSummary' + temp;
      }
    }
  }



  public showErrorSummary(): boolean {
    return this.showErrSummary && this.errorList.length > 0;
  }



  get speciesSubtypesDetailsForm() {
    return this.specyRecordModel.get('speciesSubtypeDetail') as FormGroup;
  }

  disableFormGroup() {
    if (this.specyRecordModel) {
      this.specyRecordModel.disable();
    }
  }

  enableFormGroup() {
    if (this.specyRecordModel) {
      this.specyRecordModel.enable();
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

}

