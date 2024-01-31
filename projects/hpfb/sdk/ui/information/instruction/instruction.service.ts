import { Injectable } from '@angular/core';

@Injectable()
export class InstructionService {
  private helpTextIndx: { [key: string]: number } = {};
  constructor() {
  }

  /**
   * Sets the Help Text Index
   *
   * instructionHeadings should be a list
   */
  getHelpTextIndex(instructionHeadings : any) { 

    for (let i = 0; i < instructionHeadings.length; i++) {
      this.helpTextIndx[instructionHeadings[i]] = i + 1;
    }
    console.log(this.helpTextIndx);
    return this.helpTextIndx;
    

  }

 
}
