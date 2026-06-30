
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'pb-lib-privacy-statement',
    imports: [],
    templateUrl: './privacy-statement.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: []
})
export class PrivacyStatementComponent {
  @Input() lang;
}
