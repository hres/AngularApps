import { inject, Injectable } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { UtilsService } from "@hpfb/sdk/ui";
import { ENROLMENT_STATUS } from "../app.constants";
import { CompanyEnrol } from "../models/Company";
import { AppSignalService } from "../signal/app-signal.service";

@Injectable()
export class RegulatoryEnrolmentService {
  private _signalService = inject(AppSignalService);
  private _utilsService = inject(UtilsService);


  public static getFeesForm(fb:FormBuilder) {
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
    dataModel.date_saved = this._utilsService.getFormattedDate('yyyy-MM-dd');
    if (isInternal) {
      dataModel.company_id = formModel['companyId'];
    }
    dataModel.reason_amend = formModel['reasonForFiling'];
  }

  public mapDataModelToFormModel(dataModel, formModel) {

  }

  private _incrementEnrolmentVersion(isInternal : boolean, currentVersion) : string { 
    return (parseFloat(currentVersion) + (isInternal ? 1.0 : 0.1)).toString();
  }

}