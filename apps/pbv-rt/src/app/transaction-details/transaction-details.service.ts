import { computed, inject, Injectable, Signal } from '@angular/core';
import { UtilsService, ConverterService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LifecycleRecord } from '../models/transaction';
import { TXN_DESC, TXN_DESC_ACTION } from '../app.constants';
import { AppSignalService } from '../signal/app-signal.service';

@Injectable()
export class TransactionDetailsService {

  private _signalService = inject(AppSignalService);

  readonly selectedDossierTypeId: Signal<string> = this._signalService.getSelectedDossierType();
  readonly selectedRaLeadId: Signal<string> = this._signalService.getSelectedRaLead();
  readonly selectedRaTypeId: Signal<string> = this._signalService.getSelectedRaType();
  readonly selectedTxDescId: Signal<string> = this._signalService.getSelectedTxnDesc();

  showDateTxnDescs: string[] = [
    TXN_DESC.ADV_COMP_REQ,
    TXN_DESC.COMMENTS_NOC,
    TXN_DESC.COMMENTS_REGULARTORY_DECISION,
    TXN_DESC.COMMENTS_SUMMARY_BASIS,
    TXN_DESC.CSO_RMP,
    TXN_DESC.DISSEM_LIST,
    TXN_DESC.ISSUE_SAFETY_REQUEST,
    TXN_DESC.MEETING_MINUTES,
    TXN_DESC.PATIENT_SAFETY_INFO,
    TXN_DESC.BE_CLARIF_RESPONSE,
    TXN_DESC.xyz1,
    TXN_DESC.CHSC_RQ_RESPONSE,
    TXN_DESC.EMAIL_RQ_RESPONSE,
    TXN_DESC.xyz2,
    TXN_DESC.LABEL_CLARIF_RESPONSE,
    TXN_DESC.MHPD_RQ_RESPONSE,
    TXN_DESC.NOC_RESPONSE,
    TXN_DESC.NOD_RESPONSE,
    TXN_DESC.NOL_RESPONSE,
    TXN_DESC.NONCLIN_CLARIF_RESPONSE,
    TXN_DESC.NON_RESPONSE,
    TXN_DESC.PROCESSING_CLARIF_RESPONSE,
    TXN_DESC.QHSC_RQ_RESPONSE,
    TXN_DESC.QCHSC_RQ_RESPONSE,
    TXN_DESC.QUAL_CLIN_CLARIF_RESPONSE,
    TXN_DESC.QUAL_CLARIF_RESPONSE,
    TXN_DESC.SCREENING_ACCEPT_RESPONSE,
    TXN_DESC.SCREENING_CLARIF_RESPONSE,
    TXN_DESC.SDN_RESPONSE,
    TXN_DESC.PHONE_RQ_RESPONSE,
    TXN_DESC.RISK_COMMUN_DOC,
    TXN_DESC.RMP_VERSION_DATE,
    TXN_DESC.ADVISEMENT_LETTER_RESPONSE,
    TXN_DESC.UDRA_MEETING_MINUTES,
    TXN_DESC.UDRA_EMAIL_RQ_RESPONSE,
    TXN_DESC.UDRA_PROCESSING_CLARIF_RESPONSE
  ];
  // computed signal for rendering of the "Dated" field
  showDated: Signal<boolean> = computed(() => {
    return this.showDateTxnDescs.includes(this.selectedTxDescId());
    // return this.showDateTxnDescs.includes(this._signalService.getSelectedTxnDesc()());
  });

  showStartEndDateTxnDescs: string[] = [
    TXN_DESC.FOR_PERIOD
  ]
  // computed signal for rendering of the "Start Date" and "End Date" fields
  showStartEndDate = computed(() => {
    return this.showStartEndDateTxnDescs.includes(this.selectedTxDescId());
  });

