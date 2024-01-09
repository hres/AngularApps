import { IIdTextLabel } from "@hpfb/sdk/ui";

export interface Enrollment {
    DEVICE_APPLICATION_ENROL: DeviceApplicationEnrol;
}

export interface DeviceApplicationEnrol {
    application_info: ApplicationInfo;
    devices: Devices;
}

export interface ApplicationInfo {
    software_version:         string;
    enrol_version:            string;
    last_saved_date:          string;
    company_id:               string;
    dossier_id:               string;
    mdsap_number:             string;
    mdsap_org:                IIdTextLabel;
    licence_application_type: IIdTextLabel;
    regulatory_activity_lead: IIdTextLabel;
    regulatory_activity_type: IIdTextLabel;
    device_class:             IIdTextLabel;
    is_ivdd:                  string;
    is_home_use:              string;
    is_care_point_use:        string;
    is_emit_radiation:        string;
    has_drug:                 string;
    has_din_npn:              IIdTextLabel;
    din:                      string;
    npn:                      string;
    drug_name:                string;
    active_ingredients:       string;
    manufacturer:             string;
    compliance:               IIdTextLabel;
    other_pharmacopeia:       string;
    provision_mdr_it:         string;
    provision_mdr_sa:         string;
    application_number:       string;
    sap_request_number:       string;
    declaration_conformity :  string;
    has_recombinant:          string;
    is_animal_human_sourced : string;
    biological_materials:     BiologicalMaterials;
    is_listed_idd_table:      string;
}

export interface BiologicalMaterials {
    material : BiologicalMaterial[];
}

export interface BiologicalMaterial {
    material_id:                string;
    material_name:              string;
    device_name:                string;
    origin_country:             IIdTextLabel;
    family_of_species:          IIdTextLabel;
    tissue_substance_type:      IIdTextLabel;
    tissue_type_other_details:  IIdTextLabel;
    derivative:                 IIdTextLabel;
    derivative_other_details:   string;
}

export interface Devices {
    device: Device[];
}

export interface Device {
    device_name: '',
    device_Authorized: '',
    licence_number: '',
    device_application_submitted: '',
    device_application_number: '',
    device_explain: ''
}