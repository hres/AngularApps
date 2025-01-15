import { inject, Injectable } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { UtilsService } from "@hpfb/sdk/ui";
import { ENROLMENT_STATUS } from "../app.constants";
import { CompanyEnrol } from "../models/Company";
import { AppSignalService } from "../signal/app-signal.service";

@Injectable()
export class CompanyEnrolmentService {
  private _signalService = inject(AppSignalService);
  private _utilsService = inject(UtilsService);


  public static getEnrolmentForm(fb:FormBuilder) {
      if (!fb) {
        return null;
      }
      return fb.group({
        enrolmentStatus: [ENROLMENT_STATUS.NEW],
        enrolmentVersion: ['0.0'],
        dateLastSaved: [null],
        companyId: [null],
        reasonForFiling: [null, [Validators.required]]
      });
    }

  public mapFormModelToDataModel(dataModel:CompanyEnrol, formModel) {
    const isInternal = this._signalService.getIsInternal()();

    dataModel.application_type = formModel['enrolmentStatus'];
    dataModel.enrolment_version = this._incrementEnrolmentVersion(isInternal, formModel['enrolmentVersion']);
    dataModel.date_saved = this._utilsService.getFormattedDate('yyyy-MM-dd-hhmm');
    if (isInternal) {
      dataModel.company_id = formModel['companyId'];
    }
    dataModel.reason_amend = formModel['reasonForFiling'];
  }

  public mapDataModelToFormModel(dataModel : CompanyEnrol, formModel) {
    formModel.controls['enrolmentStatus'].setValue(dataModel.application_type);
    formModel.controls['enrolmentVersion'].setValue(dataModel.enrolment_version);
    formModel.controls['dateLastSaved'].setValue(dataModel.date_saved.substring(0, 10)); // Date is set to YYYY-MM-DD
    formModel.controls['companyId'].setValue(dataModel.company_id);
    formModel.controls['reasonForFiling'].setValue(dataModel.reason_amend);
  }

  private _incrementEnrolmentVersion(isInternal : boolean, currentVersion) : string { 
    return (parseFloat(currentVersion) + (isInternal ? 1.0 : 0.1)).toString();
  }

}