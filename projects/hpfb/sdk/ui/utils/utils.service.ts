import { Injectable, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { CANADA, USA, FRENCH, NO, YES } from '../common.constants';
import { DatePipe } from '@angular/common';
import { ICode, ICodeDefinition } from '../data-loader/data';
import { IIdTextLabel } from '../model/entity-base';
import { LoggerService } from '../logger/logger.service';

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
   * get the major version number in the application version
   * @param appVersion format is 1.0.0
   * @returns string, major version of the application
   */
  getApplicationMajorVersion(appVersion : string) : string{
    const majorVersion = appVersion.split('.',2).join(".");
    return majorVersion
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

    if (Array.isArray(idTextLabelObjs) && this.isArrayOfIIdTextLabel(idTextLabelObjs)) {
      for (const temp of idTextLabelObjs) {
        ids.push(this.getIdFromIdTextLabel(temp));
      }
    } else if (!Array.isArray(idTextLabelObjs) && this.isIIdTextLabel(idTextLabelObjs)){
      ids.push(this.getIdFromIdTextLabel(idTextLabelObjs));
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
    return (
      typeof obj._id === 'string' &&
      (typeof obj.__text === 'undefined' || typeof obj.__text === 'string') &&
      typeof obj._label_en === 'string' &&
      typeof obj._label_fr === 'string'
    );
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
  
  isEmpty(value: any): boolean {
    return value === null || value === undefined;
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

  displayFormControlInfo(control: AbstractControl) {
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
    // displayFormControlInfo(control);
  }  

  checkComponentChanges(changes: SimpleChanges): any[] {
    let changesArray = [];

    for (const prop in changes) {
      if (changes.hasOwnProperty(prop)) {
        const change = changes[prop];
        const currentValue = JSON.stringify(change.currentValue);
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

    /**
   * @deprecated Use findAndTranslateCode instead.
   */
  translateWord(bilingualList:any[], lang:string, value:string) {
    const word = bilingualList.find((item) => item.en === value || item.fr === value);
    if (word) {
        return lang === 'en' ? word.en : word.fr;
    }
    return null; // Return null if the word is not found
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

}
