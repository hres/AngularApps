import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { IRecordService } from "@hpfb/sdk/ui";
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
            recordId: -1, // Used to assign an id to record when it's first created
            isNew: true,
            expandFlag: true,
            lastSavedState: null, // store the last saved state of the contactInfo for reverting function
            heading: null,
            companyInfo: fb.group({
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
    
    /**
   * A method to make an error summary object for "role is misisng" err. 
   * A custom validator in the Form Array, contacts, is initialized before the service injections.
   * Company role list is not fetched when validator is called -> would need an asynch validator...?
   * For now, a computed signal is used when a role has not been selected. The logic to determine if a role is missing
   * requires the list of company roles from the Global Service. Global Service does not load before custom
   * validator, therefore signals + method ot make errobj are used.
   */
    makeMissingRoleError() : ErrorSummaryObject{
        let oerr : ErrorSummaryObject = null;
    
        oerr = getEmptyErrorSummaryObj();
        oerr.index = 0;
        oerr.tableId = 'contactListTable';
        oerr.type = ERR_TYPE_LEAST_ONE_REC;
        oerr.label = 'error.msg.contactRolesMissing';
        oerr.componentId = 'contact';
        oerr.error = 'required';
      
        return oerr;
      }

}