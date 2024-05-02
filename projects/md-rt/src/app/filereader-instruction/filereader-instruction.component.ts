import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-filereader-instruction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filereader-instruction.component.html',
  styles: ``,
  encapsulation: ViewEncapsulation.None
})
export class FilereaderInstructionComponent {
  @Input() lang: string;
}
