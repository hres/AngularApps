import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpanderComponent } from './expander.component';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    TranslateModule, 
  ],
  declarations: [
    ExpanderComponent,
  ],
  exports: [
    ExpanderComponent,
  ]
})
export class ExpanderModule {
}
