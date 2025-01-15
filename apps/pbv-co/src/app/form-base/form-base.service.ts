import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { EntityBaseService, UtilsService } from '@hpfb/sdk/ui';
import { ROOT_TAG } from '../app.constants';
import { AddressRecord, Company, CompanyEnrol, ContactRecord } from '../models/Company';
import { CompanyEnrolmentService } from '../company-enrolment/company-enrolment.service';

@Injectable()
export class FormBaseService {

  constructor(
    private _entityBaseService: EntityBaseService, 
    private _utilsService: UtilsService, 
    private _globalService: GlobalService,
    private _companyEnrolmentService: CompanyEnrolmentService) {
  }

  /**
   * Gets the reactive forms Model for generalInfo details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {
      return null;
    }
    return fb.group({
      certifyPrivacy: [false, Validators.required],
    });
  }

  public getEmptyEnrol(): Company{
    const enrollment:  Company = {
      COMPANY_ENROL: this.getEmptyCompanyEnrol()
    };
    
    return enrollment;
  }

  public getEmptyCompanyEnrol(): CompanyEnrol {
    const companyEnrol: CompanyEnrol = {
      template_type: 'PHARMA',
      date_saved: undefined,
      software_version: '',
      form_language: '',
      check_sum: '',
      application_type: this._entityBaseService.getEmptyIdTextLabel(),
      enrolment_version: '',
      company_id: '',
      reason_amend: '',
      address_record: this.getEmptyAddressRecord(),
      contact_record: this.getEmptyContactRecord()
    };
    
    return companyEnrol;
  }

  public getEmptyAddressRecord(): AddressRecord[] {
    return null;
  }

  public getEmptyContactRecord(): ContactRecord[] {
    return null;
  }

  public mapCompanyEnrolmentToOutput(outputCompanyEnrol: CompanyEnrol, companyEnrolmentGroupValue: any): void{
    this._companyEnrolmentService.mapFormModelToDataModel(outputCompanyEnrol, companyEnrolmentGroupValue);
  }
}
