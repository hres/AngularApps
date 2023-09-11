import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormBaseComponent } from './form-base/form-base.component';
import { InformationModule } from './information/information.module';
import { UiModule } from '@hpfb/sdk/ui';

@NgModule({
  declarations: [FormBaseComponent],
  imports: [
    CommonModule,
    TranslateModule,
    InformationModule,
    UiModule
  ],
  exports: [FormBaseComponent, InformationModule],
})
export class FormModule { }
