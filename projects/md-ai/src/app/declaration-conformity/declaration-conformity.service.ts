import { Injectable } from "@angular/core";
import { ConverterService, UtilsService } from "@hpfb/sdk/ui";
import { GlobalService } from "../global/global.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DeclarationComformity } from "../models/Enrollment";

@Injectable()
export class DeclarationConformityService{
    
    constructor(private _utilsService : UtilsService, 
        private _converterService : ConverterService, 
        private _globalService: GlobalService) {
            
        }

    public getReactiveModel(fb : FormBuilder) {
        if (!fb) {
            return null;
        }
        return fb.group({
            declarationConformity : [null, Validators.required]
        })
    }

    public mapFormModelToDataModel(formRecord: any, declarationModel) {
        declarationModel.declaration_conformity = formRecord.declarationConformity;
    } 
    
    public mapDataModelToFormModel(priorityRevModel: DeclarationComformity, formRecord: FormGroup) {
        formRecord.controls['declarationConformity'].setValue(priorityRevModel.declaration_conformity);
    }
}