import { NgModule } from '@angular/core';
import {
  ErrorModule,
  PipesModule,
  ExpanderModule,
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
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpBackend } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';


export function HttpLoaderFactory(_httpBackend: HttpBackend) {
  return new MultiTranslateHttpLoader(_httpBackend, ['./assets/i18n/', './assets/i18n/common/',]);
}
@NgModule({
  declarations: [
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
    NumbersOnlyDirective,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend],
      },
    }),
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
    PrimaryContactComponent,
    CompanyAdminChangesComponent,
    MailtoHelpComponent],
})
export class AppFormModule {}