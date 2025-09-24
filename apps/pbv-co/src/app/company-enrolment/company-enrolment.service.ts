import { inject, Injectable } from "@angular/core";
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from "@angular/forms";
import { ConverterService, ICode, ENGLISH, UtilsService, ValidationService, CheckboxOption } from "@hpfb/sdk/ui";
import { ENROLMENT_STATUS } from "../app.constants";
import { GlobalService } from "../global/global.service";
import { CompanyEnrol, ProductLine } from "../models/Company";
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
        companyId: [null, [Validators.required, ValidationService.numeric5Validator]],
        reasonForFiling: [null, [Validators.required]],
      });
  }

  public mapFormModelToDataModel(dataModel:CompanyEnrol, coEnrolFormModel:any, isInternal:boolean, isXmlFile:boolean) {
    const lang = this._globalService.currLanguage;
    const enrolmentStatusesList = this._globalService.enrolmentStatusList;

    if (isInternal) {
      dataModel.application_type = this._converterService.findAndConverCodeToIdTextLabel(enrolmentStatusesList, ENROLMENT_STATUS.FINAL, lang);
    } else {
      dataModel.application_type = this._converterService.findAndConverCodeToIdTextLabel(enrolmentStatusesList, coEnrolFormModel.enrolmentStatus, lang);
    }

    if (!isXmlFile && isInternal) {
      dataModel.enrolment_version = coEnrolFormModel['enrolmentVersion']
    } else {
      dataModel.enrolment_version = this._incrementEnrolmentVersion(isInternal, coEnrolFormModel['enrolmentVersion']);
    }
    dataModel.date_saved = this._utilsService.getFormattedDate('yyyy-MM-dd-HHmm');
    dataModel.company_id = coEnrolFormModel['companyId'];
    dataModel.reason_amend = coEnrolFormModel['reasonForFiling'];
  }

  public mapDataModelToFormModel(dataModel : CompanyEnrol, formModel:any) {
    const lang = this._globalService.currLanguage;
    const enrolmentStatusesList = this._globalService.enrolmentStatusList;

    if (dataModel.application_type._id) {
      this.setEnrolmentStatus(formModel, dataModel.application_type._id, enrolmentStatusesList, lang, true); 
    } else {
      const status = dataModel.application_type
      this.setEnrolmentStatus(formModel, status, enrolmentStatusesList, lang, true); 
    }

    formModel.controls['enrolmentVersion'].setValue(dataModel.enrolment_version);
    formModel.controls['dateLastSaved'].setValue(dataModel.date_saved.substring(0, 10)); // Date is set to YYYY-MM-DD
    formModel.controls['companyId'].setValue(dataModel.company_id);
    formModel.controls['reasonForFiling'].setValue(dataModel.reason_amend);
  }

  private _incrementEnrolmentVersion(isInternal: boolean, currentVersion: string): string {
    const parts = currentVersion.split('.').map(Number);

    if (isInternal) {
        // Internal: Round up to the nearest whole number (X.0)
        parts[0] = Math.ceil(parts[0] + 1);
        parts[1] = 0;
    } else {
        // External: Increment decimal by 0.1
        parts[1] += 1;
    }

    return `${parts[0]}.${parts[1]}`;
  }

  public setEnrolmentStatus(formRecord, statusId, enrollmentStatusList: ICode[], lang:string, setStatusAlso:boolean) {
    if (setStatusAlso) {
      formRecord.controls['enrolmentStatus'].setValue(statusId);  
    }
    formRecord.controls['enrolmentStatusText'].setValue(this._utilsService.findAndTranslateCode(enrollmentStatusList, lang, statusId));
  }
}