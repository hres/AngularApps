import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBaseComponent } from './form-base/form-base.component';
import { InformationModule } from './information/information.module';
import { CommonFormDendencyModule, UiModule } from '@hpfb/sdk/ui';
import { CompanyDataLoaderService } from './form-base/company-data-loader.service';
import { CompanyBaseService } from './form-base/company-base.service';
import { CompanyInfoService } from './company-info/company.info.service';
import { CompanyInfoComponent } from './company-info/company.info.component';
import { ContactModule } from './contact/contact.module';

@NgModule({
  declarations: [FormBaseComponent, CompanyInfoComponent],
  imports: [
    CommonModule,
    InformationModule,
    UiModule,
    CommonFormDendencyModule,
    ContactModule
  ],
  providers:[CompanyDataLoaderService, CompanyBaseService, CompanyInfoService],
  exports: [FormBaseComponent, InformationModule],
})
export class AppFormModule { } 
