import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-security-disclaimer',
  templateUrl: './security-disclaimer.component.html',
  styles: [],
})
export class SecurityDisclaimerComponent {
  @Input() lang;
}
