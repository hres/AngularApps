import { Injectable } from '@angular/core';

import { ENGLISH, HelpIndex, ICode, ICodeAria, ICodeDefinition, IParentChildren, InstructionService } from '@hpfb/sdk/ui';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private _devEnv: boolean = false;
  private _appVersion: string  = '0.0.0';
  private _helpIndex: HelpIndex;
  private _currLanguage: string = ENGLISH;
  private _enrollment: Transaction;

  // data loaded from json files
  private _countryList: ICode[];
  private _provinceList: ICode[];
  private _stateList: ICode[];
  private _yesnoList: ICode[];
  private _mfTypes: ICodeAria[] = [];
  private _mfUses: ICode[];
  private _txDescs: ICodeDefinition[] = [];
  private _mfTypeTxDescs: IParentChildren[] = [];
  private _mfRevisedTypeDescs: IParentChildren[] = [];
  private _whoResponsible: ICode[];
  private _languageList: ICode[];

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

  public get helpIndex(): HelpIndex{
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

  // Getter for _whoResponsible
  public get whoResponsible(): ICode[] {
    return this._whoResponsible;
  }

  // Setter for _whoResponsible
  public set whoResponsible(value: ICode[]) {
    this._whoResponsible = value;
  }

    // Getter for _languageList
    public get languageList(): ICode[] {
      return this._languageList;
    }
  
    // Setter for _whoResponsible
    public set languageList(value: ICode[]) {
      this._languageList = value;
    }
}
