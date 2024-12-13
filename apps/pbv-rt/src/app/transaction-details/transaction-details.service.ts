import { computed, inject, Injectable, Signal } from '@angular/core';
import { UtilsService, ConverterService, ITextLabel, EntityBaseService, ENGLISH, FRENCH } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LifecycleRecord } from '../models/transaction';
import { LINE_BREAK, TXN_DESC, TXN_DESC_ACTION } from '../app.constants';
import { AppSignalService } from '../signal/app-signal.service';

@Injectable()
export class TransactionDetailsService {

  private _signalService = inject(AppSignalService);
  private _entityBaseService = inject(EntityBaseService);

  readonly selectedDossierTypeId: Signal<string> = this._signalService.getSelectedDossierType();
  readonly selectedRaLeadId: Signal<string> = this._signalService.getSelectedRaLead();
  readonly selectedRaTypeId: Signal<string> = this._signalService.getSelectedRaType();
  readonly selectedTxDescId: Signal<string> = this._signalService.getSelectedTxnDesc();

  showDateOfRequestTxnDescs: string[] = [
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
    TXN_DESC.CLIN_CLARIF_RESPONSE,
    TXN_DESC.CHSC_RQ_RESPONSE,
    TXN_DESC.EMAIL_RQ_RESPONSE,
    TXN_DESC.HSC_RQ_RESPONSE,
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
  // computed signal for rendering of the "Date of Request" field
  showDateOfRequest: Signal<boolean> = computed(() => {
    return this.showDateOfRequestTxnDescs.includes(this.selectedTxDescId());
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
    TXN_DESC.CHSC_RQ_RESPONSE,
    TXN_DESC.CLIN_CLARIF_RESPONSE,
    TXN_DESC.EMAIL_RQ_RESPONSE,
    TXN_DESC.HSC_RQ_RESPONSE,
    TXN_DESC.LABEL_CLARIF_RESPONSE,
    TXN_DESC.MHPD_RQ_RESPONSE,
    TXN_DESC.NON_RESPONSE,
    TXN_DESC.QUAL_CLIN_CLARIF_RESPONSE,
    TXN_DESC.QUAL_CLARIF_RESPONSE,
    TXN_DESC.QHSC_RQ_RESPONSE,
    TXN_DESC.QCHSC_RQ_RESPONSE,
    TXN_DESC.SCREENING_CLARIF_RESPONSE,
    TXN_DESC.PHONE_RQ_RESPONSE,
    TXN_DESC.UDRA_EMAIL_RQ_RESPONSE,
    TXN_DESC.UDRA_PROCESSING_CLARIF_RESPONSE
  ]
  // computed signal for rendering of the "Date of Request" field
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
    controlNumber: [null, [Validators.required, Validators.minLength(6)]],
    activityLead: [null, [Validators.required]],
    activityType: [null, Validators.required],
    descriptionType: [null, Validators.required],
    dateOfRequest: [null, Validators.required],
    startDate: [null, Validators.required],
    endDate: [null, Validators.required],
    yearsOfChange: [null, Validators.required],
    year: [null, [Validators.required, Validators.minLength(4)]],
    requester1: [null, Validators.required],
    requester2: [null],
    requester3: [null],
    versionNumber: [null, Validators.required],
    briefDescription: [null, [Validators.required]],
    briefDescriptionOfChange: [null, [Validators.required]],
   });
  }

  // this array contains the actions fields related with transaction description
  actionFieldsArray: string[] = ['dateOfRequest', 'startDate', 'endDate', 'yearsOfChange', 'year', 'requester1', 'requester2', 'requester3', 'versionNumber', 'briefDescription', 'briefDescriptionOfChange'];

  // key is the boolean flag, values are the rendered field(s) asscociated with the flag
  // make sure the fields' name are exact same spellings as defined in getTransctionDetailsForm()
  actionFlagFieldsMap: { [key: string]: string[] } = {
    [TXN_DESC_ACTION.SHOW_DATEOFREQUEST]: ['dateOfRequest'],
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
    if (this.showDateOfRequest()) {
      dataModel.sequence_from_date = formValue['dateOfRequest'];
    } else if (this.showStartEndDate()) {
      dataModel.sequence_from_date = formValue['startDate'];
      dataModel.sequence_to_date = formValue['endDate'];
    }
    dataModel.sequence_details = formValue['briefDescription'];
    dataModel.sequence_details_change = formValue['briefDescriptionOfChange'];
    dataModel.sequence_version = formValue['versionNumber'];
    if (this.showYearsOfChange()) {
      dataModel.sequence_year = formValue['yearsOfChange'];
    } else if (this.showYear()) {
      dataModel.sequence_year = formValue['year'];
    }
    dataModel.requester_name = formValue['requester1'];
    dataModel.requester_name2 = formValue['requester2'];
    dataModel.requester_name3 = formValue['requester3'];
    dataModel.requester_of_solicited_information = this._concatRequesterDetails(dataModel.requester_name, dataModel.requester_name2, dataModel.requester_name3);

    dataModel.transaction_description = this._concatTransactionDescriptionDetails(dataModel, lang);
  }

  private _concatTransactionDescriptionDetails(dataModel: LifecycleRecord, lang: string): ITextLabel{
    let labelObj: ITextLabel = this._entityBaseService.getEmptyITextLabel();

    let enConcatText: string | undefined = undefined;
    let frConcatText: string | undefined = undefined;
    const enTxDescription: string = this._utilsService.getLabelFromIdTextLabelByLang(dataModel.sequence_description_value, ENGLISH);
    const frTxDescription: string = this._utilsService.getLabelFromIdTextLabelByLang(dataModel.sequence_description_value, FRENCH);

    if (this.showDateOfRequest() && this.showVersionNum()) {
      enConcatText = this._utilsService.concat(enTxDescription, "version", dataModel.sequence_version, 'dated', dataModel.sequence_from_date)
      frConcatText = this._utilsService.concat(frTxDescription, "version", dataModel.sequence_version, 'daté du', dataModel.sequence_from_date)
    } else if (this.showDateOfRequest()){
      enConcatText = this._utilsService.concat(enTxDescription, 'dated', dataModel.sequence_from_date)
      frConcatText = this._utilsService.concat(frTxDescription, 'daté du', dataModel.sequence_from_date)
    } else if (this.showStartEndDate()){
      enConcatText = this._utilsService.concat("For period of", dataModel.sequence_from_date, "-", dataModel.sequence_to_date)
      frConcatText = this._utilsService.concat("Pour la période de", dataModel.sequence_from_date, "-", dataModel.sequence_to_date)
    } else if (this.showBriefDescriptionOfChange()){
      enConcatText = this._utilsService.concat(enTxDescription, "-", dataModel.sequence_details_change)
      frConcatText = this._utilsService.concat(frTxDescription, "-", dataModel.sequence_details_change)
    } else if (this.showBriefDescription()){
      enConcatText = this._utilsService.concat(enTxDescription, "-", dataModel.sequence_details)
      frConcatText = this._utilsService.concat(frTxDescription, "-", dataModel.sequence_details)
    } else if (this.showYearsOfChange() || this.showYear()){
      enConcatText = this._utilsService.concat(enTxDescription, dataModel.sequence_year)
      frConcatText = this._utilsService.concat(frTxDescription, dataModel.sequence_year)
    } else {
      enConcatText = enTxDescription
      frConcatText = frTxDescription
    }

    labelObj._label_en = enConcatText;
    labelObj._label_fr = frConcatText;

    if (typeof enConcatText === 'undefined' && typeof frConcatText === 'undefined') {
      return null;
    } else {
      let concatText: string | undefined = undefined;
      if (this._utilsService.isFrench(lang)){
        concatText = frConcatText
      } else {
        concatText = enConcatText;
      }
      labelObj.__text = concatText;
      
      return labelObj;
    }
  }

  private _concatRequesterDetails(requester1: string, requester2: string, requester3: string): string{
    let requesters: string[] = []; 

    if (!this._utilsService.isEmpty(requester1)){
      requesters.push(requester1)
    }
    if (!this._utilsService.isEmpty(requester2)){
      requesters.push(requester2)
    }
    if (!this._utilsService.isEmpty(requester3)){
      requesters.push(requester3)
    }

    return requesters.join(LINE_BREAK);
  }

  public mapDataModelToFormModel(dataModel: LifecycleRecord, formRecord: FormGroup): void {

    console.log('dataModel:', dataModel);
    console.log('regulatory_activity_lead:', dataModel.regulatory_activity_lead?._id);
    console.log('regulatory_activity_type:', dataModel.regulatory_activity_type?._id);
    console.log('sequence_description_value:', dataModel.sequence_description_value?._id);


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
    // load both dateOfRequest and startDate's value from dataModel.sequence_from_date, 
    // it will be reset based on computed showDateOfRequest()/showStartEndDate() flags in TransactionDetailsComponent.onSequenceDescriptionSelected method
    formRecord.controls['dateOfRequest'].setValue(dataModel.sequence_from_date);
    formRecord.controls['startDate'].setValue(dataModel.sequence_from_date);
    formRecord.controls['endDate'].setValue(dataModel.sequence_from_date);
    formRecord.controls['briefDescription'].setValue(dataModel.sequence_details);
    formRecord.controls['briefDescriptionOfChange'].setValue(dataModel.sequence_details_change);
    formRecord.controls['versionNumber'].setValue(dataModel.sequence_version);
    // load both yearsOfChange and year's value from dataModel.sequence_year, 
    // it will be reset based on computed showYearsOfChange()/showYear() flags in TransactionDetailsComponent.onSequenceDescriptionSelected method
    formRecord.controls['yearsOfChange'].setValue(dataModel.sequence_year);
    formRecord.controls['year'].setValue(dataModel.sequence_year);
    formRecord.controls['requester1'].setValue(dataModel.requester_name);
    formRecord.controls['requester2'].setValue(dataModel.requester_name2);
    formRecord.controls['requester3'].setValue(dataModel.requester_name3);    
  }  
}
