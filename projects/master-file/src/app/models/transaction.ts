// todo cleanup unused fields
export interface Transaction {
  TRANSACTION_ENROL: TransactionEnrol;
}

export interface TransactionEnrol {
  template_type: string;
  //date_saved: string;
  software_version: string;
  enrol_version: string;
  data_checksum: string;
  last_saved_date: Date;
  // is_third_party: string;
  // is_priority: string;
  // is_noc: string;
  // is_admin_sub: string;
  // sub_type: string;
  ectd: Ectd;
  is_fees: string;
  fee_details: FeeDetails;
  is_activity_changes: string;
  holder_name_address: HolderNameAddress;
  holder_contact: HolderContact;
  // confirm_regulatory_contact: string;
  agent_not_applicable: boolean;
  agent_name_address: HolderNameAddress;
  agent_contact: HolderContact;
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
  master_file_number: string;
  master_file_use: IIdTextLabel;
  regulatory_activity_lead: IIdText;
  regulatory_activity_type: IIdTextLabel;
  sequence_description_value: IIdText;
  sequence_from_date: Date;
  // sequence_to_date: string;
  // sequence_details: string;
  // sequence_details_change: string;
  // sequence_version: string;
  // sequence_year: string;
  transaction_description: string;
  // requester_name: IIdText;
  // requester_name2:                    IIdText;
  // requester_name3:                    IIdText;
  requester_of_solicited_information: string;
  // from_time: string;
  // to_time: string;
}

export interface FeeDetails {
  are_there_access_letters: boolean;
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

export interface HolderContact {
  first_name: string;
  last_name: string;
  job_title: string;
  language_correspondance: string;
  phone_number: string;
  phone_extension: string;
  fax_number: string;
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
