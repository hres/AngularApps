import { Injectable } from '@angular/core';

import { ENGLISH, ICode, ICodeAria, ICodeDefinition, IParentChildren, InstructionService } from '@hpfb/sdk/ui';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private _devEnv: boolean = false;
  private _appVersion: string  = '0.0.0';
  private _helpIndex: { [key: string]: number };
  private _currLanguage: string = ENGLISH;
  private _enrollment: Transaction;

  // data loaded from json files
  private _countriesList: ICodeAria[];
  private _yesnoList: ICode[];
  private _mfTypes: ICodeAria[] = [];
  private _mfUses: ICode[];
  private _txDescs: ICodeDefinition[] = [];
  private _mfTypeTxDescs: IParentChildren[] = [];
  private _mfRevisedTypeDescs: IParentChildren[] = [];

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

  public get helpIndex(): { [key: string]: number }{
    return this._helpIndex;
  }

  public set currLanguage(language: string) {
    this._currLanguage = language;
  }

  public get currLanguage() : string{
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

  public get countriesList(): ICodeAria[] {
		return this._countriesList;
	}

  public set countriesList(value: ICodeAria[]) {
		this._countriesList = value;
	}

  public get yesnoList(): ICode[] {
		return this._yesnoList;
	}

	public set yesnoList(value: ICode[]) {
		this._yesnoList = value;
	}

  // Getter for mfTypes
  public get mfTypes(): ICodeAria[] {
    return this._mfTypes;
  }

  // Setter for mfTypes
  public set mfTypes(value: ICodeAria[]) {
    this._mfTypes = value;
  }

  // Getter for _mfUses
  public get mfUses(): ICode[] {
    return this._mfUses;
  }

  // Setter for _mfUses
  public set mfUses(value: ICode[]) {
    this._mfUses = value;
  }  

  // Getter for _txDescs
  public get txDescs(): ICodeDefinition[] {
    return this._txDescs;
  }
  
  // Setter for _txDescs
  public set txDescs(value: ICodeDefinition[]) {
    this._txDescs = value;
  }

  // Getter for _mfTypeTxDescs
  public get mfTypeTxDescs(): IParentChildren[] {
    return this._mfTypeTxDescs;
  }

  // Setter for _mfTypeTxDescs
  public set mfTypeTxDescs(value: IParentChildren[]) {
    this._mfTypeTxDescs = value;
  }  

  // Getter for _mfRevisedTypeDescs
  public get mfRevisedTypeDescs(): IParentChildren[] {
    return this._mfRevisedTypeDescs;
  }

  // Setter for _mfRevisedTypeDescs
  public set mfRevisedTypeDescs(value: IParentChildren[]) {
    this._mfRevisedTypeDescs = value;
  }  
}
