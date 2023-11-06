export const ROOT_TAG: string = 'DEVICE_COMPANY_ENROL';
export const DATA_PATH: string = './assets/data/';
export const NEW:string='NEW';
export const AMEND:string='AMEND';
export const FINAL:string='FINAL';
export const REVISE:string='REVISE';
export const ACTIVE:string='ACTIVE';
export const REMOVE:string='REMOVE';
export const XSLT_PREFIX = 'REP_MDS_CO_';

// these need to match the code values in the amendReasons.json file
export const AMEND_REASON_NAME_CHANGE = 'NAME_CHANGE'; 
export const AMEND_REASON_ADDR_CHANGE = 'ADDR_CHANGE'; 
export const AMEND_REASON_FACILITY_CHANGE = 'FACILITY_CHANGE'; 
export const AMEND_REASON_OTHER = 'OTHER'; 

export const ContactStatus = {
  NEW,
  REVISE,
  REMOVE,
  ACTIVE
} 

// export enum EnrollmentStatus {
//     NEW = 'fr_NEW',
//     AMEND = 'fr_AMEND',
//     FINAL = 'fr_FINAL'
//   }

export const helpInstructionHeadings = ['loadFileIndx',
                                        'compREPInx',
                                        'rationaleInx',
                                        'conStatInx',
                                        'routIdInx',
                                        'desRenewalInx',
                                        'desFinanceInx',
                                        'licenseNumsInx'] 
