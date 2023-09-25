import { Injectable } from '@angular/core';
import { Enrollment } from '../models/Enrollment';
import { InstructionService } from '@hpfb/sdk/ui';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor( private instructionService : InstructionService) { }

  private helpIndex: { [key: string]: number }; 
  private currLanguage: string;
  private enrollment : Enrollment;

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
