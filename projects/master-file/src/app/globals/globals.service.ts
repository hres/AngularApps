import { Injectable, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { Ectd, IIdTextLabel } from '../models/transaction';
import { ICode, ICodeDefinition, IParentChildren } from '../shared/data';

@Injectable()
export class GlobalsService {
  public static errorSummClassName: string = 'ErrorSummaryComponent';
  public static errorSummleastOneRcd: string = 'leastOneRecordError';
  public static CANADA: string = 'CA';
  public static USA: string = 'US';
  public static DATA_PATH: string = './assets/data/';
  public static ENGLISH: string = 'en';
  public static FRENCH: string = 'fr';
  public static YES: string = 'yes';
  public static NO: string = 'no';
  public static YESNOList = [GlobalsService.YES, GlobalsService.NO];
  // public static NEW: string = 'NEW';
  // public static AMEND: string = 'AMEND';
  public static FINAL: string = 'FINAL';

  // public static STYLESHEETS_1_0_PREFIX = ''; 
  // public static STYLESHEETS_1_0_PREFIX  = 'https://raw.githubusercontent.com/HealthCanada/HPFB/master/Medical-Device-REP/v_1_0/Style-Sheets/';

  public static MASTER_FILE_OUTPUT_PREFIX = 'mf';

  // form control types
  public static FC_TYPE_INPUT = '1';
  public static FC_TYPE_ICODE = '2';
  public static FC_TYPE_ID = '3';
  // output data types
  public static OP_TYPE_TEXT = '10';
  public static OP_TYPE_IDTEXTLABEL = '20';

  constructor() {}

  static isFrench(lang: string): boolean {
    return lang === GlobalsService.FRENCH;
  }

  /**
   * Gets an yesno array
   *
   */
  static getYesNoList() {
    return [GlobalsService.YES, GlobalsService.NO];
  }

  static convertFormDataToOutputModel(
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
      if (mapping.formControlType === GlobalsService.FC_TYPE_INPUT) {
        val = formRecord.controls[mapping.formControlName].value;
      } else if (mapping.formControlType === GlobalsService.FC_TYPE_ICODE) {
        val = this.convertCodeToIdTextLabel(
          formRecord.controls[mapping.formControlName].value,
          lang
        );
      } else if (mapping.formControlType === GlobalsService.FC_TYPE_ID) {
        temp_val = this.findCodeById(descriptionTypeList, formRecord.controls[mapping.formControlName].value);
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

   /**
   * find a code by its id in a code array
   * @param codeArray 
   * @param id 
   * @returns either a code or undefined
   */
  static findCodeById(codeArray: ICodeDefinition[], id: string): ICode | undefined {
    return this.isEmpty(id)? undefined : codeArray.find(obj => obj.id === id);
  }

  static isEmpty(value: any): boolean {
    return value === null || value === undefined || value === "";
  }


  /*
  set form control's value from data model
  if the form control's value is an object, it will ONLY set the object's id to the form control
  */
  static convertOutputModelToFormData(
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

      if (mapping.outputDataType === GlobalsService.OP_TYPE_TEXT) {
        // console.log('1 typeof val ', typeof val);
        formRecord.controls[mapping.formControlName].setValue(val);
      } else if (mapping.outputDataType === GlobalsService.OP_TYPE_IDTEXTLABEL) {
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

  private static isIIdTextLabel(obj: any): obj is IIdTextLabel {
    console.log(
      'GlobalsService ~ isIIdTextLabel ~ isIIdTextLabel',
      (<IIdTextLabel>obj)._id !== undefined
    );
    return (<IIdTextLabel>obj)._id !== undefined;
  }

  public static convertCodeToIdTextLabel(
    codeObj: ICode,
    lang: string
  ): IIdTextLabel {
    if (codeObj === undefined || codeObj === null) {
      return null;
    } else {
      const idTextLabelObj = {} as IIdTextLabel;
      idTextLabelObj.__text = this.isFrench(lang) ? codeObj.fr : codeObj.en;
      idTextLabelObj._id = codeObj.id;
      idTextLabelObj._label_en = codeObj.en;
      idTextLabelObj._label_fr = codeObj.fr;
      return idTextLabelObj;
    }
  }
    /***
   * Converts the list iteems of id, label_en, and label_Fr
   * @param rawList
   * @param lang
   * @private
   */
  // private static _convertListText(rawList, lang) {
  //   const result = [];
  //   if (lang === GlobalsService.FRENCH) {
  //     rawList.forEach(item => {
  //       item.text = item.fr;
  //       result.push(item);
  //       //  console.log(item);
  //     });
  //   } else {
  //     rawList.forEach(item => {
  //       item.text = item.en;
  //       // console.log("adding country"+item.text);
  //       result.push(item);
  //       // console.log(item);
  //     });
  //   }
  //   return result;
  // }

  // private static _convertDate(value) {

  //   if (!value) {return ''; }
  //   const date = new Date(value);
  //   const m_names = ['Jan', 'Feb', 'Mar',
  //     'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  //     'Oct', 'Nov', 'Dec'];
  //   const result = m_names[date.getUTCMonth()] + '. ' + date.getUTCDate() + ', ' + date.getFullYear();
  //   return result;
  // }

  // when formControl's value is an object, mapDataModelToFormModel method will set the object id to the formControl first
  // then we use the object id to filter the object list, once found, the object will be set to the formControl
  public static updateControlValue(controlName: string, control: FormControl<any>, ob$: Observable<ICode[]>) {
    let _objId = control.value;
    let _selectedOption: ICodeDefinition[] | ICode[];
    // console.log('updateControlValue ~ controlName is ', controlName, ' filter for id ', _objId );

    ob$.pipe(
        map((item) => {
          // console.log('item=>', item);
          return item.filter((x) => x.id === _objId);
        })
      ).subscribe((response) => {
        // console.log('response=>', response);
        _selectedOption = response;
      });
    // console.log('updateControlValue ~ _selectedOption ', _selectedOption[0]);
    // update the value of the formControl
    control.setValue(_selectedOption[0]);
  }

  /*
  check if the component is first time loaded
  Object.values to retrieve all changes as an array
  Array.some to check whether any of the changes has isFirstChange set
  Beware: If no @Input is set at all, isFirstChange will be false because Array.some stops at the first true value.
  */
  public static isFirstChange(changes: SimpleChanges): boolean{
   return Object.values(changes).some(c => c.isFirstChange());
  }

  // filter an IParentChildren array by parentId and return its children
  public static filterParentChildrenArray(arr: IParentChildren[], pId: string) : ICodeDefinition[]{
    const filteredArray = arr.filter(
      (x) => x.parentId === pId
    );
    //    console.log(
    //      'filterParentChildrenArray ~ filteredArray',
    //      filteredArray
    // );

    return filteredArray[0]['children'];
  }  

  // return a concatated string, delimited by a space
  public static concat(...param: string[]): string{
    // console.log(param.join(' ')) // [1,2]
    return param.join(' ');
  }

  // reset form control's value
  public static resetControlValue(...controls: AbstractControl<any, any>[]): void{
    controls.forEach(c=> {
      c.setValue(null);
      c.markAsUntouched();
    })
  }
  
  // reset form control's value
  public static getCodeDefinitionByLang(codeDefinition: ICodeDefinition, lang:string): string{
    if (codeDefinition) {
      if (this.isFrench(lang)) {
        return codeDefinition.defFr;
      } else {
        return codeDefinition.defEn;
      }
    } else {
      return null;
    }
  }  


  // Function to find a match by id and return the appropriate definition based on lang
  public static getCodeDefinitionByIdByLang(id: string, list: ICodeDefinition[], lang: string): string {
    // Find the ICodeDefinition object with the matching id
    const codeDefinition = list.find(item => item.id === id);

    // If no match is found, return undefined
    if (!codeDefinition) {
      return null;
    }

    return this.getCodeDefinitionByLang(codeDefinition, lang);
  }

  // return true if the value is in the array of valid values
  public static toBoolean = (value: string | number | boolean): boolean => 
  [true, 'true', 'True', 'TRUE', '1', 1].includes(value);

  public static findDataMappingByFormControlName(dataMappings : DataMapping[], formControlName : string): DataMapping{
    const filtered = dataMappings.filter(item => item.formControlName === formControlName);
    return filtered == null ? null : filtered[0];
  }

  public static extractArraySubkeys<T>(dictionary: { [key: string]: { [subkey: string]: T } }): any[] {
    const arraySubkeys: any[] = [];
  
    for (const key in dictionary) {
      const subkeys = dictionary[key];
      for (const subkey in subkeys) {
        if (Array.isArray(subkeys[subkey])) {
          arraySubkeys.push(subkeys[subkey]);
        }
      }
    }
  
    return arraySubkeys;
  }
  

  public static flattenArrays<T>(arrays: T[]): T[] {
    return [].concat(...arrays);
  }
  
  public static getControlName (control: AbstractControl) {
    var controlName = null;
    var parent = control["_parent"];

    // only such parent, which is FormGroup, has a dictionary 
    // with control-names as a key and a form-control as a value
    if (parent instanceof FormGroup)
    {
        // now we will iterate those keys (i.e. names of controls)
        Object.keys(parent.controls).forEach((name) =>
        {
            // and compare the passed control and 
            // a child control of a parent - with provided name (we iterate them all)
            if (control === parent.controls[name])
            {
                // both are same: control passed to Validator
                //  and this child - are the same references
                controlName = name;
            }
        });
    }
    // we either found a name or simply return null
    return controlName;
  }

  public static displayFormControlInfo(control: AbstractControl) {
    if (control) {
      console.log('Form Control Name:', this.getControlName(control));
      console.log('\tCurrent Value:', control.value);
      console.log('\tValid:', control.valid);
      console.log('\tInvalid:', control.invalid);
      console.log('\tDirty:', control.dirty);
      console.log('\tTouched:', control.touched);
      console.log('\tErrors:', control.errors);
      // ... other properties you might want to log
    }
  }

  public static checkInputValidity(event: any, control: AbstractControl, errorMsgKey: string): void {
    if (event.target.validity.badInput) {
      if (errorMsgKey=='invalidDate') {
        control.setErrors({ 'error.msg.invalidDate': true });
      }
      // ...
    } else {
      // clear up previous errors
      control.setErrors(null);
       // Recalculates the value and validation status of the control, eg trigger "Validators.required" validation
      control.updateValueAndValidity();
    }
    // GlobalsService.displayFormControlInfo(control);
  }  

}

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

