import { IIdText, IIdTextLabel, ITextLabel } from "@hpfb/sdk/ui";
import { INameAddress, IContact } from "@hpfb/pbv";

export interface Transaction {
  TRANSACTION_ENROL: TransactionEnrol;
}

export interface TransactionEnrol {
  template_type: string;
  date_saved: string;
  software_version: string;
  form_language: string;
  check_sum?: string;
  ectd: Ectd;
  hcUse: HcUse;
  applicant: IApplicant;
  fee_details: FeeDetails;
  patent_info: IPatent;
  drugUse: string;
  nocDate: string;
  ndsNumber: string;
  medicinalIngredients: IMedicinalIngredients;
  certification: CertDetails;
  timingOfApplicant: string;
}

export interface HcUse {
  appReceived: string;
  custNum: string;
  appNum: string;
  notes: string;
}

export interface Ectd {
  product_protocol: string;
  lifecycle_record: LifecycleRecord;
}

export interface LifecycleRecord {
  control_number: string;
  regulatory_activity_lead: IIdText;
  regulatory_activity_type: IIdTextLabel;
  revise_trans_desc_request: string;
  revised_trans_desc: IIdTextLabel;
  sequence_description_value: IIdTextLabel;
  sequence_from_date: string;
  transaction_description: ITextLabel;
  requester_of_solicited_information: string;
}

export interface FeeDetails {
  feeAmount: string;
  payMethod: string;
}

export interface CertDetails {
  firstName: string;
  initials: string;
  lastName: string;
  jobTitle: string;
  date: string;
}

export interface INameAddressCSP {
  company_name: string;
  street_address: string;
  city: string;
  province_lov: IIdText;
  province_text: string;
  country: IIdTextLabel;
  postal_code: string;
}

export interface IContactCSP {
  given_name: string;
  initials: string;
  surname: string;
  job_title: string;
  language_correspondance: IIdTextLabel;
  phone_num: string;
  phone_ext: string;
  fax_num: string;
  email: string;
}

export interface IPatent {
  patent_number: string;
  filing_date: string;
  granted_date: string;
  expiry_date: string;
}

export interface IApplicant {
  billing_role: string;
  applicant_role: string;
  applicant_name: string;
  cra_business_number: string;
  csp_customer_number: string;
  agent_name: string;
  contact: IContact;
  address: INameAddress
}

export interface IDrugUse {
  usage: IIdText

}

export interface IMedicinalIngredients {
  medicinalIngredient: string;
  productName: string;
}
