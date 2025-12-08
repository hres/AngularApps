import { Injectable } from '@angular/core';
import { Enrollment } from '../models/Enrollment';
import { InstructionService } from '@hpfb/sdk/ui';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor(private instructionService: InstructionService) {}

  private _devEnv: boolean = false;

  private appVersion: string;
  private isInternal: boolean;
  private helpIndex: { [key: string]: number };
  private currLanguage: string;
  private enrollment: Enrollment;
  private _debugEnabled: boolean = false;
  private _byPassChecksum: boolean = false;


  public get devEnv(): boolean {
    return this._devEnv;
  }
  public set devEnv(value: boolean) {
    this._devEnv = value;
  }
  public get byPassChecksum(): boolean {
    return this._byPassChecksum;
  }
  public set byPassChecksum(value: boolean) {
    this._byPassChecksum = value;
  }
  public get debugEnabled(): boolean {
    return this._debugEnabled;
  }
  public set debugEnabled(value: boolean) {
    this._debugEnabled = value;
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

  public get $isInternal(): boolean {
    return this.isInternal;
  }

  public set $isInternal(value: boolean) {
    this.isInternal = value;
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
}
