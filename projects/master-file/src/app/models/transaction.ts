// todo cleanup unused fields
export interface Transaction {
  TRANSACTION_ENROL: TransactionEnrol;
}

export interface TransactionEnrol {
  template_type: string;
  date_saved: string;
  software_version: string;
  data_checksum: string;
  // is_third_party: string;
  // is_priority: string;
  // is_noc: string;
  // is_admin_sub: string;
  // sub_type: string;
  ectd: Ectd;
  is_fees: string;
  fee_details: FeeDetails;
  is_activity_changes: string;
  company_name: string;
  regulatory_activity_address: RegulatoryActivityAddress;
  regulatory_activity_contact: RegulatoryActivityContact;
  confirm_regulatory_contact: string;
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
  submission_class: IIdTextLabel;
  submission_description: IIdTextLabel;
  fee: string;
  mitigation: Mitigation;
}

export interface Mitigation {
  mitigation_type: IIdTextLabel;
  certify_organization: string;
  small_business_fee_application: string;
  certify_goverment_organization: string;
  certify_urgent_health_need: string;
  certify_funded_health_institution: string;
  certify_isad: string;
}

export interface RegulatoryActivityAddress {
  street_address: string;
  city: string;
  province_lov: IIdText;
  province_text: string;
  country: IIdTextLabel;
  postal_code: string;
}

export interface RegulatoryActivityContact {
  given_name: string;
  initials: string;
  surname: string;
  job_title: string;
  language_correspondance: IIdText;
  phone_num: string;
  phone_ext: string;
  fax_num: string;
  email: string;
  RoutingID: string;
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
