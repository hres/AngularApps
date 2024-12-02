import { IIdText, IIdTextLabel, ITextLabel } from "@hpfb/sdk/ui";

export interface ProductInformation {
  DRUG_PRODUCT_ENROL: DrugProductEnrol;
}

export interface DrugProductEnrol {
  template_type: string;
  date_saved: string;
  software_version: string;
  form_language: string;
  check_sum?: string;
}