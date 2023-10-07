import { Injectable } from '@angular/core';
import { ICode } from '../data-loader/data';
import { IIdTextLabel } from '../model/entity-base';
import { UtilsService } from '../utils/utils.service';
import { CheckboxOption } from '../model/form-model';


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

  convertCodeToCheckboxOption(codeObj: ICode, lang: string): CheckboxOption {
    if (codeObj === undefined || codeObj === null) {
      return null;
    } else {
      const checkboxOption = {} as CheckboxOption;
      checkboxOption.value = codeObj.id;
      checkboxOption.label = this._utilService.isFrench(lang) ? codeObj.fr : codeObj.en;
      checkboxOption.checked = false;
      return checkboxOption;
    }
  }

  findAndConverCodeToIdTextLabel(codeList: ICode[], controlVal: string, lang: string): IIdTextLabel {
    // filter a CodeList by a form control value
    const codeVal = this._utilService.findCodeById(codeList, controlVal);
    // if found, convert the Code value to an IIdTextLabel object and return it, otherwise return null
    return codeVal? this.convertCodeToIdTextLabel(codeVal, lang) : null;
  }


}
