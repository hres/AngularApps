import { INameAddress, IIdText, IIdTextLabel } from "@hpfb/sdk/ui";

// todo cleanup unused fields
export interface Enrollment {
  DEVICE_COMPANY_ENROL: DeviceCompanyEnrol;
}

export interface DeviceCompanyEnrol {
  general_information:    GeneralInformation;
  address:                INameAddress;
  contacts:               Contact[];
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

// export interface Contacts {
//   contact: Contact;
// }

export interface Contact {
  id:              number;
  contact_id:      string;
  status:          IIdTextLabel;
  status_text:     string;
  full_name:       string;
  language:        IIdTextLabel;
  job_title:       string;
  fax_number:      string;
  phone_number:    string;
  phone_extension: string;
  email:           string;
  RoutingID:       string;
}

export interface GeneralInformation {
  status:                  string;
  enrol_version:           string;
  last_saved_date:         string;
  company_id:              string;
  amend_reasons:           AmendReasons;
  are_licenses_transfered: string;
}

export interface AmendReasons {
  amend_reason:            IIdTextLabel[];
  rationale:               string;
}

export interface PrimaryContact {
  renewal_contact_name: string;
  finance_contact_name: string;
}


