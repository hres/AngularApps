// todo cleanup unused fields
export interface Transaction {
  TRANSACTION_ENROL: TransactionEnrol;
}

export interface TransactionEnrol {
  template_type: string;
  date_saved: string;
  software_version: string;
  enrol_version: string;
  data_checksum: string;
  ectd: Ectd;
  fee_details: FeeDetails;
  contact_info: ContactInfo;
  certify_accurate_complete: boolean;
  full_name: string;
  submit_date: string;
}

export interface Ectd {
  company_id: string;
  dossier_id: string;
  dossier_type: IIdText;
  product_name: string;
  product_protocol: string;
  lifecycle_record: LifecycleRecord;
}

export interface ContactInfo {
  holder_name_address: HolderNameAddress;
  holder_contact: IContact;
  agent_not_applicable: boolean;
  agent_name_address: HolderNameAddress;
  agent_contact: IContact;
  contact_info_confirm: string;
}

export interface LifecycleRecord {
  control_number: string;
  master_file_number: string;
  master_file_use: IIdTextLabel;
  regulatory_activity_lead: IIdText;
  regulatory_activity_type: IIdTextLabel;
  sequence_description_value: IIdTextLabel;
  sequence_from_date: string;
  transaction_description: string;
  requester_of_solicited_information: string;
}

export interface FeeDetails {
  are_there_access_letters: string;
  number_of_access_letters: string;
  who_responsible_fee: string;
  account_number: string;
  cra_business_number: string
}

export interface HolderNameAddress {
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

export interface IText {
  __text: string;
}

export interface IIdText {
  _id: string;
  __text?: string;
}

export interface IIdTextLabel {
  _id: string;
  __text?: string;
  _label_en: string;
  _label_fr: string;
}
