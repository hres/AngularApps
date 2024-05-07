import { Injectable, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConverterService, UtilsService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';

@Injectable()
export class MaterialService {
  
  materialInfoErrors = signal([]); // Material Component -> Form Base
  materialListErrors = signal([]); 

  constructor(private _utilsService : UtilsService,
              private _converterService : ConverterService,
              private _globalService : GlobalService) {
  }

  public setListErrors(errorList) {
    this.materialListErrors.update(error => errorList);
  }

  public getListErrors() {
    return this.materialListErrors();
  }

  public setInfoErrors(errorList) {
    this.materialInfoErrors.update(error => errorList);
  }

  public getInfoErrors() {
    return this.materialInfoErrors();
  }

  public createMaterialInfoFormGroup(fb: FormBuilder) : FormGroup | null {
    if (!fb) {
      return null;
    }
    return fb.group({
      hasRecombinant: [null, Validators.required],
      isAnimalHumanSourced : [null, Validators.required],
      isListedIddTable: [null, Validators.required]
    })
  }

  public createMaterialFormGroup(fb: FormBuilder) : FormGroup | null {
    if (!fb) {
      return null;
    }

    return fb.group({
      id: -1,
      isNew: true,
      expandFlag: true,
      lastSavedState: null, // store the last saved state of the contactInfo for reverting function
      materialInfo: fb.group({
        materialName: ['', Validators.required],
        deviceName: ['', Validators.required],
        originCountry: [null, []],
        specFamily: [null, Validators.required],
        tissueType: [null, []],
        tissueTypeOtherDetails: ['', []],
        derivative: [null, []],
        derivativeOtherDetails: ['', []],
      }, { updateOn: 'blur' }
      )
    });
  }

  public mapMaterialInfoModelToOutput(formRecord: any, materialInfoModel) {
    materialInfoModel.has_recombinant = formRecord.hasRecombinant;
    materialInfoModel.is_animal_human_sourced = formRecord.isAnimalHumanSourced;
    materialInfoModel.is_listed_idd_table = formRecord.isListedIddTable;
  }

  public mapOutputToMaterialInfo(materialInfoModel, formRecord: FormGroup) {
    formRecord.controls['hasRecombinant'].setValue(materialInfoModel.has_recombinant);
    formRecord.controls['isAnimalHumanSourced'].setValue(materialInfoModel.is_animal_human_sourced);
    formRecord.controls['isListedIddTable'].setValue(materialInfoModel.is_listed_idd_table);
  }

  public mapMaterialModelToOutputModel(formRecord: any, materialModel) {
    const countryList = this._globalService.$countryList;
    const speciesList = this._globalService.$deviceSpeciesList;
    const tissueList = this._globalService.$deviceTissueList;
    const derivativeList = this._globalService.$derivateList;

    materialModel.material_name = formRecord.materialName;
    materialModel.device_name = formRecord.deviceName;

    const countryCodeValue = this._utilsService.findCodeById(countryList, formRecord.originCountry);
    materialModel.origin_country = countryCodeValue? this._converterService.convertCodeToIdTextLabel(countryCodeValue, this._globalService.lang()) : null;

    const specFamilyCodeValue = this._utilsService.findCodeById(speciesList, formRecord.specFamily);
    materialModel.family_of_species = specFamilyCodeValue? this._converterService.convertCodeToIdTextLabel(specFamilyCodeValue, this._globalService.lang()) : null;

    const tissueTypeCodeValue = this._utilsService.findCodeById(tissueList, formRecord.tissueType);
    materialModel.tissue_substance_type = tissueTypeCodeValue? this._converterService.convertCodeToIdTextLabel(tissueTypeCodeValue, this._globalService.lang()) : null;
    materialModel.tissue_type_other_details = formRecord.tissueTypeOtherDetails;

    const derivativeCodeValue = this._utilsService.findCodeById(derivativeList, formRecord.derivative);
    materialModel.derivative = derivativeCodeValue? this._converterService.convertCodeToIdTextLabel(derivativeCodeValue, this._globalService.lang()) : null;
    materialModel.derivative_other_details = formRecord.derivativeOtherDetails;
  }

  /**
   * TODO - Change to patch value
   * @param materialModel
   * @param formRecord 
   */
  public mapOutputModelToMaterialModel(materialModel, formRecord: FormGroup) {
    formRecord.controls['materialName'].setValue(materialModel.material_name);
    formRecord.controls['deviceName'].setValue(materialModel.device_name);

    const countryId: string | undefined = this._utilsService.getIdFromIdTextLabel(materialModel.origin_country);
    formRecord.controls['country'].setValue(countryId? countryId : null);

    formRecord.controls['specFamily'].setValue(materialModel.family_of_species);
    formRecord.controls['tissueType'].setValue(materialModel.tissue_substance_type);
    formRecord.controls['tissueTypeOtherDetails'].setValue(materialModel.tissue_type_other_details);
    formRecord.controls['derivative'].setValue(materialModel.derivative);
    formRecord.controls['derivativeOtherDetails'].setValue(materialModel.derivative_other_details);
  }

}