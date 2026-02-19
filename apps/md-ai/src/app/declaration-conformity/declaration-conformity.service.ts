import { Injectable } from "@angular/core";
import { ConverterService, UtilsService } from "@hpfb/sdk/ui";
import { GlobalService } from "../global/global.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DeclarationComformity } from "../models/Enrollment";
import { ApplicationInfoDetailsService } from "../application-info-details/application-info.details.service";

@Injectable()
export class DeclarationConformityService{

    constructor(private _utilsService : UtilsService,
        private _converterService : ConverterService,
        private _globalService: GlobalService,
       private _appInfoService: ApplicationInfoDetailsService) {

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
        declarationModel.recognized_standard = '';
        declarationModel.declaration_conformity ='';
       if(this._appInfoService.deviceClassII()){
        declarationModel.recognized_standard = formRecord.declarationConformity;
       }else{
        declarationModel.declaration_conformity = formRecord.declarationConformity;
       }
    }

    public mapDataModelToFormModel(declarationModel: DeclarationComformity, formRecord: FormGroup) {
        if (declarationModel) {
            formRecord.controls['declarationConformity'].setValue(declarationModel.declaration_conformity);
        }
    }
}