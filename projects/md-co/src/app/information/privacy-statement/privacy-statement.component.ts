import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-privacy-statement',
  templateUrl: './privacy-statement.component.html',
  styles: [],
})
export class PrivacyStatementComponent {
  @Input() lang;
}
