import { FormGroup } from "@angular/forms";

export interface RecordFormGroup extends OutputRecord, FormGroup {
    isNew: boolean;
    expandFlag: boolean;
    lastSavedState: any;
    recordInfo: FormGroup;
}

export interface OutputRecord {
    id: number;
}