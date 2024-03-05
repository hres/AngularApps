import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Enrollment, DeviceCompanyEnrol, GeneralInformation, Contacts, DemoContact } from '../models/Enrollment';

@Injectable()
export class FormBaseService {

  public createMyFormGroup(fb: FormBuilder) : FormGroup | null {
    if (!fb) {
      return null;
    }

    return fb.group({
      //...
    });
  }

  public getEmptyEnrol(): Enrollment {
    const enrollment: Enrollment = {
      TEST_ENROL: {
        general_information: {
          are_licenses_transfered: ''
        },
        contacts: {contact: []},
      }
    }  
    return enrollment;
  }

  getMockData(): Enrollment{
    return {
      TEST_ENROL: {
        general_information: {
          are_licenses_transfered: 'yes'
        },
        contacts: {
          contact: [
          {
            id: 2,
            status: {
              _id: "NEW",
              _label_en: "New",
              _label_fr: "Nouveau",
              __text: "New"
            },
            full_name: "John",
            job_title: "tester",
          },
          {
            id: 3,
            status: {
              _id: "ACTIVE",
              _label_en: "Active",
              _label_fr: "Actif",
              __text: "Active"
            },        
            full_name: "Mary",
            job_title: "engineer",
          },
          {
            id: 4,
            status: {
              _id: "REMOVE",
              _label_en: "Remove",
              _label_fr: "Remove",
              __text: "Remove"
            },        
            full_name: "Jack",
            job_title: "sales",
          },      
          {
            id: 5,
            status: {
              _id: "REVISE",
              _label_en: "Revise",
              _label_fr: "Revise",
              __text: "Revise"
            },        
            full_name: "Emma",
            job_title: "ceo",
          }
        ]
      }
      }
    }
  }

  map1(generalInfoFormValue) : GeneralInformation {
    let generalInformation: GeneralInformation = {
      are_licenses_transfered: generalInfoFormValue.areLicensesTransfered
    }
    return generalInformation;
  }

  map2(formValues) : DemoContact[] {
    let contacts: DemoContact[] = [];

    formValues.map((contact: any) => {
      // console.log(contact);
      contacts.push(this.xToY(contact))
    })

    return contacts;
  }

  xToY(x): DemoContact{
    let y: DemoContact = {
      id: x.id,
      status: x.contactInfo.status,
      full_name: x.contactInfo.fullName,
      job_title: x.contactInfo.jobTitle
    }
    return y;
  }

  mapContactsFormArrayValuesToOutputData(formValues: any) {
    // Map form control names to desired field names
    const fieldMap = {
      fullName: 'full_name',
      // Add other mappings as needed
    };

    // Transform the form values
    const transformedData = formValues.map((contact: any) => {
      const transformedContact: any = {};
      for (const key in contact) {
        if (fieldMap[key]) {
          transformedContact[fieldMap[key]] = contact[key];
        } else {
          transformedContact[key] = contact[key];
        }
      }
      return transformedContact;
    });

    // Convert the transformed data to JSON
    const jsonData = JSON.stringify(transformedData, null, 2);

    // // Write the JSON data to a file
    // this.writeFileToServer(jsonData, fileName);
  }
}
