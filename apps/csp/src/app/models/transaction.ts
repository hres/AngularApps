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
  applicant: IApplicant;
  fee_details: FeeDetails;
  patent: IPatent;
  drugUse: string;
  nocDate: string;
  ndsNumber: string;
  medicinalIngredients: string;
  timingOfApplicant: string;
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
  revise_trans_desc_request: string;
  revised_trans_desc: IIdTextLabel;
  sequence_description_value: IIdTextLabel;
  sequence_from_date: string;
  transaction_description: ITextLabel;
  requester_of_solicited_information: string;
}

export interface FeeDetails {
}

export interface IPatent {
  patentNumber: string;
  patentFillingDate: string;
  patendExpirationDate: string;
  patentGrandDate: string;
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