  showRequesterTxnDescs: string[] = [
    TXN_DESC.COMMENTS_SUMMARY_BASIS,
    TXN_DESC.BE_CLARIF_RESPONSE,
    TXN_DESC.xyz1,
    TXN_DESC.CHSC_RQ_RESPONSE,
    TXN_DESC.EMAIL_RQ_RESPONSE,
    TXN_DESC.xyz2,
    TXN_DESC.LABEL_CLARIF_RESPONSE,
    TXN_DESC.NONCLIN_CLARIF_RESPONSE,
    TXN_DESC.PROCESSING_CLARIF_RESPONSE,
    TXN_DESC.QHSC_RQ_RESPONSE,
    TXN_DESC.QCHSC_RQ_RESPONSE,
    TXN_DESC.QUAL_CLIN_CLARIF_RESPONSE,
    TXN_DESC.QUAL_CLARIF_RESPONSE,
    TXN_DESC.SCREENING_CLARIF_RESPONSE,
    TXN_DESC.PHONE_RQ_RESPONSE,
    TXN_DESC.UDRA_EMAIL_RQ_RESPONSE,
    TXN_DESC.UDRA_PROCESSING_CLARIF_RESPONSE
  ]
  // computed signal for rendering of the "Dated" field
  showRequesters = computed(() => {
    return this.showRequesterTxnDescs.includes(this.selectedTxDescId());
  });
  
  showYearsOfChangeTxnDescs: string[] = [
    TXN_DESC.YEAR_LIST_OF_CHANGE
  ]
  // computed signal for rendering of the "Years Of Change" field
  showYearsOfChange = computed(() => {
    return this.showYearsOfChangeTxnDescs.includes(this.selectedTxDescId());
  });

  showYearTxnDescs: string[] = [
    TXN_DESC.YEAR
  ]
  // computed signal for rendering of the "Year" field
  showYear = computed(() => {
    return this.showYearTxnDescs.includes(this.selectedTxDescId());
  });

  showVersionNumTxnDescs: string[] = [
    TXN_DESC.CSO_RMP,
    TXN_DESC.DISSEM_LIST,
    TXN_DESC.RISK_COMMUN_DOC,
    TXN_DESC.RMP_VERSION_DATE
  ]
  // computed signal for rendering of the "Version" field
  showVersionNum = computed(() => {
    return this.showVersionNumTxnDescs.includes(this.selectedTxDescId());
  });

  showBriefDescriptionnTxnDescs: string[] = [
    TXN_DESC.POST_NOC_CHANGE,
    TXN_DESC.ROLLING_INFO,
    TXN_DESC.UNSOLICITED_DATA
  ]
  // computed signal for rendering of the "Brief Description" field
  showBriefDescription = computed(() => {
    return this.showBriefDescriptionnTxnDescs.includes(this.selectedTxDescId());
  });

  showBriefDescriptionnOfChangeTxnDescs: string[] = [
    TXN_DESC.POST_NOC_CHANGE
  ]
  // computed signal for rendering of the "Brief Description of Change" field
  showBriefDescriptionOfChange = computed(() => {
    return this.showBriefDescriptionnOfChangeTxnDescs.includes(this.selectedTxDescId());
  });

  constructor(private _utilsService: UtilsService, private _converterService: ConverterService, private _globalService: GlobalService) {}

  public getTransctionDetailsForm(fb:FormBuilder) {
    if (!fb) {
      return null;
   }
   return fb.group({
    controlNumber: [null, [Validators.required]],
    activityLead: [null, [Validators.required]],
    activityType: [null, Validators.required],
    descriptionType: [null, Validators.required],
    dated: [null, Validators.required],
    startDate: [null, Validators.required],
    endDate: [null, Validators.required],
    yearsOfChange: [null, Validators.required],
    year: [null, Validators.required],
    requester1: [null, Validators.required],
    requester2: [null, Validators.required],
    requester3: [null, Validators.required],
    versionNumber: [null, Validators.required],
    briefDescription: [null, [Validators.required]],
    briefDescriptionOfChange: [null, [Validators.required]],
   });
  }

  // this array contains the actions fields related with transaction description
  actionFieldsArray: string[] = ['dated', 'startDate', 'endDate', 'yearsOfChange', 'year', 'requester1', 'requester2', 'requester3', 'versionNumber', 'briefDescription', 'briefDescriptionOfChange'];

