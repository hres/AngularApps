import { IIdTextLabel } from "@hpfb/sdk/ui";

export interface Enrollment {
  DEVICE_TRANSACTION_ENROL: DeviceTransactionEnrol;
}

export interface DeviceTransactionEnrol {
  software_version:         string;     // template_version??
  check_sum?:               string;
  application_info:                   ApplicationInfo;
  requester_of_solicited_information: {requester: []},
  transFees:                          TransFees;
}

export interface ApplicationInfo {
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
  device_class:             IIdTextLabel;
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
  amend_reason:            IIdTextLabel[];
}

export interface Requester {
  id:                   string;
  requester:            string;
}

export interface TransFees {
  has_fees:             string;
  billing_company_id:   string;
  billing_contact_id:   string;
}