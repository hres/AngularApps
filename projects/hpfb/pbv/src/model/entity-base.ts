import { IIdTextLabel } from "@hpfb/sdk/ui";

export interface INameAddress {
    street_address: string;
    city: string;
    province_lov: IIdTextLabel;
    province_text: string;
    country: IIdTextLabel;
    postal_code: string;
  }
  
  export interface IContact {
    given_name: string;
    initials: string;
    surname: string;
    job_title: string;
    language_correspondance: IIdTextLabel;
    phone_num: string;
    phone_ext: string;
    fax_num: string;
    email: string;
  }