  // key is the boolean flag, values are the rendered field(s) asscociated with the flag
  // make sure the fields' name are exact same spellings as defined in getTransctionDetailsForm()
  actionFlagFieldsMap: { [key: string]: string[] } = {
    [TXN_DESC_ACTION.SHOW_DATE]: ['dated'],
    [TXN_DESC_ACTION.SHOW_STARTENDDATE]: ['startDate', 'endDate'],
    [TXN_DESC_ACTION.SHOW_REQUESTERS]: ['requester1', 'requester2', 'requester3'],
    [TXN_DESC_ACTION.SHOW_YEARSOFCHANGE]: ['yearsOfChange'],
    [TXN_DESC_ACTION.SHOW_YEAR]: ['year'],
    [TXN_DESC_ACTION.SHOW_VERSIONNUM]: ['versionNumber'],
    [TXN_DESC_ACTION.SHOW_BRIEFDESCRIPTION]: ['briefDescription'],
    [TXN_DESC_ACTION.SHOW_BRIEFDESCRIPTIONOFCHANGE]: ['briefDescriptionOfChange']
  };

  public mapFormModelToDataModel(formValue: any, dataModel: LifecycleRecord): void {
    const lang = this._globalService.currLanguage;

    dataModel.control_number = formValue['controlNumber'];
    dataModel.regulatory_activity_lead = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.raLeads, formValue['activityLead'], lang);
    dataModel.regulatory_activity_type = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.raTypes, formValue['activityType'], lang);
    dataModel.sequence_description_value = this._converterService.findAndConverCodeToIdTextLabel(this._globalService.transactionDescriptions, formValue['descriptionType'], lang);
// todo v4.4.3 startDate is used for both Dated (YYYY-MM-DD) and Start Date (YYYY-MM-DD)
    dataModel.sequence_date = formValue['dated'];
    dataModel.sequence_from_date = formValue['startDate'];
    dataModel.sequence_to_date = formValue['endDate'];
    dataModel.sequence_details = formValue['briefDescription'];
    dataModel.sequence_details_change = formValue['briefDescriptionOfChange'];
    dataModel.sequence_version = formValue['versionNumber'];
// todo yearsOfChange or year
    dataModel.sequence_year = formValue['yearsOfChange'];
    dataModel.transaction_description = "todo concat"
    dataModel.requester_name = formValue['requester1'];
    dataModel.requester_name2 = formValue['requester2'];
    dataModel.requester_name3 = formValue['requester3'];
    dataModel.requester_of_solicited_information = "todo concat"
    // ???? do these two fields required??
    // dataModel.from_time
    // dataModel.to_time
  }

  public mapDataModelToFormModel(dataModel: LifecycleRecord, formRecord: FormGroup): void {
    formRecord.controls['controlNumber'].setValue(dataModel.control_number);

    if(dataModel.regulatory_activity_lead?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.regulatory_activity_lead);
      formRecord.controls['activityLead'].setValue(id? id : null);
    } else {
      formRecord.controls['activityLead'].setValue(null);
    }

    if(dataModel.regulatory_activity_type?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.regulatory_activity_type);
      formRecord.controls['activityType'].setValue(id? id : null);
    } else {
      formRecord.controls['activityType'].setValue(null);
    }

    if(dataModel.sequence_description_value?._id){
      const id = this._utilsService.getIdFromIdTextLabel(dataModel.sequence_description_value);
      formRecord.controls['descriptionType'].setValue(id? id : null);
    } else {
      formRecord.controls['descriptionType'].setValue(null);
    }  

    formRecord.controls['dated'].setValue(dataModel.sequence_date);
    formRecord.controls['startDate'].setValue(dataModel.sequence_from_date);
    formRecord.controls['endDate'].setValue(dataModel.sequence_from_date);
    formRecord.controls['briefDescription'].setValue(dataModel.sequence_details);
    formRecord.controls['briefDescriptionOfChange'].setValue(dataModel.sequence_details_change);
    formRecord.controls['versionNumber'].setValue(dataModel.sequence_version);
    formRecord.controls['yearsOfChange'].setValue(dataModel.sequence_year);
    formRecord.controls['requester1'].setValue(dataModel.requester_name);
    formRecord.controls['requester2'].setValue(dataModel.requester_name2);
    formRecord.controls['requester3'].setValue(dataModel.requester_name2);    
  }  
}
