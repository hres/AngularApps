import { Injectable } from '@angular/core';

import {
  ENGLISH,
  HelpSequence,
  ICode,
  ICodeDefinition,
  IParentChildren,
} from '@hpfb/sdk/ui';
import { ProductInformation } from '../models/ProductInformation';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private _devEnv: boolean = false;
  private _debugEnabled: boolean = false;
  private _appVersion: string = '0.0.0';
  private _helpIndex: HelpSequence;
  private _currLanguage: string = ENGLISH;
  private _enrollment: ProductInformation;
  private _byPassChecksum: boolean = false;

  // data loaded from json files
  private _countryList: ICode[];

  constructor() {}

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

  public get debugEnabled(): boolean {
    return this._debugEnabled;
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

  public set byPassChecksum(value: boolean) {
    this._byPassChecksum = value;
  }

  public get byPassChecksum(): boolean {
    return this._byPassChecksum;
  }

  /**
   * Getter enrollment
   * @return {ProductInformation}
   */
  public get enrollment(): ProductInformation {
    return this._enrollment;
  }

  /**
   * Setter enrollment
   * @param {ProductInformation} value
   */
  public set enrollment(value: ProductInformation) {
    this._enrollment = value;
  }

  public get countryList(): ICode[] {
    return this._countryList;
  }

  public set countryList(value: ICode[]) {
    this._countryList = value;
  }
}
