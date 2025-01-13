import { ApplicationConfig } from '@angular/core';
import { InstructionService, NoCacheHeadersInterceptor, ValidationService, VersionService,VALIDATION_SERVICES } from '@hpfb/sdk/ui';
import { HTTP_INTERCEPTORS, HttpBackend, HttpClient, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; 
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { PbvValidationService } from '@hpfb/pbv';


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
        }
      })
    ),
    Title,
    VersionService,
    { provide: HTTP_INTERCEPTORS, useClass: NoCacheHeadersInterceptor, multi: true },
    {
      provide: VALIDATION_SERVICES,
      useClass: ValidationService,
      multi: true, // Allow multiple services
    },
    {
      provide: VALIDATION_SERVICES,
      useClass: PbvValidationService,
      multi: true, 
    },
    InstructionService,
    NoCacheHeadersInterceptor, 
  ],
};

// export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

export function HttpLoaderFactory(_httpBackend: HttpBackend) {
  return new MultiTranslateHttpLoader(_httpBackend, ['./assets/i18n/', './assets/i18n/common/']); 
}
