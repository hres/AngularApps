import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { IRecordService } from "../record-base/record.service.interface";
import { Validators } from "@angular/forms";
import { ContactDetailsService } from "@hpfb/pbv";
import { inject, signal } from "@angular/core";
import { ContactRecord } from "../models/Company";
import { ErrorSummaryObject, ERR_TYPE_LEAST_ONE_REC, getEmptyErrorSummaryObj, ValidationService } from "@hpfb/sdk/ui";

@Injectable()
export class CompanyContactService implements IRecordService{
    _contactDetailsService = inject(ContactDetailsService);
    contactFormArrValue = signal<any[]>([]);

    createRecordFormGroup(fb: FormBuilder): FormGroup<any> {

        if (!fb) {
            return null;
        }
    
        return fb.group({
            id: -1,
            isNew: true,
            expandFlag: true,
            lastSavedState: null, // store the last saved state of the contactInfo for reverting function
            companyInfo: fb.group({
                manufacturer: [null],
                mailing: [null],
                billing: [null],
                companyRoles: fb.array([], [ValidationService.atLeastOneCheckboxSelected]),
                selectedCompanyRoles: [''],
                contactDetails: this._contactDetailsService.getReactiveModel(fb)
                }, { updateOn: 'change' }
            )
        });
    }

    setRecordsFormArrValue(val: any[]): void {
        this.contactFormArrValue.set(val);
    }
    
    makeMissingRoleError() : ErrorSummaryObject{
        let oerr : ErrorSummaryObject = null;
    
        oerr = getEmptyErrorSummaryObj();
        oerr.index = 0;
        oerr.tableId = 'contactListTable';
        oerr.type = ERR_TYPE_LEAST_ONE_REC;
        oerr.label = 'error.msg.contactRolesMissing';
      
        return oerr;
      }

}