import { IContact, INameAddress } from "@hpfb/pbv";
import { ICode, IIdText, IIdTextLabel, ITextLabel } from "@hpfb/sdk/ui";

export interface Company {
  COMPANY_ENROL: CompanyEnrol;
}

export interface CompanyEnrol {
  template_type: string;
  date_saved: string;
  software_version: string;
  form_language: string;
  check_sum?: string;
  application_type: string;
  enrolment_version: string;
  company_id: string;
  reason_amend: string;
  address_record: AddressRecord[];
  contact_record: ContactRecord[];
}

export interface AddressRecord {
  address_id: string;
  manufacturer: string;
  mailing: string;
  billing: string;
  company_name: string;
  business_number: string;
  company_address_details: INameAddress;
}

export interface ContactRecord {
  contact_id: string;
  manufacturer: string;
  mailing: string;
  billing: string;
  company_contact_details: IContact;
}