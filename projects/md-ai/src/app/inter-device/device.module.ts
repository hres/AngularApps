import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceItemComponent } from './device-item/device-item.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceService } from './device.service';
import { DeviceListService } from './device-list/device-list.service';

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
    DeviceItemComponent,
    DeviceListComponent,
  ],
  exports: [
    DeviceItemComponent,
    DeviceListComponent
  ],
  providers: [
    DeviceListService,
    DeviceService
  ]
})
export class DeviceModule { }