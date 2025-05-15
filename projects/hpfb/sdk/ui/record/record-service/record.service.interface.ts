import { FormBuilder, FormGroup } from "@angular/forms";

export interface IRecordService {
    createRecordFormGroup(fb: FormBuilder) : FormGroup | null;
    setRecordsFormArrValue(val: any[]): void;
    getHeading(index : number, formGroup : FormGroup) : void;
}