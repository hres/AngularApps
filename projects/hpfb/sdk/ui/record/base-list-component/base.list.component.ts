import { AfterViewInit, Component, EventEmitter, inject, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { IBaseList } from "./base.list.interface";
import { FormGroup, FormArray, FormBuilder } from "@angular/forms";
import { IRecordService } from "../record-service/record.service.interface";
import { OutputRecord, RecordFormGroup } from "../record-model/record.model";
import { BaseListService } from "../base-list-service/base.list.service";
import { BaseComponent } from "../../component-base/base.component"

import $ from 'jquery';
import { RECORD_ACTIONS } from "../../common.constants";
import { RecordDiscardService } from "../record-action-service/record-discard.service";
import { RecordDeleteService } from "../record-action-service/record-delete.service";

@Component({
    template: '',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export abstract class BaseListComponent<T extends OutputRecord> extends BaseComponent implements IBaseList<T>, AfterViewInit {
    @Input() recordList: T[];
    @Input() showErrors: boolean;
    @Input() isInternal?: boolean;
    @Input() lang: string;

    recordFormGroup: FormGroup;
    errorSummaryChild: any;

    discardHeading: string;
    discardIndex: number;
    discardConfirmed: number;
    deleteHeading: string;
    deleteIndex: number;
    deleteConfirmed: number;

    abstract statusMessage : string;
    abstract statusMessageSave : string;
    abstract statusMessageDiscard : string;
    abstract statusMessageDelete : string;

    abstract focusField : string; // Field to focus on after clicking "Add Record"
    abstract addButton : string; // Button id to focus on after clicking delete/save
    abstract records: string;
    abstract recordInfo: string;
    abstract recordService: IRecordService;
    abstract popupId: string;
    abstract discardPopupId: string;
    abstract deletePopupId: string;
    abstract errorList: [];
    private cdr = inject(ChangeDetectorRef);

    constructor(private _fb: FormBuilder,
        @Inject(BaseListService) protected listService: BaseListService,
        private _recordDiscardService: RecordDiscardService,
        private _recordDeleteService: RecordDeleteService,
      ) {
        super();
    }


  ngOnChanges(changes: SimpleChanges): void {
    const list = changes['recordList']?.currentValue;

    if (!Array.isArray(list)) {
        return;
    }

    void this._init(list);
}

    private async _init(recordData: T[]): Promise<void> {
        // Clear existing controls
        this.recordFormArray.clear();
        let maxId = -1;

        if (recordData && recordData.length !== 0) {
            this.recordFormGroup.markAsPristine();
            for (const [index, record] of recordData.entries()) {
                const group = this.recordService.createRecordFormGroup(this._fb);

                // Set values after defining the form controls
                group.patchValue({
                    id: record.id,
                    recordId: record.id,
                    isNew: false,
                    expandFlag: false,
                });
                this._patchRecordInfoValue(group, record);
                this._patchLastSavedStateValue(group.controls['lastSavedState'], record);

                const heading = await this.recordService.getHeading(index, group);
                group.get('heading').setValue(heading);

                this.recordFormArray.push(group);
                // Parse the ID as a number and update maxId if necessary
                maxId = Math.max(Number(record.id), maxId);
                this.listService.setMaxId(maxId);
            }

            // Now it's safe to expand the first invalid record
            this._expandInvalidRecordUponLoading();

        } else {
            if (!this.isInternal) {
                const group = this.recordService.createRecordFormGroup(this._fb);
                group.patchValue({
                    recordId: this.listService.getId()
                });
                this.recordFormArray.push(group);
                const firstFormRecord = this.recordFormArray.at(0) as FormGroup;
                firstFormRecord.controls['expandFlag'].setValue(true);
            }
        }

        this.recordService.setRecordsFormArrValue(this.getRecordFormArrValues());

        // Set the list of form groups
        this.listService.setList(this.recordFormArray.controls as FormGroup[]);

           // Refresh view after async initialization completes
       this.cdr.detectChanges();


    }

    protected abstract _expandInvalidRecordUponLoading();
    abstract expandAllInvalidRecords();
    protected abstract _patchRecordInfoValue(group, outputModel);
    protected abstract _patchLastSavedStateValue(lastSavedStateFormControl, outputModel);

    addRecord(): void {
        const group = this.recordService.createRecordFormGroup(this._fb);
        const newIndex = this.recordFormArray.length;
        let recordFocus = "";

        group.patchValue({
            recordId: this.listService.getId()
        })
        this.recordFormArray.push(group);

        if (this.recordFormArray.length >= 1) {
            recordFocus = this.focusField + newIndex;
          } else {
            recordFocus = this.focusField + 0;
        }

        setTimeout(() => {
            document.getElementById(recordFocus).focus()
        }, 0);
    }

    saveRecord(event: any): void {
        const index = event.index;
        const group = this.recordFormArray.at(index) as RecordFormGroup;
        // if this is a new record, assign next available id, otherwise, use it's existing id
        const id = group.get('isNew').value? this.listService.getNextId(): group.get('id').value
        group.patchValue({
        id: id,
        isNew: false,
        expandFlag: false,    // collapse this record
        });
        const recordInfo = this.getRecordInfo(group);
        // Update lastSavedState with the current value of contactInfo
        group.get('lastSavedState').setValue(recordInfo.value);
        this._expandNextInvalidRecord();
        this.recordService.setRecordsFormArrValue(this.getRecordFormArrValues());

        this._setStatusMessage(RECORD_ACTIONS.SAVE, id);

        setTimeout(() => {
            document.getElementById(this.addButton).focus();
        }, 0);
    }

    protected _expandNextInvalidRecord(){
        // expand next invalid record
        for (let index = 0; index < this.recordFormArray.controls.length; index++) {
         const group: RecordFormGroup = this.recordFormArray.controls[index] as RecordFormGroup;
         if (group.invalid) {
          group.controls['expandFlag'].setValue(true);
          this.recordFormGroup.markAsDirty();
            break;
         }
       }
    }

    deleteRecord(event:any): void {
        const index = this.deleteIndex;
        const id = this.deleteIndex + 1;
        const group = this.recordFormArray.at(index) as RecordFormGroup;
        const recordInfo = this.getRecordInfo(group);
        recordInfo.reset();
        this.recordFormArray.removeAt(index);

        this.recordService.setRecordsFormArrValue(this.getRecordFormArrValues());

        this._setStatusMessage(RECORD_ACTIONS.DELETE, id);
        //this.deleteConfirmed = index;
        this.onDeleteConfrmed(index)

        setTimeout(() => {
            document.getElementById(this.addButton)?.focus();
        }, 0);
    }

    revertRecord(event: any): void {
        const index = this.discardIndex;
        const id = this.discardIndex + 1;
        const group = this.recordFormArray.at(index) as RecordFormGroup;
        const recordInfo = this.getRecordInfo(group);
        // Revert to the last saved state
        const lastSavedState = group.get('lastSavedState').value;
        recordInfo.patchValue(lastSavedState);

        this._setStatusMessage(RECORD_ACTIONS.DISCARD, id);

         const discardMsg = this.statusMessage;

         setTimeout(() => {
             this.statusMessage = ''; // Temporarily clear the message
             setTimeout(() => {
                 this.statusMessage = discardMsg; // Restore the message
             }, 50); // Small delay before restoring
           }, 50);

        this.onDiscardConfirmed(index);
    }

    onDiscardConfirmed(index: number) {
        this._recordDiscardService.confirmDiscard(index);
    }

    onDeleteConfrmed(index: number) {
        this._recordDeleteService.confirmDelete(index);
    }

    discardRecordConfirmation(event:any) {
        this.discardIndex = event.index;
        this.discardHeading = event.heading;
        jQuery( "#" + this.discardPopupId ).trigger( "open.wb-overlay" );
    }

    deleteRecordConfirmation(event:any) {
        this.deleteIndex = event.index;
        this.deleteHeading = event.heading;
        jQuery( "#" + this.deletePopupId ).trigger( "open.wb-overlay" );
    }

    onDiscardHandled(event:any) {
        // this.discardConfirmed = null;
    }

    onDeleteHandled(event:any) {
        if (event) {
          for (let index = 0; index < this.recordFormArray.controls.length; index++) {
            const group: RecordFormGroup = this.recordFormArray.controls[index] as RecordFormGroup;
            if (!group.invalid) {
                group.controls['expandFlag'].setValue(false);
            }
          }
        }
      }

    handleRowClick(event: any): void {
        const clickedIndex = event.index;
        const clickedRecordState = event.state;
        if (this.recordFormGroup.pristine) {
        this.recordFormArray.controls.forEach( (element: FormGroup, index: number) => {
            if (clickedIndex===index) {
            element.controls['expandFlag'].setValue(!clickedRecordState)
            }
        })
        } else {
        this.openPopup();
        }
    }

    showError(errs: any): void {
        if (errs.length > 0) {
            this.showErrors = true;
        } else {
            this.showErrors = false;
        }
    }

    disableAddButton(): boolean {
        return ( this.recordFormGroup.dirty || !this.recordFormGroup.valid  || this.errorList?.length > 0);
    }

    openPopup(): void {
        jQuery( "#" + this.popupId ).trigger( "open.wb-overlay" );
    }

    private _setStatusMessage(action : string, id : number): void {
        const actionMessages = {
            'SAVE': {
              en: `${this.statusMessageSave} ${id} has been saved.`,
              fr: `Enregistrement ${this.statusMessageSave} ${id} a été sauvegardé.`
            },
            'DELETE': {
              en: `${this.statusMessageDelete} ${id} has been deleted.`,
              fr: `Enregistrement ${this.statusMessageDelete} ${id} a été supprimé.`
            },
            'DISCARD': {
              en: `${this.statusMessageDiscard} ${id} changes have been discarded.`,
              fr: `Les modification apportées ${this.statusMessageDiscard} ${id} ont été annulées.`
            }
          };

        this.statusMessage = actionMessages[action][this.lang];
    }

    get recordFormArray(): FormArray {
        return this.recordFormGroup.get(this.records) as FormArray;
    }

    getRecordInfo(recordFormGroup: FormGroup): FormGroup {
        return recordFormGroup.get(this.recordInfo) as FormGroup;
    }

    getRecordFormArrValues() {
        return this.recordFormArray.value;
    }

}