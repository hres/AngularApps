import { FormBuilder, FormGroup } from "@angular/forms";
import { BaseListService } from "../record-list/base.list.service";

export interface IRecordService extends BaseListService{
    createRecordInfoFormGroup(fb: FormBuilder) : FormGroup | null;
    setRecordsFormArrValue(val: any[]): void
}