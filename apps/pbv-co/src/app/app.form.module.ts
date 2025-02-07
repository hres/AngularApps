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
import { FormBaseService } from './form-base/form-base.service';
import { CommonPbvModule } from '@hpfb/pbv';
import { MailtoHelpComponent } from './mailto-help/mailto.help.component'

@NgModule({
  declarations: [
    CompanyEnrolmentComponent,
    MailtoHelpComponent
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
    CompanyContactModule,
    CommonPbvModule
],
  providers: [
    AppSignalService,
    CompanyEnrolmentService,
    FormBaseService
  ],
  exports: [CommonUiFeatureModule,
    CompanyEnrolmentComponent,
    MailtoHelpComponent
   ],
})
export class AppFormModule {}