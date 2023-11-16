import {BrowserModule, Title} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { ContainerComponent } from './container/container.component';
import { ErrorModule, PipesModule, FileIoModule, NoCacheHeadersInterceptor, ExpanderModule } from '@hpfb/sdk/ui';
import { VersionService, InstructionService } from '@hpfb/sdk/ui/';
import { CommonModule } from '@angular/common';
import { FormBaseComponent } from './form-base/form-base.component';
import { InformationModule } from './information/information.module';
import { CommonFormDendencyModule, UiModule } from '@hpfb/sdk/ui';
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

@NgModule({
  declarations: [AppComponent, ContainerComponent, FormBaseComponent, CompanyInfoComponent, PrimaryContactComponent, CompanyAdminChangesComponent, MailtoHelpComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    ErrorModule,
    PipesModule,
    FileIoModule,
    InformationModule,
    ExpanderModule,
    UiModule,
    CommonFormDendencyModule,
    ContactModule,
    
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    Title,
    VersionService,
    { provide: HTTP_INTERCEPTORS, useClass: NoCacheHeadersInterceptor, multi: true },
    InstructionService,
    CompanyDataLoaderService, CompanyBaseService, CompanyInfoService, PrimaryContactService, CompanyAdminChangesComponent, CompanyAdminChangesService
  ],
  exports: [
    // AppFormModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
