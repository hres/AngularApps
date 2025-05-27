import { Injectable } from "@angular/core";
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { CheckboxOption, ConverterService, ICode, UtilsService, ValidationService } from "@hpfb/sdk/ui";
import { YES, NO } from "../../app.constants";
import { GlobalService } from "../../global/global.service";
import { ContactRecord } from "../../models/Company";
import { ROLE_MAPPING, REVERSE_ROLE_MAPPING } from "../../app.constants";
import { AppSignalService } from "../../signal/app-signal.service";


@Injectable()
export class CompanyContactItemService {

    constructor(private _converterService: ConverterService,
                private _globalService: GlobalService,
                private _signalService: AppSignalService) {

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

    getSelectedCompanyRolesFromOutputModel(outputModel : ContactRecord) {
      const selectedRoles = this.getSelectedContactCompanyRoles(outputModel);
      const rolesArray: boolean[] = [
        outputModel.manufacturer === YES, // Index 0: manufacturer
        outputModel.mailing === YES,      // Index 1: mailing
        outputModel.billing === YES       // Index 2: billing
      ];

      return [selectedRoles, rolesArray];
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
    
  
    public mapDataModelToFormModel(companyContact : ContactRecord, formRecord: FormGroup, companyRolesOptionList: CheckboxOption[], id) {
      const companyRolesList = this._globalService.companyRolesList;
      const lang = this._globalService.currLanguage;
      if (companyContact) {

        const selectedRoles = this.getSelectedContactCompanyRoles(companyContact);
        this._mapCompanyRolesToSignal(selectedRoles, id);
        // Update form model
        formRecord.controls['selectedCompanyRoles'].setValue(selectedRoles);
        if (selectedRoles.length > 0) {
          formRecord.controls['isRoleSelected'].setValue(true);
          const companyRolesFormArray = this.getCompanyRolesChkboxFormArray(formRecord);

          this.loadCompanyRoleOptions(companyRolesList, companyRolesOptionList, companyRolesFormArray, lang)
          this._converterService.checkCheckboxes(selectedRoles, companyRolesOptionList, companyRolesFormArray);
        } 
      }
    }

    private _mapCompanyRolesToSignal(selectedCompanyRoles : string[], id) {
      if (this._signalService.getSelectedContactCompanyRoles().length > 0) {
        this._signalService.resetContactCompanyRoles();
      }

      selectedCompanyRoles.forEach(role => {
        this._signalService.updateContactCompanyRoles(`${id}${role}`);
      });    
    }

    
    getSelectedContactCompanyRoles(companyAddress : ContactRecord) {
      const selectedRoles: string[] = Object.keys(REVERSE_ROLE_MAPPING)
        .filter((key) => companyAddress[key] === YES) // Check for "Y"
        .map((key) => REVERSE_ROLE_MAPPING[key]); // Convert back to role IDs

      return selectedRoles;
    }

}