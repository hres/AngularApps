import { Injectable } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

@Injectable()
export class RegulatoryEnrolmentService {

    public static getFeesForm(fb:FormBuilder) {
        if (!fb) {
          return null;
       }
       return fb.group({
         enrolmentStatus: [null],
         enrolmentVersion: [null],
         dateLastSaved: [null],
         companyId: [null],
         reasonForFiling: [null, [Validators.required]]
       });
      }


    public mapDataModelToFormModel(dataModel, formModel) {

    }

    public mapFormModelToDataModel(dataModel, formModel) {

    }

}