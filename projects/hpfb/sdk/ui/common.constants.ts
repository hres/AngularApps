export const ERR_SUMMARY_COMP_NAME: string = 'ErrorSummaryComponent'; //todo use uppercase for constants
export const errorSummleastOneRcd: string = 'leastOneRecordError';
export const CANADA: string = 'CA';
export const USA: string = 'US';
export const ENGLISH: string = 'en';
export const FRENCH: string = 'fr';
export const YES: string = 'yes';
export const NO: string = 'no';

// the value needs to match enrollment 'FINAL' status code loaded from the json data file
export const FINAL: string = 'FINAL';

// the values need to match the code values in contact status json data file
export enum ContactStatus {
  New = 'NEW',
  Revise = 'REVISE',
  Remove = 'REMOVE',
  Active = 'ACTIVE',
}
