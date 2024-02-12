import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidationService } from '@hpfb/sdk/ui'

@Injectable()
export class CompanyAdminChangesService {

  constructor() {
  }

  /**
   * Gets the reactive forms Model for address details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      licenceNumbers: [null, Validators.required],
      isReguChange: [null, Validators.required],
      newCompanyId: [null, [Validators.required, ValidationService.companyIdValidator]],
      newContactId: ['', [ValidationService.contactIdValidator]],
      newContactName: [null, Validators.required]
    });
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, adminChangesModel, licenceModel) {
    // add licence number and dossier id to all fields
    // let aln = '';
    // licenceModel.forEach(record => {
    //   aln += record.licence_number + ', ';
    // });
    // if (aln.length > 1) {
    //   adminChangesModel.all_licence_number = aln.substring(0, (aln.length - 2));
    // } else {
    //   adminChangesModel.all_licence_number = '';
    // }
    // let adi = '';
    // licenceModel.forEach(record => {
    //   adi += record.dossier_id + ', ';
    // });
    // if (adi.length > 1) {
    //   adminChangesModel.all_dossier_id = adi.substring(0, (adi.length - 2));
    // } else {
    //   adminChangesModel.all_dossier_id = '';
    // }
    // adminChangesModel.licence = licenceModel;
    adminChangesModel.all_licence_numbers = formRecord.controls['licenceNumbers'].value;
    adminChangesModel.is_regulatory_change = formRecord.controls['isReguChange'].value;
    if (formRecord.controls['newCompanyId'].value) {
      adminChangesModel.new_company_id = formRecord.controls['newCompanyId'].value;
    }
    adminChangesModel.new_contact_id = formRecord.controls['newContactId'].value;
    adminChangesModel.new_contact_name = formRecord.controls['newContactName'].value;
  }

  public static mapDataModelToFormModel(adminChangesModel, formRecord: FormGroup) {
    formRecord.controls['licenceNumbers'].setValue(adminChangesModel.all_licence_numbers);
    formRecord.controls['isReguChange'].setValue(adminChangesModel.is_regulatory_change);
    if (adminChangesModel.new_company_id) {
      // Ling to Diana: todo , use COMPANY_ID_PREFIX const, is it case sensitive??
      const cid = (adminChangesModel.new_company_id.indexOf('k') === 0) ?
        adminChangesModel.new_company_id.slice(1) : adminChangesModel.new_company_id;
      formRecord.controls['newCompanyId'].setValue(cid);
    }
    formRecord.controls['newContactId'].setValue(adminChangesModel.new_contact_id);
    formRecord.controls['newContactName'].setValue(adminChangesModel.new_contact_name);
  }
}
