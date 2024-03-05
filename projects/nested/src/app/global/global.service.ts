import { Injectable, signal } from '@angular/core';
import { Enrollment } from '../models/Enrollment';
import { InstructionService } from '@hpfb/sdk/ui';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor(private instructionService: InstructionService) {}

  private devEnv: boolean;
  private appVersion: string;
  private isInternal: boolean;
  private helpIndex: { [key: string]: number };
  private currLanguage: string;
  private enrollment: Enrollment;

  // global signal for the showErrors flag
  showErrors = signal<boolean>(false);
  // global signal for the contacts FormArray values from the contact-list component
  contactsFormArrValue = signal<any[]>([]);

  setShowErrors(flag: boolean): void {
    console.log("setShowErrors to", flag)
    this.showErrors.set(flag);
  }

  setContactsFormArrValue(val: any[]): void {
    this.contactsFormArrValue.set(val);
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
