import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TransactionEnrol } from "../models/transaction";

@Injectable()
export class RegulatoryContactService {

    constructor() {

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

    public mapFormModelToDataModel(formValue : any, dataModel : TransactionEnrol) {
        dataModel.is_activity_changes = formValue['isSigned3rdParty'];
        dataModel.company_name = formValue['companyName'];
        dataModel.confirm_regulatory_contact = formValue['confirmContactValid'] == true ? 'Y': undefined;;
    }

    public mapDataModelToFormModel(dataModel : TransactionEnrol, formRecord: FormGroup): void {
        formRecord.controls['isSigned3rdParty'].setValue(dataModel.is_activity_changes);
        formRecord.controls['companyName'].setValue(dataModel.company_name);
    }
 
}
