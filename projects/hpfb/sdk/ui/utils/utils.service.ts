import { Injectable, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { CANADA, USA, FRENCH } from '../common.constants';
import { DatePipe } from '@angular/common';
import { ICode, ICodeDefinition, IParentChildren, SortOn } from '../data-loader/data';
import { IIdTextLabel } from '../model/entity-base';

@Injectable()
export class UtilsService {

  isCanadaOrUSA(countryValue): boolean {
    return this.isCanada(countryValue) || this.isUsa(countryValue);
  }

  /**
   * Checks of the value is canada or not. Checks for Json object vs single value
   * @param value the value to check can be the json object with an id index.
   * @returns {boolean}
   */
  isCanada(countryValue): boolean {
    return countryValue === CANADA;
  }

  /**
   * Checks if the value usa or not. Checks for Json object vs single value
   * @param value - the value to check can be the json object with an id index.
   * @returns {boolean}
   */
  isUsa(countryValue): boolean {
    return countryValue === USA;
  }

  static isFrench(lang: string): boolean {
    return lang === FRENCH;
  }

  isFrench(lang: string): boolean {
    return lang === FRENCH;
  }

  getFormattedDate(format: string): string {
    const today = new Date();
    const pipe = new DatePipe('en-US');
    return pipe.transform(today, format);
  }

  /*
  check if the component is first time loaded
  Object.values to retrieve all changes as an array
  Array.some to check whether any of the changes has isFirstChange set
  Beware: If no @Input is set at all, isFirstChange will be false because Array.some stops at the first true value.
  */
  isFirstChange(changes: SimpleChanges): boolean{
    return Object.values(changes).some(c => c.isFirstChange());
  }

  /**
   * find a code by its id in a code array
   * @param codeArray 
   * @param id 
   * @returns either a code or undefined
   */
  findCodeById(codeArray: ICode[], id: string): ICode | undefined {
    return this.isEmpty(id)? undefined : codeArray.find(obj => obj.id === id);
  }

  /*
  * takes an array of ids, 
  * uses the filter method to iterate through the codeArray and includes only those objects whose id is present in the idsToFilter array
  * the filtered array is then returned
  */
  filterCodesByIds(codeArray: ICode[], idsToFilter: string[]): ICode[] {
    return codeArray.filter((code) => idsToFilter.includes(code.id));
  }

  /**
   * find a codeDefinition by its id in a codeDefinition array
   * @param codeDefinitionArray 
   * @param id 
   * @returns either a code or undefined
   */
    findCodeDefinitionById(codeDefinitionArray: ICodeDefinition[], id: string): ICodeDefinition | undefined {
      return this.isEmpty(id)? undefined : codeDefinitionArray.find(obj => obj.id === id);
    }

  /**
   * get the id value from an IdTextLabel object
   * @param idTextLabelObj 
   * @returns either id or undefined
   */
  getIdFromIdTextLabel(idTextLabelObj: IIdTextLabel): string {
    return !this.isEmpty(idTextLabelObj) ? idTextLabelObj._id : undefined; 
  }

  getIdsFromIdTextLabels(idTextLabelObjs: any): string[] {
    let ids: string[] = [];

    if ( !this.isEmpty(idTextLabelObjs) ) {
      if (Array.isArray(idTextLabelObjs) && this.isArrayOfIIdTextLabel(idTextLabelObjs)) {
        for (const temp of idTextLabelObjs) {
          ids.push(this.getIdFromIdTextLabel(temp));
        }
      } else if (!Array.isArray(idTextLabelObjs) && this.isIIdTextLabel(idTextLabelObjs)){
        ids.push(this.getIdFromIdTextLabel(idTextLabelObjs));
      }
    }

    return ids;
  }

  getLabelFromIdTextLabelByLang(idTextLabelObj: IIdTextLabel, lang: string): string {
    return !this.isEmpty(idTextLabelObj) ? (this.isFrench(lang) ? idTextLabelObj._label_fr : idTextLabelObj._label_en) : undefined; 
  }

  isArrayOfIIdTextLabel(arr: any[]): arr is IIdTextLabel[] {
    return arr.every(item => this.isIIdTextLabel(item));
  }

  isIIdTextLabel(obj: any): obj is IIdTextLabel {
    return obj === null ?  false : (
      typeof obj._id === 'string' &&
      (typeof obj.__text === 'undefined' || typeof obj.__text === 'string') &&
      typeof obj._label_en === 'string' &&
      typeof obj._label_fr === 'string'
    );
  }

  // filter an IParentChildren array by parentId and return its children
  filterParentChildrenArray(arr: IParentChildren[], pId: string) : ICodeDefinition[]{
    if (!pId) {
      return [];
    }
    const filteredArray = arr.filter(
      (x) => x.parentId === pId
    );
    //    console.log(
    //      'filterParentChildrenArray ~ filteredArray',
    //      filteredArray
    // );

    // Check if filteredArray is not empty and return children
    if (filteredArray.length > 0) {
      return filteredArray[0]['children'];
    }

    // If no match found, return an empty array
    return [];
  }    

  // return a concatated string, delimited by a space
  concat(...param: string[]): string{
    // console.log(param.join(' ')) // [1,2]
    return param.join(' ');
  }

  // reset form controls' values
  resetControlsValues(...controls: AbstractControl<any, any>[]): void {
    controls.forEach(c => {
      if (c instanceof FormArray) {
        // console.log("....FormArray")
        // If it's a FormArray, clear all existing form controls within it
        c.clear();
        c.markAsUntouched();
      } else if (c instanceof AbstractControl && 'setValue' in c) {
        // console.log("....FormControl")
        // If it's a FormControl, reset its value
        c.setValue(null);
        c.markAsUntouched();
      }
    });
  }

  getCodeDefinitionByLang(codeDefinition: ICodeDefinition, lang:string): string{
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
 getCodeDefinitionByIdByLang(id: string, list: ICodeDefinition[], lang: string): string {
    // Find the ICodeDefinition object with the matching id
    const codeDefinition = list.find(item => item.id === id);

    // If no match is found, return undefined
    if (!codeDefinition) {
      return null;
    }

    return this.getCodeDefinitionByLang(codeDefinition, lang);
  }    

  // return true if the value is in the array of valid values
  toBoolean = (value: string | number | boolean): boolean => 
    [true, 'TRUE', 'T', '1', 1].includes(typeof value === 'string' ? value.toUpperCase() : value);

  isEmpty(value: any): boolean {
    return value === null || value === undefined || value === "";
  }

  flattenArrays<T>(arrays: T[]): T[] {
    return [].concat(...arrays);
  }

  // returns true if any item in array1 is in array2
  isArray1ElementInArray2(array1: any[], array2: any[]): boolean{
    for (const item1 of array1) {
      const found = array2.find(x => x === item1);
      if (found) {
        return true;
      } 
    }
    return false;
  }

  // Function to copy values from source to destination
  copyFormGroupValues(source: FormGroup, destination: FormGroup): void {
    Object.keys(source.controls).forEach(controlName => {
      if (destination.controls[controlName]) {
        destination.controls[controlName].setValue(source.controls[controlName].value);
      }
    });
  }
  
  getControlName (control: AbstractControl) {
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

  logFormControlState(form: AbstractControl, indent: string = '\t'): void {
    if (form) {
      console.log(`${indent}Pristine: ${form.pristine}`);
      console.log(`${indent}Dirty: ${form.dirty}`);
      console.log(`${indent}Touched: ${form.touched}`);
      console.log(`${indent}Untouched: ${form.untouched}`);
      console.log(`${indent}Valid: ${form.valid}`);
      console.log(`${indent}invalid: ${form.invalid}`);
      // ... other properties you might want to log

      if (form instanceof FormGroup) {
        Object.keys(form.controls).forEach((controlName) => {
          const control = form.get(controlName);
          if (control) {
            console.log(`\t\t Control: ${controlName}`);
            this.logFormControlState(control,'\t\t');
          }
        });
      }
    }
  }

  checkInputValidity(event: any, control: AbstractControl, errorMsgKey: string): void {
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
    // logFormControlState(control);
  }  

  checkComponentChanges(changes: SimpleChanges): any[] {
    let changesArray = [];

    for (const prop in changes) {
      if (changes.hasOwnProperty(prop)) {
        const change = changes[prop];
        const isFormGroup = change.currentValue instanceof FormGroup;
        const currentValue = isFormGroup? change.currentValue.value : JSON.stringify(change.currentValue);
        const isFirstChange = change.isFirstChange();
        changesArray.push({ propertyName: prop, isFirstChange, currentValue });
      }
    }

    return changesArray;
  }

  checkFormInvalidFields(FormGroup: FormGroup) {
    let invalidFields = [];
    Object.keys(FormGroup.controls).forEach(key => {
      const control = FormGroup.get(key);
      if (control.invalid) {
        invalidFields.push(`Field '${key}' is invalid`);
      }
    });
  }

  findAndTranslateCode(codeArray:ICode[], lang:string, codeId:string) {
    const bilingualCode = this.findCodeById(codeArray, codeId);
    if (bilingualCode) {
      return this.translateCode(bilingualCode, lang);
    }
    return null; // Return null if the word is not found
  }

  translateCode(code:ICode, lang:string): string {
    // console.log("translateCode", "code", code, "lang", lang)
    return this.isFrench(lang) ? code.fr : code.en;
  }

  createIIdTextLabelObj(id: string, label_en: string, label_fr: string, text?: string) : IIdTextLabel {
    return {
      _id: id,
      __text: text,
      _label_en: label_en,
      _label_fr: label_fr
    }
  }

  //sort a list of ICode objects either by en or fr value based on the language
  sortCodeList(codeArray:ICode[], lang:string): ICode[]{
    return codeArray.sort((a, b) => this.isFrench(lang) ? a.fr.localeCompare(b.fr) : a.en.localeCompare(b.en));
  }

  // to get enum value from string
  getEnumValueFromString<T>(enumType: T, value: string): T[keyof T] | undefined {
    for (const key in enumType) {
      if (enumType[key] === value) {
        return enumType[key] as T[keyof T];
      }
    }
    return undefined;
  }

  formatAsSixDigitNumber(value: string): string {
    const leadingZeros = '000000';
    return leadingZeros.substring(0, 6 - value.length) + value;
  }

  removeFirstAndLastChars(value: string): string {
    if (value.length <= 2) {
      return '';
    }
    return value.substring(1, value.length - 1);
  }

  // get CompareFields to compare a list of Code objects
  // sort on sortPriority field first if required, and then en or fr field based on the form's language
  getCompareFields(sortOnPriority: boolean, lang: string):SortOn[]{
    let compareFields : SortOn[] = [];
    if (sortOnPriority) {
      compareFields.push(SortOn.PRIORITY);
    }

    this.isFrench(lang) ? compareFields.push(SortOn.FRENCH): compareFields.push(SortOn.ENGLISH);

    return compareFields;
  }
}
