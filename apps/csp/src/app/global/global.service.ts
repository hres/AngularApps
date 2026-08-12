import { Injectable } from '@angular/core';

import {
  ENGLISH,
  HelpSequence,
  ICode,
  ICodeAria,
  InstructionService,
} from '@hpfb/sdk/ui';
import { Transaction } from '../models/transaction';
import { FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private _devEnv: boolean = false;
  private _appVersion: string = '0.0.0';
  private _helpIndex: HelpSequence;
  private _currLanguage: string = ENGLISH;
  private _enrollment: Transaction;
  private _byPassChecksum: boolean = false;

  // data loaded from json files
  private _countryList: ICode[];
  private _provinceList: ICode[];
  private _stateList: ICode[];
  private _yesnoList: ICode[];
  private _drugUses: ICode[] = [];
  private _timingOfApplicant: ICodeAria[] = [];
  private _payMethod: ICode[] = [];
  private _languageList: ICode[];
  private _attestationAsApplicant: ICodeAria[] = [];
  private _attestationAsSubmission: ICodeAria[] = [];
  private _countryIdMappingList: any[] = [];
  private _allCountryList: ICode[];


  constructor(private instructionService: InstructionService) {}

  /**
   * Getter devEnv
   * @return {boolean}
   */
  public get devEnv(): boolean {
    return this._devEnv;
  }

  /**
   * Setter devEnv
   * @param {boolean} value
   */
  public set devEnv(value: boolean) {
    this._devEnv = value;
  }

  /**
   * Getter appVersion
   * @return {string}
   */
  public get appVersion(): string {
    return this._appVersion;
  }

  /**
   * Setter appVersion
   * @param {string} value
   */
  public set appVersion(value: string) {
    this._appVersion = value;
  }

  public set helpIndex(helpIndex: HelpSequence) {
    this._helpIndex = helpIndex;
  }

  public get helpIndex(): HelpSequence {
    return this._helpIndex;
  }

  public set currLanguage(language: string) {
    this._currLanguage = language;
  }

  public get currLanguage(): string {
    return this._currLanguage;
  }

  /**
   * Getter enrollment
   * @return {Transaction}
   */
  public get enrollment(): Transaction {
    return this._enrollment;
  }

  /**
   * Setter enrollment
   * @param {Transaction} value
   */
  public set enrollment(value: Transaction) {
    this._enrollment = value;
  }

  public get countryList(): ICode[] {
    return this._countryList;
  }

  public set countryList(value: ICode[]) {
    this._countryList = value;
  }

  public get allCountryList(): ICode[] {
    return this._allCountryList;
  }

  public set allCountryList(value: ICode[]) {
    this._allCountryList = value;
  }

  public get provinceList(): ICode[] {
    return this._provinceList;
  }

  public set provinceList(value: ICode[]) {
    this._provinceList = value;
  }

  public get stateList(): ICode[] {
    return this._stateList;
  }

  public set stateList(value: ICode[]) {
    this._stateList = value;
  }

  public get yesnoList(): ICode[] {
    return this._yesnoList;
  }

  public set yesnoList(value: ICode[]) {
    this._yesnoList = value;
  }

  public set byPassChecksum(value: boolean) {
    this._byPassChecksum = value;
  }

  public get byPassChecksum(): boolean {
    return this._byPassChecksum;
  }

   // Getter for _drugUses
  public get drugUses(): ICode[] {
      return this._drugUses;
    }

    // Setter for _mfUses
    public set drugUses(value: ICode[]) {
      this._drugUses = value;
    }

         // Getter for timing of Applicant
  public get timingOfApplicant(): ICodeAria[] {
    return this._timingOfApplicant;
   }

     // Setter for timing of Applicant
  public set timingOfApplicant(value: ICodeAria[]) {
    this._timingOfApplicant = value;
  }

  // Getter for pay method
  public get payMethod(): ICode[] {
    return this._payMethod;
  }

  // Setter for pay method
  public set payMethod(value: ICode[]) {
    this._payMethod = value;
  }

  public get languageList(): ICode[] {
    return this._languageList;
  }

  public set languageList(value: ICode[]) {
    this._languageList = value;

  }

  // Getter for pay method
  public get attestationAsApplicant(): ICodeAria[] {
    return this._attestationAsApplicant;
  }

  // Setter for pay method
  public set attestationAsApplicant(value: ICodeAria[]) {
    this._attestationAsApplicant = value;
  }


    // Getter for pay method
    public get attestationAsSubmission(): ICodeAria[] {
      return this._attestationAsSubmission;
    }

    // Setter for pay method
    public set attestationAsSubmission(value: ICodeAria[]) {
     this._attestationAsSubmission = value;
    }


    public get countryIdMappingList(): any[] {
      return this._countryIdMappingList;
    }

    public set countryIdMappingList(value: any[]) {
      this._countryIdMappingList = value;
    }

  /** Checking is date is fully filled out and between the years 1900 - 3000
   * @param event
   * @param form
   */
  public isDateValid(event: any, form: FormGroup): void {
    const inputName = event.target.attributes.getNamedItem('ng-reflect-name')?.value;
    const dateControl = form.get(inputName);
    const dateValue = dateControl?.value;
    const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateValue);

    if (!isValidFormat) {
      dateControl?.setErrors({ 'error.msg.invalidDate': true });
    } else {
      const year = parseInt(dateValue.substring(0, 4), 10);
      if (year < 1900 || year > 3000) {
        dateControl?.setErrors({ 'error.msg.invalidDate': true });
      } else {
        if (dateControl?.errors?.['error.msg.invalidDate']) {
          delete dateControl.errors['error.msg.invalidDate'];
          if (Object.keys(dateControl.errors).length === 0) {
            dateControl.setErrors(null);
          }
        }
      }
    }
  }


}
