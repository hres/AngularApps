import { Injectable } from '@angular/core';

import {
  ENGLISH,
  HelpSequence,
  ICode,
  ICodeDefinition,
  IParentChildren,
} from '@hpfb/sdk/ui';
import { Company } from '../models/Company';


@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private _devEnv: boolean = false;
  private _debugEnabled: boolean = false;
  private _appVersion: string = '0.0.0';
  private _helpIndex: HelpSequence;
  private _currLanguage: string = ENGLISH;
  private _enrollment: Company;
  private _byPassChecksum: boolean = false;
  private _isInternal: boolean = false;

  // data loaded from json files
  private _dossierTypes: ICodeDefinition[] = [];
  private _countryList: ICode[];
  private _yesnoList: ICode[];
  private _subTypeList: ICodeDefinition[];
  private _enrolmentStatusesList: ICode[];
  private _languageList: ICode[];
  private _companyRolesList: ICode[];
  private _productLineList: ICode[];

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

  public set isInternal(value: boolean) {
    this._isInternal = value;
  }

  public get isInternal(): boolean {
    return this._isInternal;
  }

  /**
   * Getter enrollment
   * @return {Company}
   */
  public get enrollment(): Company {
    return this._enrollment;
  }

  /**
   * Setter enrollment
   * @param {Company} value
   */
  public set enrollment(value: Company) {
    this._enrollment = value;
  }

  public get countryList(): ICode[] {
    return this._countryList;
  }

  public set countryList(value: ICode[]) {
    this._countryList = value;
  }

  public set enrolmentStatusList(value: ICode[]) {
    this._enrolmentStatusesList = value;
  }

  public get enrolmentStatusList() : ICode[] {
    return this._enrolmentStatusesList;
  }

  public get languageList(): ICode[] {
    return this._languageList;
  }

  public set languageList(value: ICode[]) {
    this._languageList = value;
  }

  public get companyRolesList(): ICode[] {
    return this._companyRolesList;
  }

  public set companyRolesList(value: ICode[]) {
    this._companyRolesList = value;
  }

  public get productLineList(): ICode[] {
    return this._productLineList;
  }

  public set productLineList(value: ICode[]) {
    this._productLineList = value;
  }
}
