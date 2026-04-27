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
  importer: string,
  isSchedule: string,
  isInclude: string,
  isOnDrugList: string,
  isRegulated: string,
  isOnDrug: string,
  isNonPrescriptioScheduleApplied: string,
  isDrugPermitted: string,
  dosAge: string
  drug_use: IIdTextLabel,
  is_schedule_claim:     ScheduleClaim,
  disinfectant_types:    DisinfectantTypes;
  proposedIndicationOfUseDosage: string;
  formulation_details: Formulation[];
  ingredients_testing : Ingredient[] // TODO: Remove this, it will be under formulation_details
}

export interface ScheduleClaim {
  din: string;
  schedule_claim_indication: string;
  schedule_claim_applied : IIdTextLabel[];
}

export interface DisinfectantTypes {
  disinfectant_type : IIdTextLabel[];

}

export interface Formulation {
  id : number;
  formulation_name : string;
  dosage_form : IIdTextLabel;
  ingredient_section : Ingredient[];
}

export interface Ingredient {
  id : number;
  role : IIdTextLabel;
  ingredient_name : string;
  proprietary_attestation : string;
  proprietary_information : string;
  // Add text for propriety here;
  variant_name : string;
  purpose : string;
  cas_number : string;
  ingred_standard : string;
  strength : string;
  operator : IIdTextLabel;
  value : string;
  lower_limit : string;
  upper_limit : string;
  units : IIdTextLabel;
  units_other : string;
  per : IIdTextLabel;
  per_value : string;
  per_units : IIdTextLabel;
  per_units_other_details : string;
  is_base_calc : IIdTextLabel;
  is_nanomaterial : string;
  nanomaterial : IIdTextLabel;
  nanomaterial_details : string;
  is_animal_human_material : string;
}