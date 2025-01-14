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
import { HelpTextModuleModule } from "./instruction/help-text-module.module";
import { AppSignalService } from './signal/app-signal.service';
import { RegulatoryEnrolmentComponent } from './regulatory-enrolment/regulatory-enrolment.component';
import { RegulatoryEnrolmentService } from './regulatory-enrolment/regulatory-enrolment.service';

@NgModule({
  declarations: [
    RegulatoryEnrolmentComponent
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
    HelpTextModuleModule
],
  providers: [
    AppSignalService,
    RegulatoryEnrolmentService
  ],
  exports: [CommonUiFeatureModule,
    RegulatoryEnrolmentComponent
   ],
})
export class AppFormModule {}