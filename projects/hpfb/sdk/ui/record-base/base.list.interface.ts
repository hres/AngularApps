import { SimpleChanges } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { OutputRecord } from "./record.model";

export interface IBaseList<T extends OutputRecord> {
    recordList : T[];
    recordFormGroup : FormGroup;
    showErrors : boolean;
    errorSummaryChild;

    ngOnChanges(changes : SimpleChanges) : void;
    ngAfterViewInit() : void;
    
    addRecord() : void;
    saveRecord(event : any) : void; // TODO
    deleteRecord(index : number) : void;
    revertMaterial(event : any): void; // TODO
    handleRowClick(event : any) : void; // TODO

    showError(errs) : void; // TODO
    disableAddButton() : boolean;
    openPopup() : void;

    get recordFormArray() : FormArray;
    getRecordInfo(recordFormGroup : FormGroup) : FormGroup;
    getRecordFormArrValues() : any; // TODO 
}