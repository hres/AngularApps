import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-filereader-instruction',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './filereader-instruction.component.html',
  styles: ``,
  encapsulation: ViewEncapsulation.None
})
export class FilereaderInstructionComponent {
  @Input() lang: string;
  @Input() isInternal: boolean;
  @Input() showAmendNote: boolean;
}
