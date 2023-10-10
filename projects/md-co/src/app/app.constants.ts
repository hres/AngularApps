export const ROOT_TAG: string = 'DEVICE_COMPANY_ENROL';
export const DATA_PATH: string = './assets/data/';
export const NEW:string='NEW';
export const AMEND:string='AMEND';
export const FINAL:string='FINAL';
export const XSLT_PREFIX = 'REP_MDS_CO_';

export const AMEND_OTHER_REASON_CODE = 'OTHER';   // this needs to match the OTHER code value in amendReasons.json

export enum ContactStatus {
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
                                        'conStatInx',
                                        'routIdInx',
                                        'desRenewalInx',
                                        'desFinanceInx']
