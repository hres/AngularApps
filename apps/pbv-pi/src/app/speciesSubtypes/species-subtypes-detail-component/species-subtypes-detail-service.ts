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
        specy: [null, Validators.required],
        subtype: [null, Validators.required],
        isUsedForTreatmentOfFoodProducingAnimals: [null, Validators.required],
        days: [null],
        hours:[null]
    });
  }

   public mapFormModelToDataModel(formRecord: FormGroup, specySubTypeModel: SpecyAndSubType, lang: string, languageList: ICode[]) {
     specySubTypeModel.subtype = formRecord.controls['subtype'].value;
     specySubTypeModel.specy = formRecord.controls['specy'].value;
     specySubTypeModel.isUsedForTreatmentOfFoodProducingAnimals = formRecord.controls['isUsedForTreatmentOfFoodProducingAnimals'].value;
     specySubTypeModel.withdrawal_time.days = formRecord.controls['days'].value;
     specySubTypeModel.withdrawal_time.hours = formRecord.controls['hours'].value;
  }

  public mapDataModelToFormModel(specySubTypeModel: SpecyAndSubType, formRecord: FormGroup) {
       formRecord.controls['subtype'].setValue(specySubTypeModel.subtype);
       formRecord.controls['specy'].setValue(specySubTypeModel.specy);
       formRecord.controls['isUsedForTreatmentOfFoodProducingAnimals'].setValue(specySubTypeModel.isUsedForTreatmentOfFoodProducingAnimals);
       formRecord.controls['days'].setValue(specySubTypeModel.withdrawal_time.days);
       formRecord.controls['hours'].setValue(specySubTypeModel.withdrawal_time.hours);

  }

}
