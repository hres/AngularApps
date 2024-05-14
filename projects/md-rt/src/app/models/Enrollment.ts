import { IIdTextLabel, ILabel } from "@hpfb/sdk/ui";

export interface Enrollment {
  DEVICE_TRANSACTION_ENROL: DeviceTransactionEnrol;
}

export interface DeviceTransactionEnrol {
  software_version:         string;
  form_language:            string;
  check_sum?:               string;
  application_info:         ApplicationInfo;
  transFees:                TransFees;
}

export interface ApplicationInfo {
  last_saved_date:          string;
  dossier_id:               string;
  dossier_type:             IIdTextLabel;
  company_id:               string;
  manufacturer_contact_id: string;
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
  transaction_description:  ILabel;
  has_ddt:                  string;
  has_app_info:             string;
  org_manufacture_id:       string;
  org_manufacture_lic:      string;
  meeting_id:               string;
  proposed_licence_name:    string;
  brief_description:        string;
  rationale:                string;
  proposed_indication:      string;
}

export interface AmendReasons {
  amend_reason:            IIdTextLabel[];
}

export interface TransFees {
  has_fees:             string;
  billing_company_id:   string;
  billing_contact_id:   string;
}