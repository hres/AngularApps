export const ROOT_TAG: string = 'DEVICE_COMPANY_ENROL';
export const DATA_PATH: string = './assets/data/';
// export const NEW: string = 'NEW';
// export const AMEND: string = 'AMEND';
// export const FINAL: string = 'FINAL';
// export const REVISE:string='REVISE';
// export const ACTIVE:string='ACTIVE';
// export const REMOVE:string='REMOVE';
export const XSLT_PREFIX = 'REP_MDS_CO_';

// these need to match the code values in the amendReasons.json file
export const AMEND_REASON_NAME_CHANGE = 'NAME_CHANGE';
export const AMEND_REASON_ADDR_CHANGE = 'ADDR_CHANGE';
export const AMEND_REASON_FACILITY_CHANGE = 'FACILITY_CHANGE';
export const AMEND_REASON_OTHER = 'OTHER';

// // this needs to match the code values in contactStatuses.json
// export const CONT_STATUS_NEW = 'NEW';
// export const CONT_STATUS_REVISE = 'REVISE';
// export const CONT_STATUS_REMOVE = 'REMOVE'
// export const CONT_STATUS_ACTIVE = 'ACTIVE';

// // todo only keep one of the contact status list
// export const ContactStatus = {
//   NEW,
//   REVISE,
//   REMOVE,
//   ACTIVE
// }

export const COMPANY_ID_PREFIX = 'K';

// the values need to match the code values in enrollment status json data file
export enum EnrollmentStatus {
  New = 'NEW',
  Amend = 'AMEND',
  Final = 'FINAL',
}

export const helpInstructionHeadings = [
  'loadFileIndx',
  'compREPInx',
  'rationaleInx',
  'conStatInx',
  'routIdInx',
  'addRecordInx',
  'desRenewalInx',
  'desFinanceInx',
  'licenseNumsInx',
];
