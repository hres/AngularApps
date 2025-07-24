
import { Component, Input } from '@angular/core';

@Component({
    selector: 'pb-lib-privacy-statement',
    imports: [],
    templateUrl: './privacy-statement.component.html',
    styles: []
})
export class PrivacyStatementComponent {
  @Input() lang;
}
