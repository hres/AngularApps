import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ConverterService, ICode, UtilsService, ValidationService } from '@hpfb/sdk/ui';
import { SpecyAndSubType } from '../../models/ProductInformation';


@Injectable()
export class SpeciesSubtypesDetailsService {

  constructor(private _utilsService: UtilsService, private _converterService: ConverterService) {}

  /**
   * Gets the reactive forms Model for contact details
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
     specySubTypeModel.subtype = formRecord.controls['fullName'].value;
  }

  public mapDataModelToFormModel(specySubTypeModel: SpecyAndSubType, formRecord: FormGroup) {
       formRecord.controls['fullName'].setValue(specySubTypeModel.specy);


  }

}
