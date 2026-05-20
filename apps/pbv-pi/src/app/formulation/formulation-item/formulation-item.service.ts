import { Injectable } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ConverterService, UtilsService } from "@hpfb/sdk/ui";
import { GlobalService } from "../../global/global.service";
import { AppSignalService } from "../../signal/app-signal.service";
import { Formulation } from "../../models/ProductInformation";

@Injectable()
export class FormulationItemService {

    constructor(private _converterService: ConverterService,
        private _globalService: GlobalService,
        private _signalService: AppSignalService,
        private _utilsService: UtilsService) {

    }

    public mapFormModelToDataModel(formulationFormGroupRecord : FormGroup, formulationOutput : Formulation)  {   
        const dosageFormList = this._globalService.dosageFormList;
        const lang = this._globalService.getCurrLanguage();

        formulationOutput.id = formulationFormGroupRecord['id'];

        const formulationFormGroup = formulationFormGroupRecord['formulation'];

        formulationOutput.formulation_name = formulationFormGroup['formulationName'];

        const dosageCodeValue = this._utilsService.findCodeById(dosageFormList, formulationFormGroup['dosageForm']);
        formulationOutput.dosage_form = dosageCodeValue? this._converterService.convertCodeToIdTextLabel(dosageCodeValue, lang) : null;
    }

    public mapDataModelToFormModel(formulationOutput : Formulation, formulationFormGroup: FormGroup) {
        formulationFormGroup.controls['formulationName'].setValue(formulationOutput.formulation_name);
        formulationFormGroup.controls['dosageForm'].setValue(formulationOutput.dosage_form._id);
    }
}