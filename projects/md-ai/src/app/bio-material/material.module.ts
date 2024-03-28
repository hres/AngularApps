import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialItemComponent } from './material-item/material-item.component';
import { MaterialListComponent } from './material-list/material-list.component';
import { MaterialService } from './material.service';
import { MaterialListService } from './material-list/material-list.service'; 

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {BrowserModule} from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorModule, PipesModule, ExpanderModule, NumbersOnlyDirective } from '@hpfb/sdk/ui';

@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    ErrorModule,
    PipesModule,
    ExpanderModule,
    NumbersOnlyDirective
  ],
  declarations: [
    MaterialItemComponent,
    MaterialListComponent,
  ],
  exports: [
    MaterialItemComponent,
    MaterialListComponent
  ],
  providers: [
   MaterialListService,
   MaterialService
  ]
})
export class MaterialModule { }
