import { Injectable } from '@angular/core';
import { Enrollment } from '../models/Enrollment';
import { InstructionService } from '@hpfb/sdk/ui';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor( private instructionService : InstructionService) { }

  private appVersion: string;
  private isInternal: boolean;
  private helpIndex: { [key: string]: number }; 
  private currLanguage: string;
  private enrollment : Enrollment;

  setAppVersion(appVersion: string) {
    this.appVersion = appVersion;
  }

  getAppVersion(){
    return this.appVersion;
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

  getCurrLanguage(){
    return this.currLanguage;
  }

  setEnrollment(enrollment: Enrollment) {
    this.enrollment = enrollment;
  }

  getEnrollment(){
    return this.enrollment;
  }

}
