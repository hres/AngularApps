import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialItemComponent } from './material-item/material-item.component';
import { MaterialListComponent } from './material-list/material-list.component';
import { MaterialService } from './material.service';
import { MaterialListService } from './material-list/material-list.service'; 
import { MaterialInfoComponent } from './material-info/material-info.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {BrowserModule} from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorModule, PipesModule, ExpanderModule, NumbersOnlyDirective } from '@hpfb/sdk/ui';
import { PopupComponent } from '@hpfb/sdk/ui/popup/popup.component';

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
    NumbersOnlyDirective,
    PopupComponent
  ],
  declarations: [
    MaterialItemComponent,
    MaterialListComponent,
    MaterialInfoComponent
  ],
  exports: [
    MaterialItemComponent,
    MaterialListComponent,
    MaterialInfoComponent
  ],
  providers: [
   MaterialListService,
   MaterialService
  ]
})
export class MaterialModule { }
