import { Injectable } from "@angular/core";
import { FormArray, FormControl, FormGroup, FormBuilder } from "@angular/forms";
import { ConverterService, UtilsService } from "@hpfb/sdk/ui";
import { GlobalService } from "../../global/global.service";
import { AppSignalService } from "../../signal/app-signal.service";
import { Ingredient } from "../../models/ProductInformation";
import { IngredientFormulationService } from "../ingredient-formulation.service";
@Injectable()
export class IngredientFormulationItemService {
    
    constructor(private _converterService: ConverterService,
        private _globalService: GlobalService,
        private _signalService: AppSignalService,
        private _utilsService: UtilsService,
        private _ingredFormService: IngredientFormulationService) {

    }

    public mapFormModelToDataModel(ingredientFormGroupRecord : FormGroup, ingredientOutput : Ingredient)  {   
        const lang = this._globalService.getCurrLanguage();
        const roleList = this._globalService.rolesList;
        const operatorList = this._globalService.operatorList;
        const unitsList = this._globalService.unitsList;
        const perList = this._globalService.perList;
        const unitMeasureList = this._globalService.unitMeasureList;
        const unitPrsentationList = this._globalService.unitPresentationList;
        const nanomaterialList = this._globalService.nanomaterialList;
        const calculatedBaseList = this._globalService.calculatedBaseList;
    
        ingredientOutput.id = ingredientFormGroupRecord['id'];

        const ingredientForm = ingredientFormGroupRecord['ingredientFormulation'];
        
        const roleCodeValue = this._utilsService.findCodeById(roleList, ingredientForm['role']);
        ingredientOutput.role = roleCodeValue? this._converterService.convertCodeToIdTextLabel(roleCodeValue, lang) : null;

        ingredientOutput.ingredient_name = ingredientForm['ingredientName'];
        ingredientOutput.proprietary_attestation = ingredientForm['attestDetails'];
        ingredientOutput.variant_name = ingredientForm['formulationVariantName'];
        ingredientOutput.purpose = ingredientForm['purpose'];
        ingredientOutput.cas_number = ingredientForm['chemicalService'];
        ingredientOutput.ingred_standard = ingredientForm['standard'];

        const operatorCodeValue = this._utilsService.findCodeById(operatorList, ingredientForm['operator']);
        ingredientOutput.operator = operatorCodeValue? this._converterService.convertCodeToIdTextLabel(roleCodeValue, lang) : null;

        ingredientOutput.value = ingredientForm['operatorValue'];
        ingredientOutput.lower_limit = ingredientForm['lowerLimit'];
        ingredientOutput.upper_limit = ingredientForm['upperLimit'];

        const unitsCodeValue = this._utilsService.findCodeById(unitsList, ingredientForm['units']);
        ingredientOutput.units = unitsCodeValue? this._converterService.convertCodeToIdTextLabel(unitsCodeValue, lang) : null;

        ingredientOutput.units_other = ingredientForm['unitsOther'];
        ingredientOutput.per = ingredientForm['per'];

        const perCodeValue = this._utilsService.findCodeById(perList, ingredientForm['per']);
        ingredientOutput.per = unitsCodeValue? this._converterService.convertCodeToIdTextLabel(perCodeValue, lang) : null;

        ingredientOutput.per_value = ingredientForm['perValue'];
        
        // TODO: Write proper logic for this field
        ingredientOutput.per_units = ingredientForm['unitOfPresentation'] || ingredientForm['unitOfMeasure'];
        
        ingredientOutput.per_units_other_details = ingredientForm['measureOtherDetails'];

        const calcBasedCodeValue = this._utilsService.findCodeById(calculatedBaseList, ingredientForm['calculatedBase']);
        ingredientOutput.is_base_calc = calcBasedCodeValue? this._converterService.convertCodeToIdTextLabel(calcBasedCodeValue, lang) : null;
        ingredientOutput.is_nanomaterial = ingredientForm['isNanomaterial'];

        const nanoMaterialCodeValue = this._utilsService.findCodeById(nanomaterialList, ingredientForm['nanomaterial']);
        ingredientOutput.nanomaterial = nanoMaterialCodeValue? this._converterService.convertCodeToIdTextLabel(nanoMaterialCodeValue, lang) : null;

        ingredientOutput.is_animal_human_material = ingredientForm['isAnimalHumanSourced'];

        // TODO: Dropdown fields have a different way of mapping:
        // For example:
        // const specFamilyCodeValue = this._utilsService.findCodeById(speciesList, materialInfo.specFamily);
        // materialModel.family_of_species = specFamilyCodeValue? this._converterService.convertCodeToIdTextLabel(specFamilyCodeValue, this._globalService.lang()) : '';
    
    }
    
  
    public mapDataModelToFormModel(ingredientOutput : Ingredient, ingredientFormGroup: FormGroup) {
        ingredientFormGroup.controls['role'].setValue(ingredientOutput.role._id);
        ingredientFormGroup.controls['ingredientName'].setValue(ingredientOutput.ingredient_name);
        ingredientFormGroup.controls['attestDetails'].setValue(ingredientOutput.proprietary_attestation);
        ingredientFormGroup.controls['formulationVariantName'].setValue(ingredientOutput.variant_name);
        ingredientFormGroup.controls['purpose'].setValue(ingredientOutput.purpose);
        ingredientFormGroup.controls['chemicalService'].setValue(ingredientOutput.cas_number);
        ingredientFormGroup.controls['standard'].setValue(ingredientOutput.ingred_standard);
        ingredientFormGroup.controls['operator'].setValue(ingredientOutput.operator._id);
        ingredientFormGroup.controls['operatorValue'].setValue(ingredientOutput.value);
        ingredientFormGroup.controls['lowerLimit'].setValue(ingredientOutput.lower_limit);
        ingredientFormGroup.controls['upperLimit'].setValue(ingredientOutput.upper_limit);
        ingredientFormGroup.controls['units'].setValue(ingredientOutput.units._id);
        ingredientFormGroup.controls['unitsOther'].setValue(ingredientOutput.units_other);
        ingredientFormGroup.controls['per'].setValue(ingredientOutput.per._id);
        ingredientFormGroup.controls['perValue'].setValue(ingredientOutput.per_value);
        
        // TODO: Write the correct logic for mapping unit of measure and unit of presentation
        // Output represents either measure or presentation
        ingredientFormGroup.controls['unitOfMeasure'].setValue(ingredientOutput.per_units);
        ingredientFormGroup.controls['unitOfPresentation'].setValue(ingredientOutput.per_units);

        ingredientFormGroup.controls['measureOtherDetails'].setValue(ingredientOutput.per_units_other_details);
        ingredientFormGroup.controls['calculatedBase'].setValue(ingredientOutput.is_base_calc._id);
        ingredientFormGroup.controls['isNanomaterial'].setValue(ingredientOutput.is_nanomaterial);
        ingredientFormGroup.controls['nanomaterial'].setValue(ingredientOutput.nanomaterial._id);
        ingredientFormGroup.controls['isAnimalHumanSourced'].setValue(ingredientOutput.is_animal_human_material);

    }

}