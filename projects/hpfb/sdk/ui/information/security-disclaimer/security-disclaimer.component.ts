
import { Component, Input } from '@angular/core';

@Component({
    selector: 'lib-security-disclaimer',
    imports: [],
    templateUrl: './security-disclaimer.component.html',
    styles: []
})
export class SecurityDisclaimerComponent {
  @Input() lang;
}
