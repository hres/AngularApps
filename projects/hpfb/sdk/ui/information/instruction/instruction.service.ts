import { Injectable } from '@angular/core';

@Injectable()
export class InstructionService {
  private helpTextIndx: HelpIndex = {};
  constructor() {
  }

  /**
   * Sets the Help Text Index
   *
   * instructionHeadings should be a list
   * @deprecated Use `createtHelpTextIndex` instead
   */
  getHelpTextIndex(instructionHeadings : any) { 

    for (let i = 0; i < instructionHeadings.length; i++) {
      this.helpTextIndx[instructionHeadings[i]] = i + 1;
    }
    // console.log(this.helpTextIndx);
    return this.helpTextIndx;
  }

  createHelpSequence(prefix: string, suffix: string, instructionHeadings: string[]): HelpSequence {
    return instructionHeadings.reduce((acc, heading, index) => {
      const sequence = index + 1;
      acc[heading] = [
        sequence,                     // Help text sequence
        `${prefix}${sequence}`,       // Definition description (dd) id, eg tr1
        `${prefix}${sequence}${suffix}` // Superscript (sup) id, eg tr1-rf
      ];
      return acc;
    }, {} as HelpSequence);
  }

}

/**
 * @deprecated Use `HelpSequence` instead
 */
export interface HelpIndex {
  [key: string]: number;
}

export interface HelpSequence {
  [key: string]: [number, string, string]; // help text sequence at index 0, definition description (dd) id at index 1 and superscript(sup) id at index 2
}
