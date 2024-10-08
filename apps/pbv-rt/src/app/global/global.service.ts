import { Injectable } from '@angular/core';

import {
  ENGLISH,
  HelpIndex,
  ICode,
  ICodeAria,
  ICodeDefinition,
  IParentChildren,
  InstructionService,
} from '@hpfb/sdk/ui';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private _devEnv: boolean = false;
  private _appVersion: string = '0.0.0';
  private _helpIndex: HelpIndex;
  private _currLanguage: string = ENGLISH;
  private _enrollment: Transaction;
  private _byPassChecksum: boolean = false;

  // data loaded from json files
  private _countryList: ICode[];
  private _provinceList: ICode[];
  private _stateList: ICode[];
  private _yesnoList: ICode[];
  private _dossierTypes: ICodeDefinition[] = [];
  private _raLeads: ICodeDefinition[] = [];
  private _raTypes: ICodeDefinition[] = [];
  private _transactionDescriptions: ICodeDefinition[] = [];
  private _dossierTypeAndRaLeadsRelationship: any[] = [];
  private _raLeadAndRaTypesRelationship: any[] = [];
  private _dossierTypeRaTypeAndTransactionDescriptionsRelationship: any[] = [];
  private _dossierTypeRaLeads: IParentChildren[] = [];
  private _adminSubTypes: ICode[];

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

  public set helpIndex(helpIndex: string[]) {
    this._helpIndex = this.instructionService.getHelpTextIndex(helpIndex);
  }

  public get helpIndex(): HelpIndex {
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

  public get dossierTypes(): ICodeDefinition[] {
    return this._dossierTypes;
  }

  public set dossierTypes(value: ICodeDefinition[]) {
    this._dossierTypes = value;
  }

  public get raLeads(): ICodeDefinition[] {
    return this._raLeads;
  }

  public set raLeads(value: ICodeDefinition[]) {
    this._raLeads = value;
  }

  public get raTypes(): ICodeDefinition[] {
    return this._raTypes;
  }

  public set raTypes(value: ICodeDefinition[]) {
    this._raTypes = value;
  }

  public get transactionDescriptions(): ICodeDefinition[] {
    return this._transactionDescriptions;
  }

  public set transactionDescriptions(value: ICodeDefinition[]) {
    this._transactionDescriptions = value;
  }

  public get dossierTypeAndRaLeadsRelationship(): any[] {
    return this._dossierTypeAndRaLeadsRelationship;
  }

  public set dossierTypeAndRaLeadsRelationship(value: any[]) {
    this._dossierTypeAndRaLeadsRelationship = value;
  }

  public get raLeadAndRaTypesRelationship(): any[] {
    return this._raLeadAndRaTypesRelationship;
  }

  public set raLeadAndRaTypesRelationship(value: any[]) {
    this._raLeadAndRaTypesRelationship = value;
  }

  public get dossierTypeRaTypeAndTransactionDescriptionsRelationship(): any[] {
    return this._dossierTypeRaTypeAndTransactionDescriptionsRelationship;
  }

  public set dossierTypeRaTypeAndTransactionDescriptionsRelationship(value: any[]) {
    this._dossierTypeRaTypeAndTransactionDescriptionsRelationship = value;
  }

  public get adminSubTypes(): ICode[] {
    return this._adminSubTypes;
  }

  public set adminSubTypes(value: ICode[]) {
    this._adminSubTypes = value;
  }
}
