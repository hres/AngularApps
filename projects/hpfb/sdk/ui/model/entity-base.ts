// output data model

export interface IText {
  __text: string;
}

export interface IIdText {
  _id: string;
  __text?: string;
}

export interface IIdTextLabel {
  _id: string;
  __text?: string;
  _label_en: string;
  _label_fr: string;
}

export interface INameAddress {
  company_name: string;
  street_address: string;
  city: string;
  country: IIdTextLabel;
  province_lov: IIdTextLabel;  
  province_text: string;
  postal_code: string;
}

// master file Contact
// export interface IContact {
//   given_name: string;
//   surname: string;
//   job_title: string;
//   language_correspondance: IIdTextLabel;
//   phone_num: string;
//   phone_ext: string;
//   fax_num: string;
//   email: string;
// }

// MD CO contact
export interface Contact {
  id:              number;
  contact_id:      string;
  status:          IIdTextLabel;
  status_text:     string;
  full_name:       string;
  language:        IIdTextLabel;
  job_title:       string;
  fax_number:      string;
  phone_number:    string;
  phone_extension: string;
  email:           string;
  RoutingID:       string;
}