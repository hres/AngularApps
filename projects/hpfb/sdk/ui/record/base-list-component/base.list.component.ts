import { AfterViewInit, Component, inject, Inject, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { IBaseList } from "./base.list.interface";
import { FormGroup, FormArray, FormBuilder } from "@angular/forms";
import { IRecordService } from "../record-service/record.service.interface";
import { OutputRecord, RecordFormGroup } from "../record-model/record.model";
import { BaseListService } from "../base-list-service/base.list.service";
import { BaseComponent } from "../../component-base/base.component"

import $ from 'jquery';

@Component({
    template: ''
})
export abstract class BaseListComponent<T extends OutputRecord> extends BaseComponent implements IBaseList<T>, AfterViewInit {
    @Input() recordList: T[];
    @Input() showErrors: boolean;
    @Input() isInternal?: boolean;

    recordFormGroup: FormGroup;
    errorSummaryChild: any;

    abstract statusMessage : string;
    abstract records: string;
    abstract recordInfo: string;
    abstract recordService: IRecordService;
    abstract popupId: string;
    abstract errorList: [];

    constructor(private _fb: FormBuilder, 
        @Inject(BaseListService) protected listService: BaseListService) {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['recordList']) {
            this._init(changes['recordList'].currentValue);
        }
    }

    private _init(recordData: T[]) {
        // Clear existing controls
      this.recordFormArray.clear();
  
      if (recordData && recordData.length !== 0) {
          if (recordData.length > 0) {
            recordData.forEach((record, index) => {
              const group = this.recordService.createRecordFormGroup(this._fb);
  
              // Set values after defining the form controls
              group.patchValue({
                id: record.id,
                recordId: index + 1,
                isNew: false,
                expandFlag: false,
              });
              
              this._patchRecordInfoValue(group, record);
              this._patchLastSavedStateValue(group.controls['lastSavedState'], record);
  
              this.recordFormArray.push(group);
            });
            this.listService.setMaxId(recordData.length);
          }
      } else {
        if (!this.isInternal) {
            const group = this.recordService.createRecordFormGroup(this._fb);
            group.patchValue({
                recordId: this.listService.getId()
            })
            this.recordFormArray.push(group);
            const firstFormRecord = this.recordFormArray.at(0) as FormGroup;
            firstFormRecord.controls['expandFlag'].setValue(true);
        }
      }
      this.recordService.setRecordsFormArrValue(this.getRecordFormArrValues());
  
      // Set the list of form groups
      this.listService.setList(this.recordFormArray.controls as FormGroup[]);
    }

    protected abstract _patchRecordInfoValue(group, outputModel);
    protected abstract _patchLastSavedStateValue(lastSavedStateFormControl, outputModel);

    addRecord(): void {
        const group = this.recordService.createRecordFormGroup(this._fb);
        group.patchValue({
            recordId: this.listService.getId()
        })
        this.recordFormArray.push(group);    
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
    }

    private _expandNextInvalidRecord(){
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

    deleteRecord(index: number): void {
        const group = this.recordFormArray.at(index) as RecordFormGroup;
        const recordInfo = this.getRecordInfo(group);
        recordInfo.reset();
        this.recordFormArray.removeAt(index);
    
        this.recordService.setRecordsFormArrValue(this.getRecordFormArrValues());
    }

    revertRecord(event: any): void {
       const index = event.index;
        const id = event.id;
        const group = this.recordFormArray.at(index) as RecordFormGroup;
        const recordInfo = this.getRecordInfo(group);
        // Revert to the last saved state
        const lastSavedState = group.get('lastSavedState').value;
        recordInfo.patchValue(lastSavedState); 
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