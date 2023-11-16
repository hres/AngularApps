import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormDendencyModule } from './common.form.dendency.module';
import { FileIoModule } from './file-io/file-io.module';
import { LayoutComponent } from './layout/layout.component';
import { GreeterComponent } from './file-io/greeter/greeter.component';
import { AddressDetailsComponent } from './address/address.details/address.details.component';
import { AddressDetailsService } from './address/address.details/address.details.service';
import { UtilsService } from './utils/utils.service';
import { VersionService } from './version/version.service';
import { NoCacheHeadersInterceptor } from './interceptor/cache.interceptor';
import { FileConversionService } from './file-io/file-conversion.service';
import { PrivacyStatementComponent } from './information/privacy-statement/privacy-statement.component';
import { SecurityDisclaimerComponent } from './information/security-disclaimer/security-disclaimer.component';
import { InstructionService } from './information/instruction/instruction.service';
import { LoggerService } from './logger/logger.service';
import { ConverterService } from './converter/converter.service';
import { EntityBaseService } from './model/entity-base.service';
import { ErrorModule } from './error-msg/error-ui.module';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  declarations: [
    LayoutComponent,
    AddressDetailsComponent,
    GreeterComponent,
    PrivacyStatementComponent,
    SecurityDisclaimerComponent,

  ],
  imports: [
    CommonModule,
    CommonFormDendencyModule,
    FileIoModule,
    ErrorModule,
    PipesModule,
  ],
  providers: [AddressDetailsService, FileConversionService, UtilsService, VersionService, NoCacheHeadersInterceptor, InstructionService, 
    LoggerService, ConverterService, EntityBaseService],
  exports: [
    LayoutComponent,
    AddressDetailsComponent,
    GreeterComponent,
    PrivacyStatementComponent,
    SecurityDisclaimerComponent,
  ],
})
export class UiModule {}
 