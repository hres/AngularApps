import { IIdTextLabel } from "@hpfb/sdk/ui";

export interface Enrollment {
  DEVICE_COMPANY_ENROL: DeviceCompanyEnrol;
}

export interface DeviceCompanyEnrol {
  software_version:       string;
  form_language:          string;
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

export interface Contact {
  id: number;
  contact_id: string;
  status: IIdTextLabel;
  full_name: string;
  language_correspondence: IIdTextLabel;
  job_title: string;
  fax_num: string;
  phone_num: string;
  phone_ext: string;
  email: string;
//  routingID: string;
}

export interface Contacts {
  contact: Contact[];
}

export interface INameAddress {
  company_name: string;
  street_address: string;
  city: string;
  country: IIdTextLabel;
  province_lov: IIdTextLabel;  
  province_text: string;
  postal_code: string;
}