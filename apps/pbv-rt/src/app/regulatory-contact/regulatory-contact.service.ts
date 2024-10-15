import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable()
export class RegulatoryContactService {
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
        routingId: null,
        confirmContactValid: [
            null,
            [Validators.required]
        ]
       })
    }

    public mapFormModelToDataModel() {

    }

    public mapDataModelToFormModel(dataModel, formRecord: FormGroup): void {

    }
 
}
