import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'lib-privacy-statement',
    imports: [CommonModule],
    templateUrl: './privacy-statement.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: []
})
export class PrivacyStatementComponent {
  @Input() lang;
  @Input() purposeOfCollection?;
}
