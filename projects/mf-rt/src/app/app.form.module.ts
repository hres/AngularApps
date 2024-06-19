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
import { RegulatoryInformationComponent } from './regulatory-information/regulatory-information.component';
import { RegulatoryInformationService } from './regulatory-information/regulatory-information.service';
import { CertificationComponent } from './certification/certification.component';
import { MasterFileFeeComponent } from './master-file-fee/master-file-fee.component';
import { MasterFileFeeService } from './master-file-fee/master-file.fee.service';
import { CertificationService } from './certification/certification.service';

@NgModule({
  declarations: [
    RegulatoryInformationComponent,
    MasterFileFeeComponent, 
    CertificationComponent
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
    RegulatoryInformationService,
    MasterFileFeeService,
    CertificationService
  ],
  exports: [CommonUiFeatureModule, 
    RegulatoryInformationComponent,
    MasterFileFeeComponent, 
    CertificationComponent
   ],
})
export class AppFormModule {}