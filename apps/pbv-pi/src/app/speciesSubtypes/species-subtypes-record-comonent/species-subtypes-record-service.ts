import {inject, Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ICode } from '@hpfb/sdk/ui';
import { TranslateService } from '@ngx-translate/core';
import { SpeciesSubtypesDetailsService } from '../species-subtypes-detail-component/species-subtypes-detail-service';
import { SpecyAndSubType } from '../../models/ProductInformation';

@Injectable()
export class SpeciesSubtypesRecordService {

  _translateService = inject(TranslateService);

  constructor(private _detailsService: SpeciesSubtypesDetailsService) {
  }

  public getReactiveModel(fb: FormBuilder): FormGroup {
    if (!fb) {
      return null;
    }
    return fb.group({
        id: -1,
        seqNumber: -1,  // for UI display purpose only
        detailsDirty: [false, Validators.required],
        isNew: true,
        expandFlag: false,
        speciesSubtypeDetail: this._detailsService.getReactiveModel(fb)
      }
    );
  }

  public mapFormModelToDataModel(formRecord: FormGroup, specyRecordModel: SpecyAndSubType, lang: string, languageList: ICode[]) {
    specyRecordModel.id = formRecord.controls['id'].value;
    this._detailsService.mapFormModelToDataModel((<FormGroup>formRecord.controls['speciesSubtypeDetail']), specyRecordModel, lang, languageList);

  }


  public mapDataModelFormModel(contactRecordModel: SpecyAndSubType, formRecord: FormGroup) {
    formRecord.controls['id'].setValue(Number(contactRecordModel.id));
    formRecord.controls['isNew'].setValue(false);
    this._detailsService.mapDataModelToFormModel(contactRecordModel, <FormGroup>formRecord.controls['speciesSubtypeDetail']);
  }

   public  getHeading(index : number): string {
      return this._translateService.instant('heading.product.specy', { seqnumber: index + 1})
   }

}
