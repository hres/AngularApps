import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBaseComponent } from './form-base/form-base.component';
import { InformationModule } from './information/information.module';
import { CommonFormDendencyModule, UiModule } from '@hpfb/sdk/ui';
import { CompanyDataLoaderService } from './form-base/company-data-loader.service';
import { CompanyBaseService } from './form-base/company-base.service';
import { CompanyInfoService } from './company-info/company.info.service';
import { CompanyInfoComponent } from './company-info/company.info.component';
import { PrimaryContactComponent } from './primary-contact/primary.contact.component';
import { PrimaryContactService } from './primary-contact/primary.contact.service';
import { CompanyAdminChangesComponent } from './comp-admin-changes/company-admin.changes.componet';
import { CompanyAdminChangesService } from './comp-admin-changes/company-admin.changes.service';
import { MailtoHelpComponent } from './mailto-help/mailto.help.component';

@NgModule({
  declarations: [FormBaseComponent, CompanyInfoComponent, PrimaryContactComponent, CompanyAdminChangesComponent, MailtoHelpComponent],
  imports: [
    CommonModule,
    InformationModule,
    UiModule,
    CommonFormDendencyModule
  ],
  providers:[CompanyDataLoaderService, CompanyBaseService, CompanyInfoService, PrimaryContactComponent, PrimaryContactService, CompanyAdminChangesComponent, CompanyAdminChangesService],
  exports: [FormBaseComponent, InformationModule],
})
export class AppFormModule { } 
