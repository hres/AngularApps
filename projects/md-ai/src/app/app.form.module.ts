import { NgModule } from '@angular/core';
import {
  ErrorModule,
  PipesModule,
  ExpanderModule,
  CommonUiFeatureModule,
  NumbersOnlyDirective
} from '@hpfb/sdk/ui';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ApplicationInfoDetailsComponent } from './application-info-details/application-info.details.component';
import { ApplicationInfoDetailsService } from './application-info-details/application-info.details.service';
import { ApplicationInfoBaseService } from './form-base/application-info-base.service';
import { MaterialModule } from "./bio-material/material.module";
import { DeviceModule } from './inter-device/device.module';
import { PriorityReviewComponent } from './priority-review/priority-review.component';
import { PriorityReviewService } from './priority-review/priority-review.service';
import { StandardsCompliedComponent } from './standards-complied/standards-complied.component';
import { StandardsCompliedService } from './standards-complied/standards-complied.component';


@NgModule({
    declarations: [
        ApplicationInfoDetailsComponent,
        PriorityReviewComponent,
        StandardsCompliedComponent
    ],
    providers: [
        ApplicationInfoDetailsService,
        ApplicationInfoBaseService,
        PriorityReviewService,
        StandardsCompliedService
    ],
    exports: [CommonUiFeatureModule,
        ApplicationInfoDetailsComponent,
        PriorityReviewComponent,
        StandardsCompliedComponent
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