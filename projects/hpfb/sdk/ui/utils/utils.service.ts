import { Injectable, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { CANADA, USA, FRENCH, NO, YES } from '../common.constants';
import { DatePipe } from '@angular/common';
import { ICode } from '../data-loader/data';
import { IIdTextLabel } from '../model/entity-base';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UtilsService {
  /**
   * Gets an yesno array
   *
   */
  getYesNoList(): string[] {
    return [YES, NO];
  }

  isCanadaOrUSA(countryValue): boolean {
    // let countryValue: string;
    // if (value) {
    //   countryValue = value.id;
    // } else {
    //   return false;
    // }
    return this.isCanada(countryValue) || this.isUsa(countryValue);
  }

  /**
   * Checks of the value is canada or not. Checks for Json object vs single value
   * @param value the value to check can be the json object with an id index.
   * @returns {boolean}
   */
  isCanada(countryValue): boolean {
    // let updatedValue = '';
    // if (value && value.id) {
    //   updatedValue = value.id;
    // } else {
    //   updatedValue = value;
    // }
    return countryValue === CANADA;
  }

  /**
   * Checks if the value usa or not. Checks for Json object vs single value
   * @param value - the value to check can be the json object with an id index.
   * @returns {boolean}
   */
  isUsa(countryValue): boolean {
    // let updatedValue = '';
    // if (value && value.id) {
    //   updatedValue = value.id;
    // } else {
    //   updatedValue = value;
    // }
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
   * get the id value from an IdTextLabel object
   * @param idTextLabelObj 
   * @returns either id or undefined
   */
  getIdFromIdTextLabel(idTextLabelObj: IIdTextLabel): string {
    return !this.isEmpty(idTextLabelObj) ? idTextLabelObj._id : undefined; 
  }

  getIdsFromIdTextLabels(idTextLabelObjs: IIdTextLabel[]): string[] {
    let ids: string[] = [];
    for (const temp of idTextLabelObjs) {
      ids.push(this.getIdFromIdTextLabel(temp));
    }
    return ids;
  }

  isEmpty(value: any): boolean {
    return value === null || value === undefined;
  }

  flattenArrays<T>(arrays: T[]): T[] {
    return [].concat(...arrays);
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

  printComponentChanges(changes: SimpleChanges): any[] {
    let changesArray = [];

    for (const prop in changes) {
      if (changes.hasOwnProperty(prop)) {
        const change = changes[prop];
        const currentValue = JSON.stringify(change.currentValue);
        changesArray.push({ propertyName: prop, currentValue });
      }
    }

    return changesArray;
  }

}
