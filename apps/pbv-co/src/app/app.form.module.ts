import { NgModule } from '@angular/core';
import {
  ErrorModule,
  PipesModule,
  ExpanderModule,
  CommonUiFeatureModule,
  NumbersOnlyDirective,
  ConfirmationPopupComponent
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
import { ProductLineComponent } from './product-line/product-line.component';
import { ProductLineService } from './product-line/product-line.service';
import { FormBaseService } from './form-base/form-base.service';
import { CommonPbvModule } from '@hpfb/pbv';
import { MailtoHelpComponent } from './mailto-help/mailto.help.component'

@NgModule({
  declarations: [
    CompanyEnrolmentComponent,
    ProductLineComponent,
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
    CommonPbvModule,
    ConfirmationPopupComponent
],
  providers: [
    AppSignalService,
    CompanyEnrolmentService,
    ProductLineService,
    FormBaseService
  ],
  exports: [CommonUiFeatureModule,
    CompanyEnrolmentComponent,
    ProductLineComponent,
    MailtoHelpComponent
   ],
})
export class AppFormModule {}