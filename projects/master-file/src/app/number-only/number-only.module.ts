import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumbersOnlyDirective } from './number.only.directive';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [
    NumbersOnlyDirective
  ],
  exports: [
    NumbersOnlyDirective
  ]
})
export class NumbersOnlyModule { }
