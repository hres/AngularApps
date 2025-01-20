import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { IRecordService } from "../record-base/record.service.interface";
import { Validators } from "@angular/forms";
import { AddressDetailsService } from "@hpfb/pbv";
import { inject, signal } from "@angular/core";
import { ContactRecord } from "../models/Company";
import { ValidationService } from "@hpfb/sdk/ui";

@Injectable()
export class CompanyContactService implements IRecordService{
    _addressDetailsService = inject(AddressDetailsService);
    
    contactFormArrValue = signal<any[]>([]);

    createRecordFormGroup(fb: FormBuilder): FormGroup<any> {
        const addressDetails = this._addressDetailsService.getReactiveModel(fb);

        if (!fb) {
            return null;
        }
    
        return fb.group({
            id: -1,
            isNew: true,
            expandFlag: true,
            lastSavedState: null, // store the last saved state of the contactInfo for reverting function
            companyInfo: fb.group({
                manufacturer: [null, Validators.required],
                mailing: [null, Validators.required],
                billing: [null, Validators.required],
                companyRoles: fb.array([], [ValidationService.atLeastOneCheckboxSelected]),
                selectedCompanyRoles: [''],
                ...addressDetails
                }, { updateOn: 'change' }
            )
        });
    }

    setRecordsFormArrValue(val: any[]): void {
        this.contactFormArrValue.set(val);
    }

    mapContactModelToOutputModel(contactRecord: any, outputRecord: ContactRecord) {

    }

    mapOutputModelToContactModel(contactRecord: any, outputRecord: ContactRecord) {

    }
    
}