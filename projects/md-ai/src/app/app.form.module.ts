import { NgModule } from '@angular/core';
import {
  ErrorModule,
  PipesModule,
  ExpanderModule,
  AddressModule,
  ContactModule,
  CommonUiFeatureModule,
  NumbersOnlyDirective
} from '@hpfb/sdk/ui';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ApplicationInfoDetailsComponent } from './application-info-details/application-info.details.component';
import { ApplicationInfoDetailsService } from './application-info-details/application-info.details.service';

@NgModule({
  declarations: [
    ApplicationInfoDetailsComponent
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
    NumbersOnlyDirective
  ],
  providers: [
    ApplicationInfoDetailsService
  ],
  exports: [CommonUiFeatureModule, 
    ApplicationInfoDetailsComponent
  ],
})
export class AppFormModule {}