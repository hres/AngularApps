import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { CheckboxOption, ConverterService, ICode, UtilsService, ValidationService } from "@hpfb/sdk/ui";
import { GlobalService } from "../global/global.service";
import { DiagnosisReasons, PriorityReview } from "../models/Enrollment";

@Injectable()
export class PriorityReviewService {

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

    getSelectedDiagnosisCodes(seriousDiagnosisReasonList: CheckboxOption[], diagnosisReasonChkFormArray: FormArray) : string[] {
        return this._converterService.getCheckedCheckboxValues(seriousDiagnosisReasonList, diagnosisReasonChkFormArray);
    }

    getDiagnosisChkboxFormArray(formRecord: FormGroup) {
        return formRecord.controls['diagnosisReasons'] as FormArray;
    }  

    loadDiagnosisReasonOptions(diagnosisList, seriousDiagnosisReasonOptionList, diagnosisReasonChkFormArray, lang) {
        seriousDiagnosisReasonOptionList.length = 0;
        diagnosisReasonChkFormArray.clear();
    
       
        // Populate the array with new items
        diagnosisList.forEach((item) => {
          const checkboxOption = this._converterService.convertCodeToCheckboxOption(item, lang);
          seriousDiagnosisReasonOptionList.push(checkboxOption);
          diagnosisReasonChkFormArray.push(new FormControl(false));
        });
        
    }


    public mapFormModelToDataModel(formRecord: any, priorityRevModel, lang) {
        priorityRevModel.priority_review = formRecord.isPriorityReq;

        const diagnosisReasonList = this._globalService.$diagnosisReasonList;

        priorityRevModel.priority_review = formRecord.isPriorityReq;
        if (formRecord.selectedDiagnosisCodes) {
            const reasons: DiagnosisReasons = {
                diagnosis_reason: this._converterService.findAndConverCodesToIdTextLabels(diagnosisReasonList, formRecord.selectedDiagnosisCodes, lang)
            }
            priorityRevModel.is_diagnosis_treatment_serious = reasons;
        }
    }   

    public mapDataModelToFormModel(priorityRevModel: PriorityReview, formRecord: FormGroup, diagnosisReasonList: ICode[], diagnosisOptionList: CheckboxOption[], lang) {
        formRecord.controls['isPriorityReq'].setValue(priorityRevModel.priority_review);

        if (priorityRevModel) {
            const loadedDiagnosisCodes: string[] = this._utilsService.getIdsFromIdTextLabels(priorityRevModel.is_diagnosis_treatment_serious.diagnosis_reason);
            if (loadedDiagnosisCodes.length > 0) {
              const diagnosisFormArray = this.getDiagnosisChkboxFormArray(formRecord);
              this.loadDiagnosisReasonOptions(diagnosisReasonList, diagnosisOptionList, diagnosisFormArray, lang)
              this._converterService.checkCheckboxes(loadedDiagnosisCodes, diagnosisOptionList, diagnosisFormArray);
            }  
        }
    }
    
}