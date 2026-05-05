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
  species_subtypes: SpeciesAndSubtypes;
}

export interface ScheduleClaim {
  din: string;
  schedule_claim_indication: string;
  schedule_claim_applied : IIdTextLabel[];
}

export interface DisinfectantTypes {
  disinfectant_type : IIdTextLabel[];

}


export interface SpecyAndSubType {
  id: number;
  specy: string;
  subtype: string;
  isUsedForTreatmentOfFoodProducingAnimals: string;
  withdrawal_time: WithdrawalTime

}
export interface WithdrawalTime {
  days: number;
  hours: number;
}

export interface SpeciesAndSubtypes {
  species_subtypes: SpecyAndSubType[]

}