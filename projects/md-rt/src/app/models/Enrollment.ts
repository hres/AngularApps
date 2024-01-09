import { IIdTextLabel } from "@hpfb/sdk/ui";

export interface Enrollment {
  DEVICE_TRANSACTION_ENROL: DeviceTransactionEnrol;
}

export interface DeviceTransactionEnrol {
  application_info:                   ApplicationInfo;
  requester_of_solicited_information: RequesterOfSolicitedInformation;
  transFees:                          TransFees;
}

export interface ApplicationInfo {
  software_version:         string;
  enrol_version:            string;
  last_saved_date:          string;
  dossier_id:               string;
  dossier_type:             IIdTextLabel;
  company_id:               string;
  manufacturing_contact_id: string;
  regulatory_company_id:    string;
  regulatory_contact_id:    string;
  regulatory_activity_lead: IIdTextLabel;
  regulatory_activity_type: IIdTextLabel;
  description_type:         IIdTextLabel;
  device_class:             string;
  amend_reasons:            AmendReasons;
  licence_number:           string;
  application_number:       string;
  device_name:              string;
  request_date:             string;
  transaction_description:  string;
  has_ddt:                  string;
  has_app_info:             string;
  is_solicited_info:        string;
  org_manufacture_id:       string;
  org_manufacture_lic:      string;
  meeting_id:               string;
  proposed_licence_name:    string;
  request_version:          string;
  request_to:               string;
  brief_description:        string;
  rationale:                string;
  proposed_indication:      string;
}

export interface AmendReasons {
  classification_change: string;
  licence_change:        string;
  process_change:        string;
  quality_change:        string;
  design_change:         string;
  materials_change:      string;
  labelling_change:      string;
  safety_change:         string;
  purpose_change:        string;
  add_delete_change:     string;
  device_change:         string;
}

export interface RequesterOfSolicitedInformation {
  requester:            Requester[];
}

export interface Requester {
  id:                   string;
  requester:            IIdTextLabel;
}

export interface TransFees {
  has_fees:             string;
  billing_company_id:   string;
  billing_contact_id:   string;
}