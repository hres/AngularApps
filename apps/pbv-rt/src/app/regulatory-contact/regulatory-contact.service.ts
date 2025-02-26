import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AddressDetailsService, ContactDetailsService } from "@hpfb/pbv";
import { ICode } from "@hpfb/sdk/ui";
import { NO, YES } from "../app.constants";
import { GlobalService } from "../global/global.service";
import { TransactionEnrol } from "../models/transaction";

@Injectable()
export class RegulatoryContactService {

    constructor(private _addressDetailsService: AddressDetailsService,
                private _contactDetailsService: ContactDetailsService,
                private _globalService: GlobalService) {

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
            [Validators.requiredTrue]
        ]
       })
    }

    public mapFormModelToDataModel(formValue : any, dataModel : TransactionEnrol, addressFormGroupValue, contactFormGroupValue) {
        const lang = this._globalService.currLanguage;
        const languageList: ICode[] = this._globalService.languageList;
        const countryList: ICode[] = this._globalService.countryList;
        const combinedProvStatList: ICode[] = this._globalService.provinceList.concat(this._globalService.stateList);
        
        dataModel.is_third_party = formValue['isSigned3rdParty'];
        dataModel.company_name = formValue['companyName'];
        dataModel.confirm_regulatory_contact = formValue['confirmContactValid']? YES : NO;

        this._addressDetailsService.mapFormModelToDataModel(addressFormGroupValue, dataModel.regulatory_activity_address, lang, countryList, combinedProvStatList);
        this._contactDetailsService.mapFormModelToDataModel(contactFormGroupValue, dataModel.regulatory_activity_contact, lang, languageList);
    }

    public mapDataModelToFormModel(dataModel : TransactionEnrol, formRecord: FormGroup): void {
        formRecord.controls['isSigned3rdParty'].setValue(dataModel.is_third_party);
        formRecord.controls['companyName'].setValue(dataModel.company_name);
    }
 
}
