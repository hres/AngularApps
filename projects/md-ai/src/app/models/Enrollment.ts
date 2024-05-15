import { IIdTextLabel } from "@hpfb/sdk/ui";

export interface Enrollment {
    DEVICE_APPLICATION_INFO: DeviceApplicationEnrol;
}

export interface DeviceApplicationEnrol {
    software_version:               string;
    form_language:                  string;
    check_sum?:                     string;
    application_info:               ApplicationInfo;
    devices:                        Devices;
    material_info:                      BiologicalMaterialData;
}

export interface ApplicationInfo {
    last_saved_date:                string;
    company_id:                     string;
    dossier_id:                     string;
    mdsap_number:                   string;
    mdsap_org:                      IIdTextLabel;
    licence_application_type:       IIdTextLabel;
    regulatory_activity_type:       IIdTextLabel;
    regulatory_activity_lead:       IIdTextLabel;
    device_class:                   IIdTextLabel;
    is_ivdd:                        string;
    is_home_use:                    string;
    is_care_point_use:              string;
    is_emit_radiation:              string;
    has_drug:                       string;
    has_din_npn:                    IIdTextLabel;
    din:                            string;
    npn:                            string;
    drug_name:                      string;
    active_ingredients:             string;
    manufacturer:                   string;
    compliance:                     Compliances;
    other_pharmacopeia:             string;
    provision_mdr_it:               string;
    provision_mdr_sa:               string;
    application_number:             string;
    sap_request_number:             string;
    interim_order_authorization:    string;
    authorization_id:               string;
    declaration_conformity :        string;
    priority_review:                    string;
    is_diagnosis_treatment_serious:     DiagnosisReasons;
}

export interface Compliances {
    compliance : IIdTextLabel[];
}

export interface DiagnosisReasons {
    diagnosis_reason : IIdTextLabel[];
}

export interface BiologicalMaterialData {
    has_recombinant:                string;
    is_animal_human_sourced :       string;
    is_listed_idd_table:            string;
    biological_materials: BiologicalMaterials;
}

export interface BiologicalMaterials {
    material : BiologicalMaterial[];
}

export interface BiologicalMaterial {
    material_id:                number;
    material_name:              string;
    device_name:                string;
    origin_country:             IIdTextLabel;
    family_of_species:          IIdTextLabel;
    tissue_substance_type:      IIdTextLabel;
    tissue_type_other_details:  string;
    derivative:                 IIdTextLabel;
    derivative_other_details:   string;
}

export interface Devices {
    device: Device[];
}

export interface Device {
    device_id:                             number;
    device_name:                    string;
    device_authorized:              string;
    licence_number:                 string;
    device_application_submitted:   string;
    device_application_number:      string;
    device_explain:                 string;
}