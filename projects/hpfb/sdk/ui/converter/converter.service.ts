import { Injectable } from '@angular/core';
import { ICode } from '../data-loader/data';
import { IIdTextLabel } from '../model/entity-base';
import { UtilsService } from '../utils/utils.service';

@Injectable()
/**
 * form data/output data converter/mapper
 */
export class ConverterService {

  constructor(private _utilService: UtilsService){}

  convertCodeToIdTextLabel(codeObj: ICode, lang: string): IIdTextLabel {
    if (codeObj === undefined || codeObj === null) {
      return null;
    } else {
      const idTextLabelObj = {} as IIdTextLabel;
      idTextLabelObj.__text = this._utilService.isFrench(lang) ? codeObj.fr : codeObj.en;
      idTextLabelObj._id = codeObj.id;
      idTextLabelObj._label_en = codeObj.en;
      idTextLabelObj._label_fr = codeObj.fr;
      return idTextLabelObj;
    }
  }

}
