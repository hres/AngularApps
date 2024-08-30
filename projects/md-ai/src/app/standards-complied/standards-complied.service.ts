@@ -0,0 +1,77 @@
import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { CheckboxOption, ConverterService, ICode, UtilsService, ValidationService } from "@hpfb/sdk/ui";
import { GlobalService } from "../global/global.service";
import { DiagnosisReasons, PriorityReview, StandardsComplied } from "../models/Enrollment";

@Injectable()
export class StandardsCompliedService {

    constructor(private _utilsService : UtilsService, 
                private _converterService : ConverterService, 
                private _globalService: GlobalService) {

    }

    public getReactiveModel(fb : FormBuilder) {
        if (!fb) {
            return null;
        }
        return fb.group({
            isPriorityReq: [null, []],
            diagnosisReasons: fb.array([], [ValidationService.atLeastOneCheckboxSelected]),
            selectedDiagnosisCodes: ['']
        })
    }

    public mapFormModelToDataModel(formRecord: any, standardsCompModel, lang) {
        standardsCompModel.declaration_conformity = formRecord.declarationConformity;    
    }   

    public mapDataModelToFormModel(standardsCompModel: StandardsComplied, formRecord: FormGroup, lang) {
        formRecord.controls['declarationConformity'].setValue(standardsCompModel.declaration_conformity);
    }

}