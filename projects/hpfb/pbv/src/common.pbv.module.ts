import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EntityBasePbvService } from './model/entity-base.service';
import { VALIDATION_SERVICES } from '@hpfb/sdk/ui';
import { PbvValidationService } from './validation/pbv.validation.service';
// import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    // BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  providers: [
    EntityBasePbvService,
  PbvValidationService,
  {
    provide: VALIDATION_SERVICES,
    useExisting: PbvValidationService,
    multi: true
  }
  ],
  exports: [

  ],
})
export class CommonPbvModule {}
