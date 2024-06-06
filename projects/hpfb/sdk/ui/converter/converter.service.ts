import { Injectable } from '@angular/core';
import { ICode } from '../data-loader/data';
import { IIdTextLabel } from '../model/entity-base';
import { UtilsService } from '../utils/utils.service';
import { CheckboxOption } from '../model/form-model';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable()
/**
 * form data/output data converter/mapper
 */
export class ConverterService {

  constructor(private _utilsService: UtilsService){}

  convertCodeToIdTextLabel(codeObj: ICode, lang: string): IIdTextLabel {
    if (codeObj === undefined || codeObj === null) {
      return null;
    } else {
      const idTextLabelObj = {} as IIdTextLabel;
      idTextLabelObj.__text = this._utilsService.isFrench(lang) ? codeObj.fr : codeObj.en;
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
      checkboxOption.label = this._utilsService.isFrench(lang) ? codeObj.fr : codeObj.en;
      checkboxOption.checked = false;
      return checkboxOption;
    }
  }

  // find a ICode in a ICodeList and convert it to an IdTextLabel object
  findAndConverCodeToIdTextLabel(codeList: ICode[], controlVal: string, lang: string): IIdTextLabel {
    // filter a CodeList by a form control value
    const codeVal = this._utilsService.findCodeById(codeList, controlVal);
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
        console.error("ConverterService", "findAndConverCodesToIdTextLabels", `couldn't find '${controlVal}' in codeList`);
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

  convertFormDataToOutputModel(
    mapping: DataMapping,
    formRecord: FormGroup,
    output,
    lang: string,
    descriptionTypeList?
  ): void {
    try{
      var splitted = mapping.outputDataName.split('.');

      let val: any;
      let temp_val: any;
      if (mapping.formControlType === FC_TYPE_INPUT) {
        val = formRecord.controls[mapping.formControlName].value;
      } else if (mapping.formControlType === FC_TYPE_ICODE) {
        val = this.convertCodeToIdTextLabel(
          formRecord.controls[mapping.formControlName].value,
          lang
        );
      } else if (mapping.formControlType === FC_TYPE_ID) {
        temp_val = this._utilsService.findCodeById(descriptionTypeList, formRecord.controls[mapping.formControlName].value);
        val = this.convertCodeToIdTextLabel(temp_val, lang);
      }

      // console.log(
      //   'convertFormDataToOutputModel ~ mapping ',
      //   mapping,
      //   '~ formControlValue ',
      //   val,
      //   ' ~ splitted',
      //   splitted.length,
      //   splitted
      // );

      // hard code to handle max of two levels of the data structure. eg lifecycle_record.regulatory_activity_type
      if (splitted.length == 2) {
        output[splitted[0]][splitted[1]] = val;
      } else if (splitted.length == 1) {
        output[splitted[0]] = val;
      }
    } catch (ex) {
      console.log('convertFormDataToOutputModel ~ ', ex.message)
    }
  }

    /*
  set form control's value from data model
  if the form control's value is an object, it will ONLY set the object's id to the form control
  */
  convertOutputModelToFormData(
    mapping: DataMapping,
    formRecord: FormGroup,
    output,
    lang: string
  ): void {

    try{
      //  formRecord.controls['dossierId'].setValue(dataModel.dossier_id);
      var splitted = mapping.outputDataName.split('.');

      // hard code to handle two levels of the data structure. eg lifecycle_record.regulatory_activity_type
      let val: any;
      if (splitted.length == 2) {
        val = output[splitted[0]][splitted[1]];
      } else if (splitted.length == 1) {
        val = output[splitted[0]];
      }

      // console.log(
      //   'convertOutputModelToFormData ~ mapping ',
      //   mapping,
      //   '~ outputValue ',
      //   val
      // );

      if (mapping.outputDataType === OP_TYPE_TEXT) {
        // console.log('1 typeof val ', typeof val);
        formRecord.controls[mapping.formControlName].setValue(val);
      } else if (mapping.outputDataType === OP_TYPE_IDTEXTLABEL) {
        // console.log('2 typeof val ', typeof val);
        // if (this.isIIdTextLabel(val)) {
        //   console.log('2.1 is IIdTextLabel');
        // } else {
        //   console.log('2.1 is NOT IIdTextLabel');
        // }

        // console.log("==>", mapping.formControlName , "  ", val)
        formRecord.controls[mapping.formControlName].setValue(
          (val as IIdTextLabel)._id
        );
      }
    } catch (ex) {
      console.log('convertFormDataToOutputModel ~ ', ex.message)
    }

    // console.log(
    //   'convertFormDataToOutputModel ~ mapping ',
    //   mapping,
    //   '~ formControlValue ',
    //   val,
    //   ' ~ splitted',
    //   splitted.length,
    //   splitted
    // );
  }

}

    // form control types
    export const FC_TYPE_INPUT = '1';
    export const FC_TYPE_ICODE = '2';
    export const FC_TYPE_ID = '3';
  
    // output data types
    export const OP_TYPE_TEXT = '10';
    export const OP_TYPE_IDTEXTLABEL = '20';
  
  
    // a mapping of form control to output data model
  export class DataMapping {
      formControlName: string;
      formControlType: string;
      outputDataName: string;
      outputDataType: string;
    
      constructor(
        formControlName: string,
        formControlType: string,
        outputDataName: string,
        outputDataType: string
      ) {
        this.formControlName = formControlName;
        this.formControlType = formControlType;
        this.outputDataName = outputDataName;
        this.outputDataType = outputDataType;
      }
    }
