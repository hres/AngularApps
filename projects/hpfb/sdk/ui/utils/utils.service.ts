import { Injectable, SimpleChanges } from '@angular/core';
import { CANADA, FRENCH, NO, USA, YES } from '../common.constants';
import { DatePipe } from '@angular/common';

@Injectable()
export class UtilsService {
  /**
   * Gets an yesno array
   *
   */
  getYesNoList(): string[] {
    return [YES, NO];
  }

  isCanadaOrUSA(value): boolean {
    let countryValue: string;
    if (value) {
      countryValue = value.id;
    } else {
      return false;
    }
    return this.isCanada(countryValue) || this.isUsa(countryValue);
  }

  /**
   * Checks of the value is canada or not. Checks for Json object vs single value
   * @param value the value to check can be the json object with an id index.
   * @returns {boolean}
   */
  isCanada(value): boolean {
    let updatedValue = '';
    if (value && value.id) {
      updatedValue = value.id;
    } else {
      updatedValue = value;
    }
    return updatedValue === CANADA;
  }

  /**
   * Checks if the value usa or not. Checks for Json object vs single value
   * @param value - the value to check can be the json object with an id index.
   * @returns {boolean}
   */
  isUsa(value): boolean {
    let updatedValue = '';
    if (value && value.id) {
      updatedValue = value.id;
    } else {
      updatedValue = value;
    }
    return updatedValue === USA;
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
}
