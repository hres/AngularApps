export const ROOT_TAG: string = 'DEVICE_COMPANY_ENROL';
export const DATA_PATH: string = './assets/data/';

export const XSLT_PREFIX = 'REP_MDS_CO_';

// these need to match the code values in the amendReasons.json file
export const AMEND_REASON_NAME_CHANGE = 'NAME_CHANGE';
export const AMEND_REASON_ADDR_CHANGE = 'ADDR_CHANGE';
export const AMEND_REASON_FACILITY_CHANGE = 'FACILITY_CHANGE';
export const AMEND_REASON_OTHER = 'OTHER';

export const COMPANY_ID_PREFIX = 'K';

// Constants for impacted licence numbers
export const NEW_LINE = '\n';
export const MAX_IMPACTED_LIC_NUM_LENGTH = 6999;
export const LIC_NUM_LENGTH = 6;

// the values need to match the code values in enrollment status json data file
export enum EnrollmentStatus {
  New = 'NEW',
  Amend = 'AMEND',
  Final = 'FINAL',
}

// the values need to match the code values in contact status json data file
export enum ContactStatus {
  New = 'NEW',
  Revise = 'REVISE',
  Remove = 'REMOVE',
  Active = 'ACTIVE',
}

export const helpInstructionHeadings = [
  'loadFileInx',
  'compREPInx',
  'rationaleInx',
  'conStatInx',
  // 'routIdInx',
  'addRecordInx',
  'desRenewalInx',
  'desFinanceInx',
  'licenseNumsInx',
];
