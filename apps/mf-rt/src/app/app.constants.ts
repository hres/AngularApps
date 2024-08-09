export const ROOT_TAG: string = 'TRANSACTION_ENROL';
export const VERSION_TAG_PATH: string = 'TRANSACTION_ENROL.software_version';
export const START_CHECKSUM_VERSION = 2;

export const DATA_PATH: string = './assets/data/';

export const MASTER_FILE_OUTPUT_PREFIX = 'mf';

export const helpInstructionHeadings = [
    'loadFileIndx',
    'dossierIdIndx',
    'holderAddrIndx',
    'agentAddrIndx',
    'confmValidIndx',
    'feeNoteIndx',
    'accessLetrIndx',
    'accountNumIndx',
  ];

  // address/contact type
  export const ADDR_CONT_TYPE = {
    HOLDER: 'holder',
    AGENT: 'agent'
  };