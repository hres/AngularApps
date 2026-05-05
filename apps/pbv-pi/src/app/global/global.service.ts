import { Injectable, signal } from '@angular/core';

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
  private _dossierTypes: ICodeDefinition[] = [];
  private _countryList: ICode[];
  private _yesnoList: ICode[];
  private _subTypeList: ICodeDefinition[];
  private _drugUse: ICodeDefinition[] = [];
  private _scheduleClaims: ICode[] = [];
  private _disinfectTypes: ICode[] = [];
  private _vetSpecies: ICode[] = [];
  private _specySubTypes: ICode[] = [];

  public get vetSpecies(): ICode[] {
    return this._vetSpecies;
  }
  public set vetSpecies(value: ICode[]) {
    this._vetSpecies = value;
  }
  public get specySubTypes(): ICode[] {
    return this._specySubTypes;
  }
  public set specySubTypes(value: ICode[]) {
    this._specySubTypes = value;
  }

  public get disinfectTypes(): ICode[] {
    return this._disinfectTypes;
  }
  public set disinfectTypes(value: ICode[]) {
    this._disinfectTypes = value;
  }

  lang = signal<string>('');

  setCurrLanguage(language: string): void {
    this.lang.set(language);
  }

  getCurrLanguage() {
    return this.lang();
  }
  public get scheduleClaims(): ICode[] {
    return this._scheduleClaims;
  }
  public set scheduleClaims(value: ICode[]) {
    this._scheduleClaims = value;
  }

  public get drugUse(): ICodeDefinition[] {
    return this._drugUse;
  }
  public set drugUse(value: ICodeDefinition[]) {
    this._drugUse = value;
  }

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

  public get dossierTypes(): ICodeDefinition[] {
    return this._dossierTypes;
  }

  public set dossierTypes(value: ICodeDefinition[]) {
    this._dossierTypes = value;
  }

  public get countryList(): ICode[] {
    return this._countryList;
  }

  public set countryList(value: ICode[]) {
    this._countryList = value;
  }

  public get yesnoList(): ICode[] {
    return this._yesnoList;
  }

  public set yesnoList(value: ICode[]) {
    this._yesnoList = value;
  }

  public get subTypeList(): ICodeDefinition[] {
    return this._subTypeList;
  }

  public set subTypeList(value: ICodeDefinition[]) {
    this._subTypeList = value;
  }
}
