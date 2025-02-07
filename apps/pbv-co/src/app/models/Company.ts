import { IContact, INameAddress } from "@hpfb/pbv";
import { ICode, IIdText, IIdTextLabel, ITextLabel } from "@hpfb/sdk/ui";
import { OutputRecord } from "../record-base/record.model";

export interface Company {
  COMPANY_ENROL: CompanyEnrol;
}

export interface CompanyEnrol {
  template_type: string;
  date_saved: string;
  software_version: string;
  form_language: string;
  check_sum?: string;
  application_type: IIdTextLabel;
  enrolment_version: string;
  company_id: string;
  reason_amend: string;
  address_record: AddressRecord[];
  contact_record: ContactRecord[];
}

export interface AddressRecord extends OutputRecord {
  manufacturer: string;
  mailing: string;
  billing: string;
  company_name: string;
  business_number: string;
  company_address_details: INameAddress;
}

export interface ContactRecord extends OutputRecord {
  manufacturer: string;
  mailing: string;
  billing: string;
  company_contact_details: IContact;
}