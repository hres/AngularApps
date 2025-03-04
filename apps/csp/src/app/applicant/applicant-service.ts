import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressDetailsService, ContactDetailsService } from '@hpfb/pbv';
import { ICode } from '@hpfb/sdk/ui';
import { identityRevealedValidator } from '../crossFieldValidator';
import { FormBaseService } from '../form-base/form-base.service';
import { GlobalService } from '../global/global.service';
import { IApplicant, TransactionEnrol } from '../models/transaction';
import { YES, NO } from '../app.constants';

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



  public mapFormModelToDataModel(formValue: any, model: TransactionEnrol,  applicantAddressFormGroupValue, applicantContactFormGroupValue, billingAddressFormGroupValue, billingContactFormGroupValue, applicantModel, billingModel) {
    const lang = this._globalService.currLanguage;
    const languageList: ICode[] = this._globalService.languageList;
    const countryList: ICode[] = this._globalService.countryList;
    const combinedProvStatList: ICode[] = this._globalService.provinceList.concat(this._globalService.stateList);
    let applicants = []

    const applicant = applicantModel;
    
    applicant.billing_role = NO;
    applicant.applicant_role = YES;

    applicant.applicant_name = formValue['applicantName'];
    applicant.cra_business_number = formValue['craBusinessNumber'];
    applicant.csp_customer_number = formValue['cspNumber'];
    applicant.agent_name = formValue['agentName'];

    this._addressDetailsService.mapFormModelToDataModelCanadianAddress(applicantAddressFormGroupValue, applicant.address, lang, countryList, combinedProvStatList);
    this._contactDetailsService.mapFormModelToDataModel(applicantContactFormGroupValue, applicant.contact, lang, languageList);

    applicants.push(applicant)
    
    if(formValue['isBillingDifferent']){
      console.log("BILLING");
      const billing = billingModel;
      console.log(billing)

      billing.billing_role = YES;
      billing.applicant_role = NO;

      billing.agent_name = formValue['orgName'];
      this._addressDetailsService.mapFormModelToDataModel(billingAddressFormGroupValue, billing.address, lang, countryList, combinedProvStatList);
      this._contactDetailsService.mapFormModelToDataModel(billingContactFormGroupValue, billing.contact, lang, languageList);

      applicants.push(billing);
    }

    model.applicant = applicants
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
