import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-privacy-statement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-statement.component.html',
  styles: [],
})
export class PrivacyStatementComponent {
  @Input() lang;
}
