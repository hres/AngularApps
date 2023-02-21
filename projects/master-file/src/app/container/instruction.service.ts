import { Injectable } from '@angular/core';

@Injectable()
export class InstructionService {
  constructor() {}

  /**
   * Sets the Help Text Index
   *
   */
  getHelpTextIndex() {
    const helpTextInx = {
      loadFileInx: 0,
      tr2: 0,
      tr3: 0,
      tr2a: 0,
      tr2b: 0,
      tr2c: 0,
      tr4: 0,
      tr5: 0,
    };
    const keys = Object.keys(helpTextInx);
    for (let i = 0; i < keys.length; i++) {
      helpTextInx[keys[i]] = i + 1;
    }

    return helpTextInx;
  }
}
