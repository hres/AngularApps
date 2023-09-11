// todo cleanup unused fields
export interface Welcome5 {
  DEVICE_COMPANY_ENROL: DeviceCompanyEnrol;
}

export interface DeviceCompanyEnrol {
  general_information:    GeneralInformation;
  address:                Address;
  contacts:               Contacts;
  primary_contact:        PrimaryContact;
  administrative_changes: AdministrativeChanges;
}

export interface Address {
  company_name: string;
  address:      string;
  city:         string;
  country:      IIdTextLabel;
  prov_lov:     IIdTextLabel;
  prov_text:    string;
  postal:       string;
}

export interface AdministrativeChanges {
  all_licence_numbers:  string;
  is_regulatory_change: string;
  new_company_id:       string;
  new_contact_id:       string;
  new_contact_name:     string;
}

export interface Contacts {
  contact: Contact;
}

export interface Contact {
  id:              string;
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
  last_saved_date:         Date;
  company_id:              string;
  amend_reasons:           AmendReasons;
  are_licenses_transfered: string;
}

export interface AmendReasons {
  manufacturer_name_change:    string;
  manufacturer_address_change: string;
  facility_change:             string;
  contact_change:              string;
  other_change:                string;
  other_details:               string;
}

export interface PrimaryContact {
  renewal_contact_name: string;
  finance_contact_name: string;
}


export interface INameAddress {
  company_name: string;
  street_address: string;
  city: string;
  province_lov: IIdText;
  province_text: string;
  country: IIdTextLabel;
  postal_code: string;
}

export interface IContact {
  given_name: string;
  surname: string;
  job_title: string;
  language_correspondance: IIdTextLabel;
  phone_num: string;
  phone_ext: string;
  fax_num: string;
  email: string;
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
