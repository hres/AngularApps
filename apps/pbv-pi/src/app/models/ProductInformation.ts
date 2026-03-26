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
  schedule_claim_group: SchemaClaimGroup
}

export interface SchemaClaimGroup {
  isAcute_Alcoholism: string;
  isAcute_inflammatory_and_debilitating_arthiritis: string;
  isAteriosclerosis: string;
  isCancer: string;
  isDementia: string;
  isGangrene: string;
  isHepatitis: string;
  isObesity:  string;
  isSexually_transmitted_disease:string;
  isThyroid_disease: string;
  isAcute_anxiety_state: string;
  isAcute_psychotic_conditions: string;
  isAcute_infectious_respiratory_syndromes: string;
  isAddiction_except_nicotine_addiction: string;
  isAppendicitis: string;
  isCongestive_heart_failure: string;
  isDepression: string;
  isGlaucoma: string;
  isHypertension: string;
  isRheumatic_fever: string;
  isStrangulated_hernia: string;
  isUlcer_of_gastro_intestinal_tract: string;
  isAsthma:string;
  isConvulsions: string;
  isDiabetes: string;
  isHaematologic_bleeding_disorders: string;
  isNausea_and_vomiting_of_pregnancy: string;
  isSepticemia: string;
  isThrombotic_and_embolic_disorder: string;
}
