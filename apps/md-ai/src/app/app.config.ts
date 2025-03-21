import { ApplicationConfig } from '@angular/core';
import { InstructionService, NoCacheHeadersInterceptor, VALIDATION_SERVICES, ValidationService, VersionService } from '@hpfb/sdk/ui';
import { HTTP_INTERCEPTORS, HttpBackend, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpBackend]
        },
      })
    ),
    Title,
    VersionService,
    { provide: HTTP_INTERCEPTORS, useClass: NoCacheHeadersInterceptor, multi: true },
    InstructionService,
    NoCacheHeadersInterceptor, 
    {
      provide: VALIDATION_SERVICES,
      useClass: ValidationService,
      multi: true, // Allow multiple services
    }
  ],
};

export function HttpLoaderFactory(_httpBackend: HttpBackend) {
  return new MultiTranslateHttpLoader(_httpBackend, ['./assets/i18n/', './assets/i18n/common/']); 
}