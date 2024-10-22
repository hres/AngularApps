import { IIdText, IIdTextLabel, ITextLabel } from "@hpfb/sdk/ui";

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
  fee_details: FeeDetails;
  is_priority: string;
  is_noc: string;
  is_admin_sub: string;
  sub_type: IIdTextLabel;
  is_fees: string
}

export interface Ectd {
  company_id: string;
  dossier_id: string;
  dossier_type: IIdTextLabel;
  product_name: string;
  product_protocol: string;
  lifecycle_record: LifecycleRecord;
}

export interface LifecycleRecord {
  control_number: string;
  regulatory_activity_lead: IIdTextLabel;
  regulatory_activity_type: IIdTextLabel;
  sequence_description_value: IIdTextLabel;
  sequence_date: string;
  sequence_from_date: string;
  sequence_to_date: string;
  sequence_details: string;
  sequence_details_change: string;
  sequence_version: string;
  sequence_year: string;
  transaction_description: string;
  requester_name: string;
  requester_name2: string;
  requester_name3: string;
  requester_of_solicited_information: string;
}

export interface FeeDetails {
  submission_class: IIdTextLabel;
  mitigation_type: IIdTextLabel;
}

export interface INameAddress {
  company_name: string;
  street_address: string;
  city: string;
  province_lov: IIdText;
  province_text: string;
  country: IIdTextLabel;
  postal_code: string;
}

export interface IContact {
  given_name: string;
  surname: string;
  job_title: string;
  language_correspondance: IIdTextLabel;
  phone_num: string;
  phone_ext: string;
  fax_num: string;
  email: string;
}
