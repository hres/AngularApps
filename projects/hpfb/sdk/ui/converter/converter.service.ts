import { Injectable } from '@angular/core';
import { ICode } from '../data-loader/data';
import { IIdTextLabel } from '../model/entity-base';
import { UtilsService } from '../utils/utils.service';
import { CheckboxOption } from '../model/form-model';
import { LoggerService } from '../logger/logger.service';
import { FormArray } from '@angular/forms';

@Injectable()
/**
 * form data/output data converter/mapper
 */
export class ConverterService {

  constructor(private _utilService: UtilsService, private _loggerService: LoggerService){}

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

  // find a ICode in a ICodeList and convert it to an IdTextLabel object
  findAndConverCodeToIdTextLabel(codeList: ICode[], controlVal: string, lang: string): IIdTextLabel {
    // filter a CodeList by a form control value
    const codeVal = this._utilService.findCodeById(codeList, controlVal);
    // if found, convert the Code value to an IIdTextLabel object and return it, otherwise return null
    return codeVal? this.convertCodeToIdTextLabel(codeVal, lang) : null;
  }

  // loop through the controlVals and find it's each and every value in a ICodeList and convert it to an IdTextLabel object 
  // return an IdTextLabel[]
  findAndConverCodesToIdTextLabels(codeList: ICode[], controlVals: string[], lang: string): IIdTextLabel[] {
    let idTextLabels: IIdTextLabel[] = [];
    for (const controlVal of controlVals) {
      const temp = this.findAndConverCodeToIdTextLabel(codeList, controlVal, lang);
      if (temp) {
        idTextLabels.push(temp);
      } else {
        this._loggerService.error("ConverterService", "findAndConverCodesToIdTextLabels", `couldn't find '${controlVal}' in codeList`);
        return null;
      }
    } 
    return idTextLabels;
  }

  // takes an array of codes and iterates through it, 
  // for each codes, finds the index of the corresponding option in optionList,
  // it the option is found, sets the values of the corresponding checkbox in checkboxFormArray to true
  checkCheckboxes(loadedCodes: string[], optionList: CheckboxOption[], checkboxFormArray: FormArray) : void {
    loadedCodes.forEach(id => {
      const index = optionList.findIndex(option => option.value === id);
      if (index !== -1) {
        checkboxFormArray.controls[index].setValue(true);
      }
    });
  }

  getCheckedCheckboxValues(optionList: CheckboxOption[], checkboxFormArray: FormArray) : string[]{
    return optionList
      .filter((item, idx) => checkboxFormArray.controls.some((control, controlIdx) => idx === controlIdx && control.value))
      .map(item => item.value);
  }

}
