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
  contact_info: IContactInformation;
}

export interface Ectd {
  company_id: string;
  dossier_id: string;
  dossier_type: IIdText;
  product_name: string;
  product_protocol: string;
  lifecycle_record: LifecycleRecord;
}

export interface LifecycleRecord {
  control_number: string;
  regulatory_activity_lead: IIdText;
  regulatory_activity_type: IIdTextLabel;
  sequence_description_value: IIdTextLabel;
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
  from_time: string;
  to_time: string;
}

export interface FeeDetails {
}

export interface IContactInformation {
  is_3rd_party_signed: string;
  company_name: string;
  routing_id: string;
  confirm_contact_valid: boolean;
}

export interface INameAddress {
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
