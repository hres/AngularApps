import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  encapsulation: ViewEncapsulation.None
})
export class InstructionComponent {
  @Input() helpTextSequences;
  @Input() lang;
  constructor() {
    // console.log(
    //   'InstructionComponent ~ helpTextSequences',
    //   this.helpTextSequences
    // );
  }
}
