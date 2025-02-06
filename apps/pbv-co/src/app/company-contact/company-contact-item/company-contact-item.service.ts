import { Injectable } from "@angular/core";
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { CheckboxOption, ConverterService, ICode, UtilsService, ValidationService } from "@hpfb/sdk/ui";
import { NO, YES } from "../../app.constants";
import { GlobalService } from "../../global/global.service";
import { ContactRecord } from "../../models/Company";
import { ROLE_MAPPING, REVERSE_ROLE_MAPPING } from "../../app.constants";


@Injectable()
export class CompanyContactItemService {

    constructor(private _converterService: ConverterService,
                private _globalService: GlobalService) {

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

    public mapFormModelToDataModel(contactFormGroup : FormGroup, contactOutput : ContactRecord)  
    { 
      const companyInfoFormGroup = contactFormGroup['companyInfo'];
      contactOutput.id = contactFormGroup['id'];
      if (companyInfoFormGroup['selectedCompanyRoles']) {
        companyInfoFormGroup['selectedCompanyRoles'].forEach((role: string) => {
          const mappedProperty = ROLE_MAPPING[role];
          if (mappedProperty) {
            contactOutput[mappedProperty] = YES; // Assign a value as needed, assigns to "Y"
          } else {
            contactOutput[mappedProperty] = NO;
          }
        });
      }
    }
    
  
    public mapDataModelToFormModel(companyContact : ContactRecord, formRecord: FormGroup, companyRolesOptionList: CheckboxOption[]) {
      const companyRolesList = this._globalService.companyRolesList;
      const lang = this._globalService.currLanguage;
      if (companyContact) {

        const selectedRoles: string[] = Object.keys(REVERSE_ROLE_MAPPING)
        .filter((key) => companyContact[key] === YES) // Check for "Y"
        .map((key) => REVERSE_ROLE_MAPPING[key]); // Convert back to role IDs

        // Update form model
        formRecord.controls['selectedCompanyRoles'].setValue(selectedRoles);
        if (selectedRoles.length > 0) {
          const companyRolesFormArray = this.getCompanyRolesChkboxFormArray(formRecord);

          this.loadCompanyRoleOptions(companyRolesList, companyRolesOptionList, companyRolesFormArray, lang)
          this._converterService.checkCheckboxes(selectedRoles, companyRolesOptionList, companyRolesFormArray);
        } 
      }
    }

}