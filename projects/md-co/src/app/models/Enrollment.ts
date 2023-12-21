import { INameAddress, IIdTextLabel, Contact, Contacts } from "@hpfb/sdk/ui";

export interface Enrollment {
  DEVICE_COMPANY_ENROL: DeviceCompanyEnrol;
}

export interface DeviceCompanyEnrol {
  template_version:       string;
  check_sum?:             string;
  general_information:    GeneralInformation;
  address:                INameAddress;
  contacts:               Contacts;
  primary_contact:        PrimaryContact;
  administrative_changes: AdministrativeChanges;
}

export interface AdministrativeChanges {
  all_licence_numbers:  string;
  is_regulatory_change: string;
  new_company_id:       string;
  new_contact_id:       string;
  new_contact_name:     string;
}

export interface GeneralInformation {
  status:                  IIdTextLabel;
  enrol_version:           string;
  last_saved_date:         string;
  company_id:              string;
  amend_reasons:           AmendReasons;
  rationale:               string;
  are_licenses_transfered: string;
}

export interface AmendReasons {
  amend_reason:            IIdTextLabel[];
}

export interface PrimaryContact {
  renewal_contact_name: string;
  finance_contact_name: string;
}


