export const ROOT_TAG: string = 'DEVICE_APPLICATION_INFO';
export const DATA_PATH: string = './assets/data/';

export const XSLT_PREFIX = 'REP_MDS_AI_';

export const XSL_EXTENSION = '.xsl';

export const COMPANY_ID_PREFIX = 'K';

export const MATERIAL_ERROR_PREFIX = 'm';
export const DEVICE_ERROR_PREFIX = 'd';

export const DERIVATIVE_OTHER_ID = "30";
export const TISSUE_OTHER_ID = "32"

export enum DeviceClass {
  ClassII = 'DC2',
  ClassIII = 'DC3',
  ClassIV = 'DC4',
}

export enum ActivityType {
  MinorChange = 'B02-20160301-033',
  Licence = 'B02-20160301-039',
  LicenceAmendment = 'B02-20160301-040',
  PrivateLabel = 'B02-20160301-073',
  PrivateLabelAmendment = 'B02-20160301-074',
  S25 = 'B02-20160301-081'
} 

export enum Compliance {
  USP = 'compliance_usp',
  GMP = 'compliance_gmp',
  OTHER = 'compliance_other'
}

// Change strings according to app's instructions
export const helpInstructionHeadings = [
  'loadFileIndx',
  'appInfoREPIndx',
  'mdsapNumIndx',
  'mdsapOrgIndx',
  'licAppTypeIndx',
  'devClsIndx',
  'cfmDecIndx',
  'priRevIndx'
];