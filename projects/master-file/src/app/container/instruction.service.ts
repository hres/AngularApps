import { Injectable } from '@angular/core';

@Injectable()
export class InstructionService {
  constructor() {}

  /**
   * Sets the Help Text Index
   *
   */
  getHelpTextIndex() {
    const helpTextIndx = {
      loadFileIndx: 0,
      dossierIdIndx: 0,
      holderAddrIndx: 0,
      agentAddrIndx: 0,
      confmValidIndx: 0,
      feeNoteIndx: 0,
      accessLetrIndx: 0,
      accountNumIndx: 0,
    };
    const keys = Object.keys(helpTextIndx);
    for (let i = 0; i < keys.length; i++) {
      helpTextIndx[keys[i]] = i + 1;
    }

    return helpTextIndx;
  }
}
