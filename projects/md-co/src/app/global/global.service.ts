import { Injectable } from '@angular/core';
import { Enrollment } from '../models/Enrollment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  private helpIndex: any;
  private currLanguage: string;
  private enrollment : Enrollment;

  setHelpIndex(helpIndex: any) {
    this.helpIndex = helpIndex;
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
