import { inject, Injectable, signal } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AddressDetailsService } from "@hpfb/pbv";
import { ErrorSummaryObject, ERR_TYPE_LEAST_ONE_REC, getEmptyErrorSummaryObj, ValidationService, IRecordService } from "@hpfb/sdk/ui";
import { PbvValidationService } from "@hpfb/pbv";

@Injectable()
export class CompanyAddressService implements IRecordService{
    _addressDetailsService = inject(AddressDetailsService);
    addressFormArrValue = signal<any[]>([]);

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
            addressInfo: fb.group({
                companyName: [null, [Validators.required]],
                businessNum: ['', [ PbvValidationService.businessNumValidator]],
                addressCompanyRoles: fb.array([], [ValidationService.atLeastOneCheckboxSelected]),
                selectedAddressCompanyRoles: [''],
                addressDetails: this._addressDetailsService.getReactiveModel(fb)
                }, { updateOn: 'change' }
            )
        });
    }

    setRecordsFormArrValue(val: any[]): void {
        this.addressFormArrValue.set(val);
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
        oerr.tableId = 'addressCompanyRoles0';
        oerr.type = ERR_TYPE_LEAST_ONE_REC;
        oerr.label = 'error.msg.addressRolesMissing';
        oerr.componentId = 'address';
        oerr.error = 'required';

        
        return oerr;
    }
    
}