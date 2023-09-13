import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormBaseComponent } from './form-base/form-base.component';
import { InformationModule } from './information/information.module';
import { UiModule } from '@hpfb/sdk/ui';
import { SharedModule } from './shared/shared.module';
import { CompanyDataLoaderService } from './form-base/company-data-loader.service';
import { CompanyBaseService } from './form-base/company-base.service';
import { CompanyInfoService } from './company-info/company.info.service';

@NgModule({
  declarations: [FormBaseComponent],
  imports: [
    CommonModule,
    TranslateModule,
    InformationModule,
    UiModule,
    SharedModule
  ],
  providers:[CompanyDataLoaderService, CompanyBaseService, CompanyInfoService],
  exports: [FormBaseComponent, InformationModule],
})
export class FormModule { }
