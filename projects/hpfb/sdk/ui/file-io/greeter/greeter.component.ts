import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lib-greeter',
  templateUrl: './greeter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreeterComponent {
  @Input() name!: string;
}
