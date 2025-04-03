import { Injectable } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { CheckboxOption, ConverterService } from "@hpfb/sdk/ui";
import { YES, NO } from "../../app.constants";
import { GlobalService } from "../../global/global.service";
import { AddressRecord } from "../../models/Company";
import { ROLE_MAPPING, REVERSE_ROLE_MAPPING } from "../../app.constants";
import { AppSignalService } from "../../signal/app-signal.service";

@Injectable()
export class CompanyAddressItemService {
    
    constructor(private _converterService: ConverterService,
        private _globalService: GlobalService,
        private _signalService: AppSignalService) {

    }

    getCompanyRolesCodes(companyRolesReasonList: CheckboxOption[], companyRolesChkFormArray: FormArray) : string[] {
        return this._converterService.getCheckedCheckboxValues(companyRolesReasonList, companyRolesChkFormArray);
    }

    getCompanyRolesChkboxFormArray(formRecord: FormGroup) {
        return formRecord.controls['addressCompanyRoles'] as FormArray;
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

    getSelectedCompanyRolesFromOutputModel(outputModel : AddressRecord) {
      const selectedRoles = this.getSelectedAddressCompanyRoles(outputModel);
      const rolesArray: boolean[] = [
        outputModel.manufacturer === YES, // Index 0: manufacturer
        outputModel.mailing === YES,      // Index 1: mailing
        outputModel.billing === YES       // Index 2: billing
      ];

      return [selectedRoles, rolesArray];
    }

    public mapFormModelToDataModel(contactFormGroup : FormGroup, addressOutput : AddressRecord)  
    {   
      addressOutput.id = contactFormGroup['id'];

      const companyInfoFormGroup = contactFormGroup['addressInfo'];
      addressOutput.company_name = companyInfoFormGroup['companyName'];
      addressOutput.business_number = companyInfoFormGroup['businessNum'];
      if (companyInfoFormGroup['selectedAddressCompanyRoles']) {
        companyInfoFormGroup['selectedAddressCompanyRoles'].forEach((role: string) => {
          const mappedProperty = ROLE_MAPPING[role];
          if (mappedProperty) {
            addressOutput[mappedProperty] = YES; // Assign a value as needed, assigns to "Y"
          } else {
            addressOutput[mappedProperty] = NO;
          }
        });
      }

    }
    
  
    public mapDataModelToFormModel(companyAddress : AddressRecord, formRecord: FormGroup, companyRolesOptionList: CheckboxOption[], id) {
      formRecord.controls['companyName'].setValue(companyAddress.company_name);
      formRecord.controls['businessNum'].setValue(companyAddress.business_number);

      const companyRolesList = this._globalService.companyRolesList;
      const lang = this._globalService.currLanguage;
      if (companyAddress) {

        // Update form model
        const selectedRoles = this.getSelectedAddressCompanyRoles(companyAddress);
        this._mapCompanyRolesToSignal(selectedRoles, id);
        formRecord.controls['selectedAddressCompanyRoles'].setValue(selectedRoles);
        if (selectedRoles.length > 0) {
          const companyRolesFormArray = this.getCompanyRolesChkboxFormArray(formRecord);

          this.loadCompanyRoleOptions(companyRolesList, companyRolesOptionList, companyRolesFormArray, lang)
          this._converterService.checkCheckboxes(selectedRoles, companyRolesOptionList, companyRolesFormArray);
        } 
      }
    }

    private _mapCompanyRolesToSignal(selectedCompanyRoles : string[], id) {
      if (this._signalService.getSelectedAddressCompanyRoles().length > 0) {
        this._signalService.resetAddressCompanyRoles();
      }

      selectedCompanyRoles.forEach(role => {
        this._signalService.updateAddressCompanyRoles(`${id}${role}`);
      });    
    }

    getSelectedAddressCompanyRoles(companyAddress : AddressRecord) {
      const selectedRoles: string[] = Object.keys(REVERSE_ROLE_MAPPING)
        .filter((key) => companyAddress[key] === YES) // Check for "Y"
        .map((key) => REVERSE_ROLE_MAPPING[key]); // Convert back to role IDs

      return selectedRoles;
    }


}