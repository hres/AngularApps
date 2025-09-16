import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-control-number-helptext',
  templateUrl: './control-number-helptext.component.html',
  standalone: false
})
export class ControlNumberHelptextComponent {
  @Input() lang;

}
