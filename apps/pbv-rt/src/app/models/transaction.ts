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
  fee_details: FeeDetails;
  is_activity_changes: string;
  company_name: string;
  regulatory_activity_address: INameAddress;
  regulatory_activity_contact: IContact;
  confirm_regulatory_contact: boolean;
  is_priority: string;
  is_noc: string;
  is_admin_sub: string;
  sub_type: IIdTextLabel;
}

export interface Ectd {
  dossier_type: IIdTextLabel;
  company_id: string;
  dossier_id: string;
  product_name: string;
  lifecycle_record: LifecycleRecord;
}

export interface LifecycleRecord {
  control_number: string;
  regulatory_activity_lead: IIdTextLabel;
  regulatory_activity_type: IIdTextLabel;
  sequence_description_value: IIdTextLabel;
  sequence_from_date: string;
  sequence_to_date: string;
  sequence_details: string;
  sequence_details_change: string;
  sequence_version: string;
  sequence_year: string;
  transaction_description: ITextLabel;
  requester_name: string;
  requester_name2: string;
  requester_name3: string;
  requester_of_solicited_information: string;
}

export interface FeeDetails {
  submission_class: IIdTextLabel;
  submission_description: ITextLabel;
  mitigation: Mitigation;
}

export interface Mitigation {
  mitigation_type: IIdTextLabel;
  small_business_fee_application: string;
  certify_organization: string;
  certify_urgent_health_need: string;
  certify_funded_health_institution: string;
  certify_government_organization: string;
  certify_isad: string;
}