import { Injectable } from '@angular/core';
import { Contact, IIdText, IIdTextLabel, INameAddress } from './entity-base';

@Injectable()
export class EntityBaseService {
  getEmptyIdTextLabel(): IIdTextLabel {
    return {
      __text: '',
      _id: '',
      _label_en: '',
      _label_fr: '',
    };
  }

  getEmptyIIdText(): IIdText {
    return {
      __text: '',
      _id: '',
    };
  }

  getEmptyAddressDetailsModel(): INameAddress {
    return {
      company_name: '',
      street_address: '',
      city: '',
      country: this.getEmptyIdTextLabel(),
      province_lov: this.getEmptyIdTextLabel(),
      province_text: '',
      postal_code: '',
    };
  }

  getEmptyContactModel(): Contact {
    return {
      id: null,
      contact_id: '',
      status: this.getEmptyIdTextLabel(),
      status_text: '',
      full_name: '',
      language: this.getEmptyIdTextLabel(),
      job_title: '',
      fax_number: '',
      phone_number: '',
      phone_extension: '',
      email: '',
      RoutingID: '',
    };
  }
}
