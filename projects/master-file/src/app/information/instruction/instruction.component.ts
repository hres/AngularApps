import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styles: [],
})
export class InstructionComponent {
  @Input() helpTextSequences;
  @Input() lang;
  constructor() {
    console.log(
      'InstructionComponent ~ helpTextSequences',
      this.helpTextSequences
    );
  }
}
