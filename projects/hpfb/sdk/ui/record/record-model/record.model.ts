import { FormGroup } from "@angular/forms";
export interface RecordFormGroup extends OutputRecord, FormGroup {
    isNew: boolean;
    expandFlag: boolean;
    lastSavedState: any;
    recordInfo: FormGroup;
    recordId: number;
}
export interface OutputRecord {
    id: number;
}