import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IContactInformation } from "../models/transaction";
import { AddressDetailsService } from "../address/address.details/address.details.service";
import { ContactDetailsService } from "../contact/contact.details/contact.details.service";

@Injectable()
export class RegulatoryContactService {

    constructor(private _addressDetailsService: AddressDetailsService,
                private _contactDetailsService: ContactDetailsService) {

    }
    public static getContactForm(fb:FormBuilder) {
        if (!fb) {
          return null;
       }
       return fb.group({
        isSigned3rdParty: [
            null,
            [Validators.required]
        ],
        companyName: [
            null,
            [Validators.required]
        ],
        confirmContactValid: [
            null,
            [Validators.required]
        ]
       })
    }

    public mapFormModelToDataModel(formValue : any, dataModel : IContactInformation) {
        dataModel.is_activity_changes = formValue['isSigned3rdParty'];
        dataModel.company_name = formValue['companyName'];
        dataModel.confirm_regulatory_contact = formValue['confirmContactValid'];
    }

    public mapDataModelToFormModel(dataModel : IContactInformation, formRecord: FormGroup): void {
        formRecord.controls['isSigned3rdParty'].setValue(dataModel.is_activity_changes);
        formRecord.controls['companyName'].setValue(dataModel.company_name);
    }
 
}
