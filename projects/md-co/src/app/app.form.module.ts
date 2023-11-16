import { NgModule } from '@angular/core';
import {
  ErrorModule,
  PipesModule,
  FileIoModule,
  ExpanderModule,
  AddressModule,
} from '@hpfb/sdk/ui';
import { CommonModule } from '@angular/common';
import { FormBaseComponent } from './form-base/form-base.component';
import { ContactModule } from './contact/contact.module';
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
    FormBaseComponent,
    CompanyInfoComponent,
    PrimaryContactComponent,
    CompanyAdminChangesComponent,
    MailtoHelpComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ErrorModule,
    PipesModule,
    FileIoModule,
    ExpanderModule,
    ReactiveFormsModule,
    TranslateModule,
    AddressModule,
    ContactModule,
  ],
  providers: [
    CompanyDataLoaderService,
    CompanyBaseService,
    CompanyInfoService,
    PrimaryContactService,
    CompanyAdminChangesComponent,
    CompanyAdminChangesService,
  ],
  exports: [FormBaseComponent],
})
export class AppFormModule {}
