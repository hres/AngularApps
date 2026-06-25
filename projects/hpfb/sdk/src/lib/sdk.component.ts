import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'lib-sdk',
    imports: [],
    template: `
    <p>
      sdk works!
    </p>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: ``
})
export class SdkComponent {

}
