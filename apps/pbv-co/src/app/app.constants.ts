export const ROOT_TAG: string = 'COMPANY_ENROL';
export const VERSION_TAG_PATH: string = 'COMPANY_ENROL.software_version';
export const START_CHECKSUM_VERSION = 5;

export const DATA_PATH: string = './assets/data/';

export const FILE_OUTPUT_PREFIX = 'co';
export const EXTERNAL_OUTPUT_PREFIX = 'draftrepco'
export const INTERNAL_OUTPUT_PREFIX = 'hcrepco'
export const XSLT_PREFIX = 'REP';

export const LINE_BREAK = '\r\n';

export const HELP_FOOTNOTE_PREFIX = 'tr';
export const HELP_FOOTNOTE_SUFFIX = '-rf';

export const CONTACT_ERROR_PREFIX = 'c';
export const ADDRESS_ERROR_PREFIX = 'a';

export const YES = "Y";
export const NO = "N";

export const HELP_TEXT_SEQUENCE = [
    'loadFileIndx',
    'companyEnrolmentIndx',
    'reasonIndx',
    'addressInfoIndx',
    'businessNumIndx',
    'selectRolesIndx',
    'companyRepIndx',
    'prodLineIndx'
  ];


export const ENROLMENT_STATUS = {
  NEW: 'NEW',
  AMEND: 'AMEND',
  FINAL: 'FINAL',
  APPROVED: 'APPROVED'
};

export const ROLE_MAPPING: { [key: string]: string } = {
  MFR: "manufacturer",
  BILL: "billing",
  MAIL: "mailing",
};

export const REVERSE_ROLE_MAPPING: { [key: string]: string } = {
  manufacturer: "MFR",
  billing: "BILL",
  mailing: "MAIL",
};

export const ROLE_CODES = {
  MFR: 'MFR',
  BILL: 'BILL',
  MAIL: 'MAIL'
}

export const ROLE_INDEX_MAPPING = {
  MFR: 0,
  MAIL: 1,
  BILL: 2
}