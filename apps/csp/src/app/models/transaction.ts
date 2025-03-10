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
  health_canada_only: HcUse;
  applicant: IApplicant;
  advanced_payment: FeeDetails;
  application_info: IApplicationInformation;
  timely_submission_info: ITimelySubmissionInformation;
  certification: CertDetails;

}

export interface IApplicationInformation {

  patent_info: IPatent;
  drug_use: string;
  noc_date: string;
  control_number: string;
  medicinal_ingredient: string
  product_name: string;
  time_application: string;
  applicant_statement: string;
}

export interface HcUse {
  company_id: string;
  date_received: string;
  application_id: string;
  hc_notes: string;
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
  advanced_payment_fee: string;
  advanced_payment_type: string;
}

export interface CertDetails {
  given_name: string;
  initials: string;
  surname: string;
  job_title: string;
  date_signed: string;
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


export interface ITimelySubmissionInformation {
  timely_submission_statement: string;
  marketing_application_date: string;
  marketing_country: IIdTextLabel;
}
