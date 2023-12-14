import { ApplicationConfig } from '@angular/core';
import { InstructionService, NoCacheHeadersInterceptor, VersionService } from '@hpfb/sdk/ui';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { Title, bootstrapApplication } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
    Title,
    VersionService,
    { provide: HTTP_INTERCEPTORS, useClass: NoCacheHeadersInterceptor, multi: true },
    InstructionService,
    NoCacheHeadersInterceptor, 
  ],
};

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}