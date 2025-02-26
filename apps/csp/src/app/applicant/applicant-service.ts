import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressDetailsService, ContactDetailsService } from '@hpfb/pbv';
import { ICode } from '@hpfb/sdk/ui';
import { identityRevealedValidator } from '../crossFieldValidator';
import { GlobalService } from '../global/global.service';
import { IApplicant, TransactionEnrol } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {

  constructor(private _addressDetailsService: AddressDetailsService,
              private _contactDetailsService: ContactDetailsService,
              private _globalService: GlobalService) {}

  public static getApplicantInformationForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   const applicantForm = fb.nonNullable.group({
      applicantName: new FormControl(null, Validators.required),
      craBusinessNumber: new FormControl(null),
      cspNumber: new FormControl(null, Validators.required),
      agentName: new FormControl(null),
      orgName: new FormControl(null),
      billingRole: [false],
      applicantRole: [true],
      isBillingDifferent: [false]
     
    },);
    return applicantForm;
  }



  public mapFormModelToDataModel(formValue: any, model: TransactionEnrol,  applicantAddressFormGroupValue, applicantContactFormGroupValue, billingAddressFormGroupValue, billingContactFormGroupValue) {
    const lang = this._globalService.currLanguage;
    const languageList: ICode[] = this._globalService.languageList;
    const countryList: ICode[] = this._globalService.countryList;
    const combinedProvStatList: ICode[] = this._globalService.provinceList.concat(this._globalService.stateList);

    model.applicant.billing_role = formValue['billingRole'];
    model.applicant.applicant_role = formValue['applicantRole'];

    model.applicant.applicant_name = formValue['applicantName'];
    model.applicant.cra_business_number = formValue['craBusinessNumber'];
    model.applicant.csp_customer_number = formValue['cspNumber'];
    model.applicant.agent_name = formValue['agentName'];

    this._addressDetailsService.mapFormModelToDataModelCanadianAddress(applicantAddressFormGroupValue, model.applicant.address, lang, countryList, combinedProvStatList);
    this._contactDetailsService.mapFormModelToDataModel(applicantContactFormGroupValue, model.applicant.contact, lang, languageList);

    if(formValue['isBillingDifferent']){
      console.log("BILLING");
      model.applicant.agent_name = formValue['orgName'];
      this._addressDetailsService.mapFormModelToDataModelCanadianAddress(billingAddressFormGroupValue, model.applicant.address, lang, countryList, combinedProvStatList);
      this._contactDetailsService.mapFormModelToDataModel(billingContactFormGroupValue, model.applicant.contact, lang, languageList);
    }
  }

  public mapDataModelToFormModel(applicantModel: IApplicant, formRecord: FormGroup) {
    formRecord.controls['billingRole'].setValue(applicantModel.billing_role);
    formRecord.controls['applicantRole'].setValue(applicantModel.billing_role);

    formRecord.controls['applicantName'].setValue(applicantModel.applicant_name);
    formRecord.controls['craBusinessNumber'].setValue(applicantModel.cra_business_number);
    formRecord.controls['cspNumber'].setValue(applicantModel.csp_customer_number);
    formRecord.controls['agentName'].setValue(applicantModel.agent_name);
   }


}
