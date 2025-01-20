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
import { CompanyEnrolmentComponent } from './company-enrolment/company-enrolment.component';
import { CompanyEnrolmentService } from './company-enrolment/company-enrolment.service';
import { CompanyAddressModule } from './company-address/company-address.module';
import { CompanyContactModule } from './company-contact/company-contact.module';
import { ListService } from './record-base/list.service';

@NgModule({
  declarations: [
    CompanyEnrolmentComponent
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
    HelpTextModuleModule,
    CompanyAddressModule,
    CompanyContactModule
],
  providers: [
    AppSignalService,
    CompanyEnrolmentService,
    ListService
  ],
  exports: [CommonUiFeatureModule,
    CompanyEnrolmentComponent
   ],
})
export class AppFormModule {}