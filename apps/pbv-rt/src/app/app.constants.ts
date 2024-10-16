export const ROOT_TAG: string = 'TRANSACTION_ENROL';
export const VERSION_TAG_PATH: string = 'TRANSACTION_ENROL.software_version';
export const START_CHECKSUM_VERSION = 5;

export const DATA_PATH: string = './assets/data/';

export const FILE_OUTPUT_PREFIX = 'REP';

export const helpInstructionHeadings = [
    'loadFileIndx',
    'dossierTypeIndx',
    'compIdIndx',
    'dossierIdIndx',
    'prodNameIndx',
    'prioRevIndx',
    'nocRevIndx',
    'adminSubIndx',
    'ctrlNumIndx',
    'regActIndx',
    'yearChangeIndx',
    'briefDescIndx',
    'requestSoliIndx',
    'feeTransIndx',
    'feesIndx',
    'regContactIndx',
    'routeIdIndx',
    'genFinalIndx'
  ];

export const DOSSIER_TYPE = {
  PHARMACEUTICAL_HUMAN: "D22",
  BIOLOGIC_HUMAN: "D21",
  VETERINARY: "D24"
}; 

export const MITIGATION_TYPE = {
  SMALL_BUSINESS: "SMALL_BUSINESS",
  URGENT_HEALTH_NEED: "URGENT_HEALTH_NEED",
  FUNDED_INSTITUTION: "FUNDED_INSTITUTION",
  GOVERMENT_ORGANIZATION: "GOVERMENT_ORGANIZATION",
  ISAD: "ISAD"
}
