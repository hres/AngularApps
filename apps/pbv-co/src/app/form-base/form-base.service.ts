import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { EntityBaseService, UtilsService } from '@hpfb/sdk/ui';
import { ROOT_TAG } from '../app.constants';
import { AddressRecord, Company, CompanyEnrol, ContactRecord } from '../models/Company';
import { CompanyEnrolmentService } from '../company-enrolment/company-enrolment.service';
import { ContactDetailsService } from '@hpfb/pbv';
import { EntityBasePbvService } from '@hpfb/pbv';
import { CompanyContactItemService } from '../company-contact/company-contact-item/company-contact-item.service';

@Injectable()
export class FormBaseService {

  constructor(
    private _entityBaseService: EntityBaseService, 
    private _utilsService: UtilsService, 
    private _globalService: GlobalService,
    private _companyEnrolmentService: CompanyEnrolmentService,
    private _entityBasePbvService: EntityBasePbvService,
    private _contactDetailsService: ContactDetailsService,
    private _companyContactItemService: CompanyContactItemService) {
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
      address_record: this.getEmptyAddressRecordList(),
      contact_record: this.getEmptyContactRecordList(),
      product_line_checkbox: null
    };
    
    return companyEnrol;
  }

  public getEmptyAddressRecordList(): AddressRecord[] {
    return [];
  }

  public getEmptyContactRecordList(): ContactRecord[] {
    return [];
  }
  
  public getEmptyContactRecord(): ContactRecord {
    const contactRecord : ContactRecord = {
      manufacturer: '',
      mailing: '',
      billing: '',
      company_contact_details: this._entityBasePbvService.getEmptyContactModel(),
      id: null
    }
    return contactRecord;
  }

  public getEmptyAddressRecord(): AddressRecord {
    const addressRecord : AddressRecord = {
      manufacturer: '',
      mailing: '',
      billing: '',
      company_name: '',
      business_number: '',
      company_address_details: this._entityBasePbvService.getEmptyAddressDetailsModel(),
      id: null
    }
    return addressRecord;
  }

  public mapCompanyEnrolmentToOutput(outputCompanyEnrol: CompanyEnrol, companyEnrolmentGroupValue: any, isInternal:boolean): void{
    this._companyEnrolmentService.mapFormModelToDataModel(outputCompanyEnrol, companyEnrolmentGroupValue, isInternal);
  }
  
  public mapContactsFormToOutput(companyEnrol: CompanyEnrol, contactsFormArray) {
    const lang = this._globalService.currLanguage;
    const languageList = this._globalService.languageList;

    let contactModelList = [];
    
    if (contactsFormArray) {
      for (let i = 0; i < contactsFormArray.length; i++) {
        console.log(contactsFormArray[i]);
        let contactModel: ContactRecord = this.getEmptyContactRecord();
        // TODO: Call function to map company roles
        this._companyContactItemService.mapFormModelToDataModel(contactsFormArray[i]['companyInfo'], contactModel);
        this._contactDetailsService.mapFormModelToDataModel(contactsFormArray[i]['companyInfo']['contactDetails'], contactModel.company_contact_details , lang, languageList);
        contactModelList.push(contactModel);
      }
    }

    companyEnrol.contact_record = contactModelList;
  }
}
