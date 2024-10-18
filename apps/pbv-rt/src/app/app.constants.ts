export const ROOT_TAG: string = 'TRANSACTION_ENROL';
export const VERSION_TAG_PATH: string = 'TRANSACTION_ENROL.software_version';
export const START_CHECKSUM_VERSION = 5;

export const DATA_PATH: string = './assets/data/';

export const FILE_OUTPUT_PREFIX = 'rt';
export const XSLT_PREFIX = 'REP';

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
  PHARMACEUTICAL_HUMAN: 'D22',
  BIOLOGIC_HUMAN: 'D21',
  VETERINARY: 'D24',
};

export const TXN_DESC = {
  ADMINISTRATIVE: 'ADMINISTRATIVE', //Administrative
  ADV_COMP_REQ: 'ADV_COMP_REQ', //Advertising Complaint Request for Information
  BENEFIT_RISK_ASSESS: 'BENEFIT_RISK_ASSESS', //Benefit Risk Assessment
  BLOOD_EST: 'BLOOD_EST', //Blood Establishment
  CSO_RMP: 'CSO_RMP', //Canadian Specific Opioid RMP
  CANCEL_LETTER: 'CANCEL_LETTER', //Cancellation Letter
  CHANGE_TO_DIN: 'CHANGE_TO_DIN', //Change to DIN
  COMMENTS_NOC: 'COMMENTS_NOC', //Comments on Notice of Decision
  COMMENTS_REGULARTORY_DECISION: 'COMMENTS_REGULARTORY_DECISION', //Comments on Regulatory Decision Summary
  COMMENTS_SUMMARY_BASIS: 'COMMENTS_SUMMARY_BASIS', //Comments on Summary Basis of Decision (SBD)
  CONSENT_LTR: 'CONSENT_LTR', //Consent Letter
  DATA_PROTECT_CORRESP: 'DATA_PROTECT_CORRESP', //Correspondence - Data Protection
  CORR_PATENT_MED: 'CORR_PATENT_MED', //Correspondence - Patented Medicines
  DIN_DISCONTINUED: 'DIN_DISCONTINUED', //Discontinuation of Sale Notification
  DISSEM_LIST: 'DISSEM_LIST', //Dissemination List
  DRUG_NOTIF_FORM: 'DRUG_NOTIF_FORM', //Drug Notification Form (Market Notification)
  FOR_PERIOD: 'FOR_PERIOD', //For Period of
  FOREIGN_SAFETY_NOTIFICATION: 'FOREIGN_SAFETY_NOTIFICATION', //Foreign Safety Action Notification
  FORM_IV: 'FORM_IV', //Form IV
  FORM_V: 'FORM_V', //Form V
  FINAL_RISK_COM: 'FINAL_RISK_COM', //Final Risk Communication Document
  IMMEDIATE_NOTIFICATION: 'IMMEDIATE_NOTIFICATION', //Immediate Notification
  INITIAL: 'INITIAL', //INITIAL
  INITIAL_TEAT_SOLU_MONO: 'INITIAL_TEAT_SOLU_MONO', //INITIAL - Teat Solutions Monograph
  ISSUE_SAFETY_REQUEST: 'ISSUE_SAFETY_REQUEST', //Issue Related Summary Report Request
  MEETING_MINUTES: 'MEETING_MINUTES', //Minutes of Meeting
  ALLEGATION_NOTICE: 'ALLEGATION_NOTICE', //Notice of allegation
  NOTIFICATION_INTERRUPT_SALE: 'NOTIFICATION_INTERRUPT_SALE', //Notification for Interruption of Sale (DIN Dormant)
  NOTIFICATION_CHANGE: 'NOTIFICATION_CHANGE', //Notification of Change in Benefit-Risk Profile
  PATIENT_SAFETY_INFO: 'PATIENT_SAFETY_INFO', //Patient Safety Information (Medication error)
  POST_AUTH_CHANGE: 'POST_AUTH_CHANGE', //Post Authorization Change
  POST_AUTH_DIV1_CHANGE: 'POST_AUTH_DIV1_CHANGE', //Post-Authorization Division 1 Change
  POST_CLEARANCE_DATA: 'POST_CLEARANCE_DATA', //Post Clearance Data
  POST_MARKET_SURV: 'POST_MARKET_SURV', //Post-Market Surveillance
  POST_NOC_CHANGE: 'POST_NOC_CHANGE', //Post NOC Change
  PROTOCOL_REVIEW: 'PROTOCOL_REVIEW', //Protocol Review
  PUB_RELEASE_INFO: 'PUB_RELEASE_INFO', //Public Release of Clinical Information
  PRIORITY_REVIEW_RQ: 'PRIORITY_REVIEW_RQ', //Priority Review Request
  PRODUCT_LABELLING_POST_APPROVAL: 'PRODUCT_LABELLING_POST_APPROVAL', //Product Labelling – Post-Approval
  RESSESS_ORDER: 'RESSESS_ORDER', //Reassessment Order
  RECON_DECIS_LTR_INTENT: 'RECON_DECIS_LTR_INTENT', //Reconsideration of Decision - Letter of Intent
  RECON_DECIS_OTHER_INFO: 'RECON_DECIS_OTHER_INFO', //Reconsideration of Decision - Other Information
  RECON_DECIS_RQ_RECON: 'RECON_DECIS_RQ_RECON', //Reconsideration of Decision - Request for Reconsideration
  REQ_ACCEPTED: 'REQ_ACCEPTED', //Request Accepted
  REQUEST_REVIEW_REPORT: 'REQUEST_REVIEW_REPORT', //Request for Review Report(s)
  WRITTEN_CONSULT_REQ: 'WRITTEN_CONSULT_REQ', //Request for Written Consultation
  BE_CLARIF_RESPONSE: 'BE_CLARIF_RESPONSE', //Response to BE Clarification Request
  xyz1: 'xy1', //Response to Clinical Clarification Request
  CLIN_CLARIF_RESPONSE: 'CLIN_CLARIF_RESPONSE', //Response to Clarification Request
  EMAIL_RQ_RESPONSE: 'EMAIL_RQ_RESPONSE', //Response to E-mail Request
  xyz2: 'xy2', //Response to Human Safety Clarification Request
  LABEL_CLARIF_RESPONSE: 'LABEL_CLARIF_RESPONSE', //Response to Labelling Clarification Request
  MHPD_RQ_RESPONSE: 'MHPD_RQ_RESPONSE', //Response to MHPD Letter
  NOC_RESPONSE: 'NOC_RESPONSE', //Response to NOC/c-QN
  NOD_RESPONSE: 'NOD_RESPONSE', //Response to NOD
  NOL_RESPONSE: 'NOL_RESPONSE', //Response to NOL
  NONCLIN_CLARIF_RESPONSE: 'NONCLIN_CLARIF_RESPONSE', //Response to Non-clinical Clarification Request
  NON_RESPONSE: 'NON_RESPONSE', //Response to NON
  PROCESSING_CLARIF_RESPONSE: 'PROCESSING_CLARIF_RESPONSE', //Response to Processing Clarification Request
  QUAL_CLIN_CLARIF_RESPONSE: 'QUAL_CLIN_CLARIF_RESPONSE', //Response to Quality & Clinical Clarification Request
  QUAL_CLARIF_RESPONSE: 'QUAL_CLARIF_RESPONSE', //Response to Quality Clarification Request
  CHSC_RQ_RESPONSE: 'CHSC_RQ_RESPONSE', //Response to Clinical & Human safety clarification request
  QHSC_RQ_RESPONSE: 'QHSC_RQ_RESPONSE', //Response to Quality & Human Safety Clarification Request
  QCHSC_RQ_RESPONSE: 'QCHSC_RQ_RESPONSE', //Response to Quality, Clinical and Human Safety clarification request
  SCREENING_ACCEPT_RESPONSE: 'SCREENING_ACCEPT_RESPONSE', //Response to Screening Acceptance Letter
  SCREENING_CLARIF_RESPONSE: 'SCREENING_CLARIF_RESPONSE', //Response to Screening Clarification Request
  SDN_RESPONSE: 'SDN_RESPONSE', //Response to SDN
  PHONE_RQ_RESPONSE: 'PHONE_RQ_RESPONSE', //Response to Telephone Request
  RISK_COMMUN_DOC: 'RISK_COMMUN_DOC', //Risk Communication Document
  RMP_VERSION_DATE: 'RMP_VERSION_DATE', //Risk Management Plan (RMP)
  ROLLING_INFO: 'ROLLING_INFO', //Rolling Information
  LABEL_PREAPPROVAL_2LANG: 'LABEL_PREAPPROVAL_2LANG', //Second Language Label - Pre-Approval
  PRESUB_MEETING_PKG: 'PRESUB_MEETING_PKG', //Submission Meeting Package
  PRESUB_MEETING_RQ: 'PRESUB_MEETING_RQ', //Submission Meeting Request
  TEST_STUDIES_ORDER: 'TEST_STUDIES_ORDER', //Test and Studies Order
  TERM_COND_COMM: 'TERM_COND_COMM', //Terms and Conditions Commitment
  UNSOLICITED_DATA: 'UNSOLICITED_DATA', //Unsolicited Information
  WITHDRAWAL_NOF_FORM: 'WITHDRAWAL_NOF_FORM', //Withdrawal of Drug Notification Form
  YEAR_LIST_OF_CHANGE: 'YEAR_LIST_OF_CHANGE', //Year(s) of change, list of change number(s)
  YEAR: 'YEAR', //Year
  ADVISEMENT_LETTER_RESPONSE: 'ADVISEMENT_LETTER_RESPONSE', //Response to Advisement Letter to update the Product Monograph
  NOF_DRUG_SHORT: 'NOF_DRUG_SHORT', //Notification on Drug Shortage
  QUALITY_ISSU: 'QUALITY_ISSU', //Quality issue raised by company and/or other regulator
  GMP_COMP_ISSU: 'GMP_COMP_ISSU', //GMP compliance issue raised by other regulators
  RECLASS_LOT_RELEASE: 'RECLASS_LOT_RELEASE', //Reclassification request under BRDD Lot Release Program
  NOC_COMPLIANCE: 'NOC_COMPLIANCE', //Notice of Compliance with Conditions (NOC/c) – commitment
  UDRA_CANCEL_LETTER: 'UDRA_CANCEL_LETTER', //Cancellation Letter for UDRA
  SEQUENCE_CLEANUP: 'SEQUENCE_CLEANUP', //eCTD Dossier Clean-up
  UDRA_MEETING_MINUTES: 'UDRA_MEETING_MINUTES', //Minutes of Meeting for UDRA
  UDRA_EMAIL_RQ_RESPONSE: 'UDRA_EMAIL_RQ_RESPONSE', //Response to E-mail Request for UDRA
  UDRA_PROCESSING_CLARIF_RESPONSE: 'UDRA_PROCESSING_CLARIF_RESPONSE', //Response to Processing Clarification Request for UDRA
  GEN_VOL_NOF: 'GEN_VOL_NOF', //General / Voluntary Notification
};

export const MITIGATION_TYPE = {
  SMALL_BUSINESS: "SMALL_BUSINESS",
  URGENT_HEALTH_NEED: "URGENT_HEALTH_NEED",
  FUNDED_INSTITUTION: "FUNDED_INSTITUTION",
  GOVERMENT_ORGANIZATION: "GOVERMENT_ORGANIZATION",
  ISAD: "ISAD"
}

export const TXN_DESC_ACTION = {
  SHOW_DATE: '1',
  SHOW_STARTENDDATE: '2',
  SHOW_REQUESTERS: '3',
  SHOW_YEARSOFCHANGE: '4',
  SHOW_YEAR: '5',
  SHOW_VERSIONNUM: '6',
  SHOW_BRIEFDESCRIPTION: '7',
  SHOW_BRIEFDESCRIPTIONOFCHANGE: '8'
};