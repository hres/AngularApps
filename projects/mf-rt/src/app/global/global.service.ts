import { Injectable } from '@angular/core';

import { ICode, ICodeAria, InstructionService } from '@hpfb/sdk/ui';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor(private instructionService: InstructionService) {}

  private devEnv: boolean;
  private appVersion: string;
  private helpIndex: { [key: string]: number };
  private currLanguage: string;
  private enrollment: Transaction;

    // data loaded from json files
  private countriesList: ICodeAria[];
  private yesnoList: ICode[];


  /**
   * Getter $devEnv
   * @return {boolean}
   */
  public get $devEnv(): boolean {
    return this.devEnv;
  }

  /**
   * Setter $devEnv
   * @param {boolean} value
   */
  public set $devEnv(value: boolean) {
    this.devEnv = value;
  }

  /**
   * Getter $appVersion
   * @return {string}
   */
  public get $appVersion(): string {
    return this.appVersion;
  }

  /**
   * Setter $appVersion
   * @param {string} value
   */
  public set $appVersion(value: string) {
    this.appVersion = value;
  }

  setHelpIndex(helpIndex: string[]) {
    this.helpIndex = this.instructionService.getHelpTextIndex(helpIndex);
  }

  getHelpIndex() {
    return this.helpIndex;
  }

  setCurrLanguage(language: string) {
    this.currLanguage = language;
  }

  getCurrLanguage() {
    return this.currLanguage;
  }
  
  /**
   * Getter $enrollment
   * @return {Transaction}
   */
  public get $enrollment(): Transaction {
    return this.enrollment;
  }

  /**
   * Setter $enrollment
   * @param {Transaction} value
   */
  public set $enrollment(value: Transaction) {
    this.enrollment = value;
  }

  public get $countriesList(): ICodeAria[] {
		return this.countriesList;
	}

  public set $countriesList(value: ICodeAria[]) {
		this.countriesList = value;
	}

  public get $yesnoList(): ICode[] {
		return this.yesnoList;
	}

	public set $yesnoList(value: ICode[]) {
		this.yesnoList = value;
	}
}
