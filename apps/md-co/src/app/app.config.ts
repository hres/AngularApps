import { ApplicationConfig } from '@angular/core';
import { InstructionService, NoCacheHeadersInterceptor, VALIDATION_SERVICES, ValidationService, VersionService } from '@hpfb/sdk/ui';
import { HTTP_INTERCEPTORS, HttpBackend, HttpClient, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    Title,
    VersionService,
    { provide: HTTP_INTERCEPTORS, useClass: NoCacheHeadersInterceptor, multi: true },
    {
      provide: VALIDATION_SERVICES,
      useClass: ValidationService,
      multi: true, // Allow multiple services
    },
    InstructionService,
    NoCacheHeadersInterceptor,
  ],
};
