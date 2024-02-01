import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DeviceDetailsComponent} from './device.details/device.details.component';
import {DeviceRecordComponent} from './device-record/device-record.component';
import {DeviceListComponent} from './device.list/device.list.component';
import {DeviceListService} from './device.list/device-list.service';
import { DeviceDetailsService } from './device.details/device.details.service';
import { DeviceRecordService } from './device-record/device-record.service';
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
    DeviceRecordComponent,
    DeviceDetailsComponent,
    DeviceListComponent
  ],
  exports: [
    DeviceRecordComponent,
    DeviceDetailsComponent,
    DeviceListComponent
  ],
  providers: [
   DeviceListService,
   DeviceRecordService,
   DeviceDetailsService
  ]
})
export class DeviceModule { }
