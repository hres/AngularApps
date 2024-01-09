import { Injectable } from '@angular/core';
import { ICode, InstructionService } from '@hpfb/sdk/ui';
import { Enrollment } from '../models/Enrollment';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor(private instructionService: InstructionService) {}

  private devEnv: boolean;
  private appVersion: string;
  private helpIndex: { [key: string]: number };
  private currLanguage: string;
  private enrollment: Enrollment;

  // data loaded from json files
  private deviceClasseList: ICode[];
  private RegulatoryActivityTypesList: ICode[];

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

  setEnrollment(enrollment: Enrollment) {
    this.enrollment = enrollment;
  }

  getEnrollment() {
    return this.enrollment;
  }

	public get $deviceClasseList(): ICode[] {
		return this.deviceClasseList;
	}

	public set $deviceClasseList(value: ICode[]) {
		this.deviceClasseList = value;
	}

	public get $RegulatoryActivityTypesList(): ICode[] {
		return this.RegulatoryActivityTypesList;
	}

	public set $RegulatoryActivityTypesList(value: ICode[]) {
		this.RegulatoryActivityTypesList = value;
	}

}
