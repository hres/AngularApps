import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, effect, input, model } from '@angular/core';
import { ENGLISH, ICode, PipesModule } from '@hpfb/sdk/ui';

@Component({
  selector: 'lib-radio-button',
  standalone: true,
  imports: [CommonModule, PipesModule],
  template: `
  <ul [ngClass]="{ 'form-inline': orientation() === 'horizontal', 'form-group': orientation() === 'vertical' }" class="list-unstyled" >
    <li [ngClass]="{ 'label-inline': orientation() === 'horizontal', 'radio': orientation() === 'vertical' }"
        *ngFor="let obj of objList(); let i = index">
        <label for="controlName(){{i}}">
            <input type="radio" name="controlName()" id="controlName(){{i}}" [value]="obj.id"
                [checked]="obj.id === value()" (change)="onValueChange(obj)" />
            {{ obj | textTransform: lang() }}
        </label>
    </li>
  </ul>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class RadioButton<T extends ICode> {
  readonly lang = input<string>(ENGLISH);
  readonly orientation = input<Orientation>('horizontal'); 
  readonly fieldName = input<string>('noname'); 
  readonly objList = input<T[]>([]);
  readonly value = model<string>();
  // @Output() valueSelected = new EventEmitter<string>();
  // selectedValue = signal<string | null>(null);

  onValueChange(newvalue: any) {
    console.log("*****", newvalue);
    // this.selectedValue.set(value);
    // this.valueSelected.emit(value);
    this.value.set(newvalue.id);
  }

  // display<T extends ICode>(per: T): void {
  //   console.log(`${per.id}`);
  // }

  // readonly orientationChange = output<string>();

  constructor(){
    // effect is going to run anytime any of the signals that is read in this function changes
    // but in order to know which signals are even being read, it has to run once initially
    effect(() => {
      // this.orientationChange.emit(this.orientation());
      
    })
  }

}

export type Orientation = 'vertical' | 'horizontal';
