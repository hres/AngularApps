export const ROOT_TAG: string = 'TRANSACTION_ENROL';
export const VERSION_TAG_PATH: string = 'TRANSACTION_ENROL.software_version';
export const START_CHECKSUM_VERSION = 2;

export const DATA_PATH: string = './assets/data/';

export const FILE_OUTPUT_PREFIX = 'hccsp';
export const FILE_OUTPUT_SEPERATOR = '-';

export const HELP_FOOTNOTE_PREFIX = 'tr';
export const HELP_FOOTNOTE_SUFFIX = '-rf';

export const YES = "Y";
export const NO = "N";

export const helpInstructionHeadings = [
    'loadFileIndx',
    'dateLastIndx',
    'appContactIndx',
    'billAddIndx',
    'patentInfoIndx',
    'newDrugIndx',
    'nocDateIndx',
    'drugUseIndx',
    'medicIngrIndx',
    'attestationIndx',
    'approvalIndx',
    'feePayIndx',
    'methodPayIndx',
    'certificationIndx'
  ];

  // address/contact type
  export const ADDR_CONT_TYPE = {
    APPLICANT: 'applicant',
    BILLING: 'billing'
  };
