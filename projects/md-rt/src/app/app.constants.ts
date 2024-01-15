export const ROOT_TAG: string = 'DEVICE_TRANSACTION_ENROL';
export const DATA_PATH: string = './assets/data/';

export const XSLT_PREFIX = 'REP_MDS_RT_';

export const COMPANY_ID_PREFIX = 'K';

// the values need to match the code values in activity types json data file
export enum ActivityType {
  PrivateLabelAmendment = 'B02-20160301-074',
  MinorChange = 'B02-20160301-033',
  LicenceAmendment = 'B02-20160301-040',
} 

// the values need to match the code values in transaction descriptions json data file
export enum TransactionDesc {
  'Initial' = 'INITIAL'
}

// the values need to match the code values in device classes json data file
export enum DeviceClass {
  ClassII = 'DC2',
  ClassIII = 'DC3',
  ClassIV = 'DC4',
}

export const helpInstructionHeadings = [
  'loadFileInx',
  'transactionInfoInx',
  'contactIdInx',
  'deviceClassInx',
  'applicationNumberInx',
  'deviceNameInx',
  'licenseNumberlInx',
  'deviceDetailInx'
];
