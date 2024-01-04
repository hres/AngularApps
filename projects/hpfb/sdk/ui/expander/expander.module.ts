import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpanderComponent } from './expander.component';
import {ReactiveFormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionComponent } from './accordion/accordion.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule, 
  ],
  declarations: [
    ExpanderComponent,
    AccordionComponent
  ],
  exports: [
    ExpanderComponent,
    AccordionComponent
  ]
})
export class ExpanderModule {
}
