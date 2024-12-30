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
}