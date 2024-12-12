import { NgModule } from '@angular/core';
import {
  ErrorModule,
  PipesModule,
  ExpanderModule,
  CommonUiFeatureModule,
  NumbersOnlyDirective
} from '@hpfb/sdk/ui';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HelpTextModuleModule } from "./instruction/help-text-module.module";
import { AppSignalService } from './signal/app-signal.service';
import { ProductInformationComponent } from './product-information/product-information.component';
import { ProductInformationService } from './product-information/product-information.service';

@NgModule({
  declarations: [
    ProductInformationComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    CommonUiFeatureModule,
    ErrorModule,
    PipesModule,
    ExpanderModule,
    ReactiveFormsModule,
    TranslateModule,
    NumbersOnlyDirective,
    HelpTextModuleModule
],
  providers: [
    AppSignalService,
    ProductInformationComponent,
    ProductInformationService
  ],
  exports: [CommonUiFeatureModule,
    ProductInformationComponent
   ],
})
export class AppFormModule {}