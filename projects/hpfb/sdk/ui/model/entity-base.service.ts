import { Injectable } from '@angular/core';
import { Contact, IIdText, IIdTextLabel, ILabel, INameAddress } from './entity-base';

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

  getEmptyLabel(): ILabel {
    return {
      _label_en: '',
      _label_fr: '',
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
      full_name: '',
      language_correspondence: this.getEmptyIdTextLabel(),
      job_title: '',
      fax_num: '',
      phone_num: '',
      phone_ext: '',
      email: '',
      // routingID: '',
    };
  }
}
