import {BrowserModule, Title} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { ContainerComponent } from './container/container.component';
import { VersionService, NoCacheHeadersInterceptor, LayoutModule, InstructionService } from '@hpfb/sdk/ui/';
import { CommonModule } from '@angular/common';
import { CommonUiFeatureModule } from '@hpfb/sdk/ui';
import { AppFormModule } from './app.form.module';
import { InformationModule } from './information/information.module';

@NgModule({
  declarations: [AppComponent, ContainerComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    CommonUiFeatureModule,
    LayoutModule,
    AppFormModule,
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
    NoCacheHeadersInterceptor, 
  ],
  exports: [
    CommonUiFeatureModule, AppFormModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
