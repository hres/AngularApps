import { NgModule } from '@angular/core';
import {
  ErrorModule,
  PipesModule,
  ExpanderModule,
  AddressModule,
  ContactModule,
  CommonUiFeatureModule,
  NumbersOnlyDirective
} from '@hpfb/sdk/ui';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ApplicationInfoDetailsComponent } from './application-info-details/application-info.details.component';
import { ApplicationInfoDetailsService } from './application-info-details/application-info.details.service';
// import { DeviceModule } from "./device/device.module";
import { DeviceListService } from './device/device.list/device-list.service';
import { DeviceRecordService } from './device/device-record/device-record.service';
import { DeviceDetailsService } from './device/device.details/device.details.service';
import { ApplicationInfoBaseService } from './form-base/application-info-base.service';
import { MaterialModule } from "./bio-material/material.module";
import { DeviceModule } from './inter-device/device.module';

@NgModule({
    declarations: [
        ApplicationInfoDetailsComponent
    ],
    providers: [
        ApplicationInfoDetailsService,
        DeviceListService,
        DeviceRecordService,
        DeviceDetailsService,
        ApplicationInfoBaseService
    ],
    exports: [CommonUiFeatureModule,
        ApplicationInfoDetailsComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        CommonUiFeatureModule,
        ErrorModule,
        PipesModule,
        ExpanderModule,
        ReactiveFormsModule,
        TranslateModule,
        NumbersOnlyDirective,
        DeviceModule,
        MaterialModule
    ]
})
export class AppFormModule {}