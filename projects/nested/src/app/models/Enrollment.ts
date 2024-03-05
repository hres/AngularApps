import { INameAddress, IIdTextLabel } from "@hpfb/sdk/ui";

export interface Enrollment {
  TEST_ENROL: DeviceCompanyEnrol;
}

export interface DeviceCompanyEnrol {
  general_information:    GeneralInformation;
  contacts:               Contacts;
}

export interface GeneralInformation {
  are_licenses_transfered: string;
}

export interface DemoContact {
  id: number;
  status: IIdTextLabel;
  full_name: string;
  job_title: string;
}

export interface Contacts {
  contact: DemoContact[];
}