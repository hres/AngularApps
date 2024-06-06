import { Injectable } from '@angular/core';

import { ENGLISH, ICode, ICodeAria, InstructionService } from '@hpfb/sdk/ui';
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
    
}
