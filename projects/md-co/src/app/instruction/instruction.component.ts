import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-instruction',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './instruction.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./instruction.component.css']
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
