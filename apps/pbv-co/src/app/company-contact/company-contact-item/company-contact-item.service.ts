import { Injectable } from "@angular/core";
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { CheckboxOption, ConverterService, ICode, UtilsService, ValidationService } from "@hpfb/sdk/ui";
import { ContactRecord } from "../../models/Company";


@Injectable()
export class CompanyContactItemService {

    constructor(private _converterService: ConverterService,
                private _utilsService: UtilsService) {

    }

    getCompanyRolesCodes(companyRolesReasonList: CheckboxOption[], companyRolesChkFormArray: FormArray) : string[] {
        return this._converterService.getCheckedCheckboxValues(companyRolesReasonList, companyRolesChkFormArray);
    }

    getCompanyRolesChkboxFormArray(formRecord: FormGroup) {
        return formRecord.controls['companyRoles'] as FormArray;
    }  

    loadCompanyRoleOptions(companyRolesList, companyRolesOptionList, companyRolesChkFormArray, lang) {
        companyRolesOptionList.length = 0;
        companyRolesChkFormArray.clear();
    
       
        // Populate the array with new items
        companyRolesList.forEach((item) => {
          const checkboxOption = this._converterService.convertCodeToCheckboxOption(item, lang);
          companyRolesOptionList.push(checkboxOption);
          companyRolesChkFormArray.push(new FormControl(false));
        });
        
    }

}