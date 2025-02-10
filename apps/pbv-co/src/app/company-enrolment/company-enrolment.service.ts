import { inject, Injectable } from "@angular/core";
import { FormBuilder, Validators, FormArray, FormGroup } from "@angular/forms";
import { ConverterService, ICode, UtilsService, ValidationService, CheckboxOption } from "@hpfb/sdk/ui";
import { ENROLMENT_STATUS } from "../app.constants";
import { GlobalService } from "../global/global.service";
import { CompanyEnrol } from "../models/Company";
import { AppSignalService } from "../signal/app-signal.service";

@Injectable()
export class CompanyEnrolmentService {
  private _signalService = inject(AppSignalService);
  private _utilsService = inject(UtilsService);
  private _converterService = inject(ConverterService);
  private _globalService = inject(GlobalService);


  public static getEnrolmentForm(fb:FormBuilder) {
      if (!fb) {
        return null;
      }
      return fb.group({
        enrolmentStatus: [ENROLMENT_STATUS.NEW],
        enrolmentStatusText: '', // UI Display
        enrolmentVersion: ['0.0'],
        dateLastSaved: [null],
        companyId: [null],
        reasonForFiling: [null, [Validators.required]],
        // productLine: [null, [Validators.required]]

        productLine: fb.array([], [ValidationService.atLeastOneCheckboxSelected]),
        selectedProductLines: ['']
      });
    }

  public mapFormModelToDataModel(dataModel:CompanyEnrol, coEnrolFormModel:any, isInternal:boolean) {
    const lang = this._globalService.currLanguage;
    const enrolmentStatusesList = this._globalService.enrolmentStatusList;

    dataModel.application_type = this._converterService.findAndConverCodeToIdTextLabel(enrolmentStatusesList, coEnrolFormModel.enrolmentStatus, lang);
    dataModel.enrolment_version = this._incrementEnrolmentVersion(isInternal, coEnrolFormModel['enrolmentVersion']);
    dataModel.date_saved = this._utilsService.getFormattedDate('yyyy-MM-dd-hhmm');
    if (isInternal) {
      dataModel.company_id = coEnrolFormModel['companyId'];
    }
    dataModel.reason_amend = coEnrolFormModel['reasonForFiling'];
    dataModel.product_line_checkbox = coEnrolFormModel['productLine'];
  }

  public mapDataModelToFormModel(dataModel : CompanyEnrol, formModel:any) {
    const lang = this._globalService.currLanguage;
    const enrolmentStatusesList = this._globalService.enrolmentStatusList;

    this.setEnrolmentStatus(formModel, dataModel.application_type._id, enrolmentStatusesList, lang, true); 

    formModel.controls['enrolmentVersion'].setValue(dataModel.enrolment_version);
    formModel.controls['dateLastSaved'].setValue(dataModel.date_saved.substring(0, 10)); // Date is set to YYYY-MM-DD
    formModel.controls['companyId'].setValue(dataModel.company_id);
    formModel.controls['reasonForFiling'].setValue(dataModel.reason_amend);
    formModel.controls['productLine'].setValue(dataModel.product_line_checkbox);
  }

  private _incrementEnrolmentVersion(isInternal : boolean, currentVersion) : string { 
    return (parseFloat(currentVersion) + (isInternal ? 1.0 : 0.1)).toString();
  }

  public setEnrolmentStatus(formRecord, statusId: string, enrollmentStatusList: ICode[], lang:string, setStatusAlso:boolean) {
    if (setStatusAlso) {
      formRecord.controls['enrolmentStatus'].setValue(statusId);  
    }
    formRecord.controls['enrolmentStatusText'].setValue(this._utilsService.findAndTranslateCode(enrollmentStatusList, lang, statusId));
  }

  getProductLineCodes(productLineReasonList: CheckboxOption[], productLineChkFormArray: FormArray) : string[] {
    return this._converterService.getCheckedCheckboxValues(productLineReasonList, productLineChkFormArray);
  }

  getProductLineChkboxFormArray(formRecord: FormGroup) {
      return formRecord.controls['productLine'] as FormArray;
  } 

}