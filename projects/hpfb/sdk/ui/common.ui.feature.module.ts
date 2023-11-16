import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsService } from './utils/utils.service';
import { VersionService } from './version/version.service';
import { LoggerService } from './logger/logger.service';
import { ConverterService } from './converter/converter.service';
import { EntityBaseService } from './model/entity-base.service';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  providers: [
    UtilsService,
    VersionService,
    LoggerService,
    ConverterService,
    EntityBaseService,
  ],
  exports: [

  ],
})
export class CommonUiFeatureModule {}
