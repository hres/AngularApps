import { AfterViewInit, Component, Inject, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { IBaseList } from "./base.list.interface";
import { FormGroup, FormArray, FormBuilder } from "@angular/forms";
import { UtilsService } from "../utils/utils.service";
import { ErrorNotificationService } from "../error-msg/error.notification.service";
import { BaseComponent } from "../component-base/base.component";
import { IRecordService } from "./record.service.interface";
import { OutputRecord, RecordFormGroup } from "./record.model";

@Component({
    template: ''
})

export abstract class BaseListComponent<T extends OutputRecord> extends BaseComponent implements IBaseList<T>, AfterViewInit {
    recordList: T[];
    recordFormGroup: FormGroup;

    showErrors: boolean;
    errorSummaryChild: any;

    abstract formArrayName: string;
    abstract formGroupName: string; // Might not be needed

    abstract records: string;
    abstract recordInfo: string;

    abstract recordService: IRecordService;

    abstract popupId: string;

    constructor(private _fb: FormBuilder) {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes[this.formArrayName]) {
            this._init(changes[this.formArrayName].currentValue);
        }
    }

    private _init(recordData: T[]) {
        // Clear existing controls
      this.recordFormArray.clear();
  
      if (recordData.length > 0) {
          if (recordData) {
            recordData.forEach(record => {
              const group = this.recordService.createRecordInfoFormGroup(this._fb);
  
              // Set values after defining the form controls
              group.patchValue({
                id: record.id,
                isNew: false,
                expandFlag: false,
              });
  
              this._patchRecordInfoValue(group, record);
  
              this.recordFormArray.push(group);
            });
          }
      } else {
        const group = this.recordService.createRecordInfoFormGroup(this._fb);
        this.recordFormArray.push(group);
        const firstFormRecord = this.recordFormArray.at(0) as FormGroup;
        firstFormRecord.controls['expandFlag'].setValue(true);
      }
      this.recordService.setRecordsFormArrValue(this.getRecordFormArrValues());
  
      // Set the list of form groups
      this.recordService.setList(this.recordFormArray.controls as FormGroup[]);
    }

    protected abstract _patchRecordInfoValue(group: FormGroup, outputModel);

    // BaseComponent is missing error notification service 
    // ngAfterViewInit(): void {
    //     throw new Error("Method not implemented.");
    // }

    addRecord(): void {
        const group = this.recordService.createRecordInfoFormGroup(this._fb);
        this.recordFormArray.push(group);    
    }

    saveRecord(event: any): void {
        const index = event.index;

        const group = this.recordFormArray.at(index) as RecordFormGroup;
        // if this is a new record, assign next available id, otherwise, use it's existing id
        const id = group.get('isNew').value? this.recordService.getNextId(): group.get('id').value
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

    revertMaterial(event: any): void {
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
        return ( this.showErrors ||  this.recordFormGroup.dirty );
    }

    openPopup(): void {
        jQuery( "#" + this.popupId ).trigger( "open.wb-overlay" );
    }

    get recordFormArray(): FormArray {
        return this.recordFormGroup.get(this.records) as FormArray;
    }

    getRecordInfo(recordFormGroup: FormGroup): FormGroup {
        return recordFormGroup.get('recordInfo') as FormGroup;
    }

    getRecordFormArrValues() {
        return this.recordFormArray.value;
    }
    
}