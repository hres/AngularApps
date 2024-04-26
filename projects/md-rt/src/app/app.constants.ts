export const ROOT_TAG: string = 'DEVICE_TRANSACTION_ENROL';
export const DATA_PATH: string = './assets/data/';

export const XSLT_PREFIX = 'REP_MDS_RT_';

export const COMPANY_ID_PREFIX = 'K';

// the values need to match the code values in activity types json data file
export enum RegulatoryActivityType {
  Licence = 'B02-20160301-039',
  PrivateLabel = 'B02-20160301-073',
  PrivateLabelAmendment = 'B02-20160301-074',
  MinorChange = 'B02-20160301-033',
  LicenceAmendment = 'B02-20160301-040',
}

// the values need to match the code values in transaction descriptions json data file
export enum TransactionDesc {
  ACD = 'ACD', //	Appeal Comprehensive Document
  INITIAL = 'INITIAL',
  IRSR = 'IRSR', //	Issue Related Safety Request
  LIA = 'LIA', //	Letter of Intent to Appeal
  LIOH = 'LIOH', //	Letter of Intent to Invoke Opportunity to be Heard
  MM = 'MM', //	Minutes of Meeting
  OHCD = 'OHCD', //	Opportunity to be Heard Comprehensive Document
  PSI = 'PSI', //	Patient Safety Information (Medication error)
  RAIL = 'RAIL', //Response to Additional Information Letter
  RER = 'RER', //	Response to E-mail Request
  RS25L = 'RS25L', //	Response to S.25 Letter
  RS36L = 'RS36L', //	Response to S.36 Letter
  RS39L = 'RS39L', //	Response to S.39 Letter
  RS = 'RS', // Response to screening deficiency letter
  UD = 'UD', // Unsolicited Information
  WR = 'WR', //	Withdrawal Request
}

// the values need to match the code values in device classes json data file
export enum DeviceClass {
  ClassII = 'DC2',
  ClassIII = 'DC3',
  ClassIV = 'DC4',
}

export enum AmendReason {
  PURPOSE_CHANGE = 'PURPOSE_CHANGE',
  LICENCE_CHANGE = 'LICENCE_CHANGE',
  DEVICE_CHANGE = 'DEVICE_CHANGE',
  CLASSIFICATION_CHANGE = 'CLASSIFICATION_CHANGE',
  ADD_DELETE_CHANGE = 'ADD_DELETE_CHANGE'
}

export const helpInstructionHeadings = [
  'loadFileInx',
  'transactionInfoInx',
  'dossierIdInx',
  'contactIdInx',
  'deviceClassInx',
  'applicationNumberInx',
  'deviceNameInx',
  'licenseNumberlInx',
  'deviceDetailInx',
];
