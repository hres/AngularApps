import { Injectable } from "@angular/core";
import { IContact, INameAddress } from "./entity-base";



@Injectable()
export class EntityBaseService {

public getEmptyAddressDetailsModel() : INameAddress{

    return (
      {
	      street_address: '',
	      city: '',
	      country: undefined,
	      province_lov: undefined,
	      province_text: '',
	      postal_code: ''
      }
    );
  }

  public getEmptyContactModel() : IContact{

    return (
      {
        given_name: '',
        initials:'',
        surname: '',
        language_correspondance: undefined,
        job_title: '',
        phone_num: '',
        phone_ext: '',
        fax_num: '',
        email: ''
      }
    );
  }
}