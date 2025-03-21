import { Injectable, signal } from '@angular/core';
import { ICode, ICodeAria, InstructionService } from '@hpfb/sdk/ui';
import {Enrollment} from '../models/Enrollment';

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

  private complianceList : ICode[];
  private derivateList : ICode[];
  private deviceClassesList : ICodeAria[];
  private deviceSpeciesList : ICode[];
  private deviceTissueList : ICode[];
  private rawDrugTypeList : ICode[];
  private licenceAppTypeList : ICode[];
  private mdAuditProgramList : ICode[];
  private regActivityTypeList : ICode[];
  private yesNoList : ICode[];
  private diagnosisReasonList : ICode[];
  private countryList : ICode[];

  showErrors = signal<boolean>(false);
  materialFormArrValue = signal<any[]>([]);
  deviceFormArrValue = signal<any[]>([]);
  lang = signal<string>('');

  setShowErrors(flag: boolean): void {
    // console.log("setShowErrors to", flag)
    this.showErrors.set(flag);
  }

  setMaterialsFormArrValue(val: any[]): void {
    this.materialFormArrValue.set(val);
  }

  setDevicesFormArrValue(val: any[]): void {
    this.deviceFormArrValue.set(val);
  }

  setCurrLanguage(language : string): void {
    this.lang.set(language);
  }

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

  // setCurrLanguage(language: string) {
  //   this.currLanguage = language;
  // }

  getCurrLanguage() {
    return this.lang();
  }

  setEnrollment(enrollment: Enrollment) {
    this.enrollment = enrollment;
  }

   getEnrollment() {
     return this.enrollment;
   }

  public get $complianceList(): ICode[] {
		return this.complianceList;
	}

  public set $complianceList(value: ICode[]) {
    this.complianceList = value;
  }

  public get $derivateList(): ICode[] {
		return this.derivateList;
	}

  public set $derivateList(value: ICode[]) {
    this.derivateList = value;
  }

  public get $deviceClassesList(): ICodeAria[] {
		return this.deviceClassesList;
	}

  public set $deviceClassesList(value: ICodeAria[]) {
    this.deviceClassesList = value;
  }

  public get $deviceSpeciesList(): ICode[] {
		return this.deviceSpeciesList;
	}

  public set $deviceSpeciesList(value: ICode[]) {
    this.deviceSpeciesList = value;
  }

  public get $deviceTissueList(): ICode[] {
		return this.deviceTissueList;
	}

  public set $deviceTissueList(value: ICode[]) {
    this.deviceTissueList = value;
  }

  public get $rawDrugTypeList(): ICode[] {
		return this.rawDrugTypeList;
	}

  public set $rawDrugTypeList(value: ICode[]) {
    this.rawDrugTypeList = value;
  }

  public get $licenceAppTypeList(): ICode[] {
		return this.licenceAppTypeList;
	}

  public set $licenceAppTypeList(value: ICode[]) {
    this.licenceAppTypeList = value;
  }

  public get $mdAuditProgramList(): ICode[] {
		return this.mdAuditProgramList;
	}

  public set $mdAuditProgramList(value: ICode[]) {
    this.mdAuditProgramList = value;
  }

  public get $regActivityTypeList(): ICode[] {
		return this.regActivityTypeList;
	}

  public set $regActivityTypeList(value: ICode[]) {
    this.regActivityTypeList = value;
  }

  public get $yesNoList(): ICode[] {
		return this.yesNoList;
	}

  public set $yesNoList(value: ICode[]) {
    this.yesNoList = value;
  }

  public get $diagnosisReasonList(): ICode[] {
		return this.diagnosisReasonList;
	}

  public set $diagnosisReasonList(value: ICode[]) {
    this.diagnosisReasonList = value;
  }

  public get $countryList() : ICode[] {
    return this.countryList;
  }

  public set $countryList(value: ICode[]) {
    this.countryList = value;
  }

}