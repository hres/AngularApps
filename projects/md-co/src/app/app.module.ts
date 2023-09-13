import {BrowserModule, Title} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { AppFormModule } from './app.form.module';
import { UiModule } from '@hpfb/sdk/ui';
// import { NoCacheHeadersInterceptor } from '../cache.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    // NumbersOnlyModule,
    UiModule,
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
    // { provide: HTTP_INTERCEPTORS, useClass: NoCacheHeadersInterceptor, multi: true }
  ],
  exports: [AppFormModule],
  bootstrap: [AppComponent],
})
export class AppModule {}


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
