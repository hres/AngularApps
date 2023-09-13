import { Injectable } from '@angular/core';
import { CANADA, NO, USA, YES } from '../common.constants';

@Injectable()
export class UtilsService {
  /**
   * Gets an yesno array
   *
   */
  getYesNoList(): string[] {
    return [YES, NO];
  }

  isCanadaOrUSA(value) : boolean{
    let countryValue: string;
    if (value) {
      countryValue = value.id;
    } else {
      return false;
    }
    return (this.isCanada(countryValue) || this.isUsa(countryValue));
  }

  /**
   * Checks of the value is canada or not. Checks for Json object vs single value
   * @param value the value to check can be the json object with an id index.
   * @returns {boolean}
   */
  isCanada(value)  : boolean{
    let updatedValue = '';
    if (value && value.id) {
      updatedValue = value.id;
    } else {
      updatedValue = value;
    }
    return (updatedValue === CANADA);
  }

  /**
   * Checks if the value usa or not. Checks for Json object vs single value
   * @param value - the value to check can be the json object with an id index.
   * @returns {boolean}
   */
  isUsa(value)  : boolean{
    let updatedValue = '';
    if (value && value.id) {
      updatedValue = value.id;
    } else {
      updatedValue = value;
    }
    return (updatedValue === USA);
  }

}
