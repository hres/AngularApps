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
import { CompanyInfoComponent } from './company-info/company.info.component';
import { PrimaryContactComponent } from './primary-contact/primary.contact.component';
import { PrimaryContactService } from './primary-contact/primary.contact.service';
import { CompanyAdminChangesComponent } from './comp-admin-changes/company-admin.changes.componet';
import { CompanyAdminChangesService } from './comp-admin-changes/company-admin.changes.service';
import { MailtoHelpComponent } from './mailto-help/mailto.help.component';
import { CompanyBaseService } from './form-base/company-base.service';
import { CompanyInfoService } from './company-info/company.info.service';
import { CompanyDataLoaderService } from './form-base/company-data-loader.service';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CompanyInfoComponent,
    PrimaryContactComponent,
    CompanyAdminChangesComponent,
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
    NumbersOnlyDirective
  ],
  providers: [
    CompanyDataLoaderService,
    CompanyBaseService,
    CompanyInfoService,
    PrimaryContactService,
    CompanyAdminChangesComponent,
    CompanyAdminChangesService,
  ],
  exports: [CommonUiFeatureModule, 
    CompanyInfoComponent,
    PrimaryContactComponent,
    CompanyAdminChangesComponent,
    MailtoHelpComponent],
})
export class AppFormModule {}