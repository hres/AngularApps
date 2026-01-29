import { ICode, IIdText, IIdTextLabel, ITextLabel } from "@hpfb/sdk/ui";

export interface ProductInformation {
  DRUG_PRODUCT_ENROL: DrugProductEnrol;
}

export interface DrugProductEnrol {
  template_type: string;
  date_saved: string;
  software_version: string;
  form_language: string;
  check_sum?: string;
  company_id: string;
  dossier_id: string;
  dossier_type: IIdTextLabel;
  product_name: string;
  proper_name: string;
  is_admin_sub: string;
  sub_type: IIdTextLabel;
  manufacturer: string;
  mailing: string;
  this_activity: string;
  importer: string;
  drug_use: IIdTextLabel;
}