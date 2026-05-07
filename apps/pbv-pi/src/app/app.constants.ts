export const ROOT_TAG: string = 'DRUG_PRODUCT_ENROL';
export const VERSION_TAG_PATH: string = 'DRUG_PRODUCT_ENROL.software_version';
export const START_CHECKSUM_VERSION = 5;

export const DATA_PATH: string = './assets/data/';

export const FILE_OUTPUT_PREFIX = 'pi';
export const XSLT_PREFIX = 'REP';

export const LINE_BREAK = '\r\n';

export const HELP_FOOTNOTE_PREFIX = 'tr';
export const HELP_FOOTNOTE_SUFFIX = '-rf';

export const HELP_TEXT_SEQUENCE = [
    'loadFileIndx',
    'productInfoIndx',
    'compIdIndx',
    'dossierTypeIndx',
    'dossierIdIndx',
    'prodNameIndx',
    'properNameIndx',
    'adminCompIndx',
    'addressSentIndx',
    'importIndx',
    'routeIdIndx',
    'dataIndx',
    'drugIndx',
    'dinIndx',
    'dosageIndx',
    'formIndex',
    'formNumIndx',
    'ingrIndx',
    'unknownIndx',
    'knownIndx',
    'ingrNameIndx',
    'formVarNameIndx',
    'purposeIndx',
    'standardIndx',
    'nanoIndx',
    'bioSourceIndx',
    'bioUsedIndx',
    'conTypeIndx',
    'packIndx',
    'shelfIndx',
    'countriesIndx',
    'bioIngrIndx',
    'genFinalIndx',
    'dataIndx',
    'clinTriIndx',
    'clinSexIndx',
    'clinAgeIndx',
    'clinRaceIndx',
    'clinPediIndx',
    'drugUseIndx',
    'dinIndex'
  ];

export const DOSSIER_TYPE = {
  PHARMACEUTICAL_HUMAN: 'D22',
  BIOLOGIC_HUMAN: 'D21',
  VETERINARY: 'D24',
};

export const MEDICINAL = 1;
export const NON_MEDICINAL = 2;

export const PRESENTATION = 1;
export const MEASURE = 2;

export const YES = "Y";
export const NO = "N";

export const EQUALS = 1;
export const NOT_MORE = 2;
export const NOT_LESS = 3;
export const RANGE = 4;

export const UNIT_MEASURE_OTHER = "OTHER";
export const UNITS_OTHER = "OTHER";


export const OPTIONAL_FIELDS_INGREDIENT_FORMULATION = [
  'purpose',
  'operator',
  'operatorValue',
  'lowerLimit',
  'upperLimit',
  'units',
  'unitOfMeasure',
  'measureOtherDetails',
  'per',
  'perValue',
  'unitOfPresentation',
  'calculatedBase',
  'isNanomaterial',
  'nanomaterial',
  'nanomaterialType',
  'isAnimalHumanSourced',
  'attestInformation'
];

export const INGREDIENT_FORMULATION_ERROR_PREFIX = "i.f"
