export const ROOT_TAG: string = 'DEVICE_APPLICATION_INFO';
export const DATA_PATH: string = './assets/data/';

export const XSLT_PREFIX = 'REP_MDS_RT_';

export const XSL_EXTENSION = '.xsl';

export const COMPANY_ID_PREFIX = 'K';

export enum DeviceClass {
  ClassII = 'DC2',
  ClassIII = 'DC3',
  ClassIV = 'DC4',
}

// Change strings according to app's instructions
export const helpInstructionHeadings = [
  'loadFileIndx',
  'appInfoREPIndx',
  'mdsapNumIndx',
  'licAppTypeIndx',
  'mdsapOrgIndx',
  'devClsIndx',
  'cfmDecIndx',
];