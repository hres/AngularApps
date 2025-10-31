
import { Component, Input } from '@angular/core';

@Component({
    selector: 'md-lib-privacy-statement',
    imports: [],
    templateUrl: './privacy-statement.component.html',
    styles: []
})
export class PrivacyStatementComponent {
  @Input() lang;
}
