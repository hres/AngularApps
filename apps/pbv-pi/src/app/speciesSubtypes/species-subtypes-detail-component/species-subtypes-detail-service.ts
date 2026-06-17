import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ConverterService, ICode, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { SpecyAndSubType } from '../../models/ProductInformation';


@Injectable()
export class SpeciesSubtypesDetailsService {

  constructor(private _utilsService: UtilsService, private _converterService: ConverterService) {}

  /**
   * Gets the reactive forms Model for speccy and subtype  details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }

    return fb.group({
        species: [null, Validators.required],
        subtype: [null, Validators.required],
        isUsedForTreatmentOfFoodProducingAnimals: [null, Validators.required],
        days: [null],
        hours:[null],
              // UI ONLY (DO NOT MAP TO XML)
        speciesDisplay: [''],
    });
  }

  public mapFormModelToDataModel(formRecord: FormGroup, specySubTypeModel: SpecyAndSubType, lang: string, species: ICode[], subtypes:ICode[]) {
    specySubTypeModel.subtype =  this._converterService.findAndConverCodeToIdTextLabel(subtypes, formRecord.controls['subtype'].value, lang);
    specySubTypeModel.species = this._converterService.findAndConverCodeToIdTextLabel(species, formRecord.controls['species'].value, lang);
    specySubTypeModel.isUsedForTreatmentOfFoodProducingAnimals = formRecord.controls['isUsedForTreatmentOfFoodProducingAnimals'].value;
    specySubTypeModel.withdrawal_time.days = formRecord.controls['days'].value;
    specySubTypeModel.withdrawal_time.hours = formRecord.controls['hours'].value;
 }

 public mapDataModelToFormModel(specySubTypeModel: SpecyAndSubType, formRecord: FormGroup, lang: string, species: ICode[], subtypes:ICode[] ) {

      if(specySubTypeModel.subtype){
      formRecord.controls['subtype'].setValue( this._utilsService.getIdFromIdTextLabel(specySubTypeModel.subtype));
      }else{
       formRecord.controls['subtype'].setValue(null);
      }
      if(specySubTypeModel.species){
      formRecord.controls['species'].setValue( this._utilsService.getIdFromIdTextLabel(specySubTypeModel.species));
      }
      formRecord.controls['isUsedForTreatmentOfFoodProducingAnimals'].setValue(specySubTypeModel.isUsedForTreatmentOfFoodProducingAnimals);
      formRecord.controls['days'].setValue(specySubTypeModel.withdrawal_time.days);
      formRecord.controls['hours'].setValue(specySubTypeModel.withdrawal_time.hours);
 }

}
