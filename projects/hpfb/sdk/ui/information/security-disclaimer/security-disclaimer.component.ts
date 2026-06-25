
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'lib-security-disclaimer',
    imports: [],
    templateUrl: './security-disclaimer.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: []
})
export class SecurityDisclaimerComponent {
  @Input() lang;
}
