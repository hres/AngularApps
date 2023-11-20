import { INameAddress, IIdText, IIdTextLabel, Contact } from "@hpfb/sdk/ui";

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


