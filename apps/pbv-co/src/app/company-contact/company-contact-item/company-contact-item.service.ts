import { Injectable } from "@angular/core";
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { CheckboxOption, ConverterService, ICode, UtilsService, ValidationService } from "@hpfb/sdk/ui";
import { NO, YES } from "../../app.constants";
import { GlobalService } from "../../global/global.service";
import { ContactRecord } from "../../models/Company";


@Injectable()
export class CompanyContactItemService {

    constructor(private _converterService: ConverterService,
                private _utilsService: UtilsService,
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
      console.log(contactFormGroup);
      contactOutput.id = contactFormGroup['id'];
      if (companyInfoFormGroup['selectedCompanyRoles']) {
        companyInfoFormGroup['selectedCompanyRoles'].forEach((role: string) => {
          const mappedProperty = this.ROLE_MAPPING[role];
          if (mappedProperty) {
            contactOutput[mappedProperty] = YES; // Assign a value as needed
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

        const selectedRoles: string[] = Object.keys(this.REVERSE_ROLE_MAPPING)
        .filter((key) => companyContact[key] === "Y") // Check for "Y"
        .map((key) => this.REVERSE_ROLE_MAPPING[key]); // Convert back to role IDs

        // Update form model
        formRecord.controls['selectedCompanyRoles'].setValue(selectedRoles);
        if (selectedRoles.length > 0) {
          const companyRolesFormArray = this.getCompanyRolesChkboxFormArray(formRecord);

          this.loadCompanyRoleOptions(companyRolesList, companyRolesOptionList, companyRolesFormArray, lang)
          console.log(companyRolesList, companyRolesOptionList, companyRolesFormArray);
          this._converterService.checkCheckboxes(selectedRoles, companyRolesOptionList, companyRolesFormArray);
        } 
      }
    }

    private readonly ROLE_MAPPING: { [key: string]: string } = {
      MFR: "manufacturer",
      BILL: "billing",
      MAIL: "mailing",
    };

    private readonly REVERSE_ROLE_MAPPING: { [key: string]: string } = {
      manufacturer: "MFR",
      billing: "BILL",
      mailing: "MAIL",
    };

}