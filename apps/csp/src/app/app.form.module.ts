import { NgModule } from '@angular/core';
import {
  ErrorModule,
  PipesModule,
  ExpanderModule,
  CommonUiFeatureModule,
  NumbersOnlyDirective
} from '@hpfb/sdk/ui';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CertSuppProtectComponent } from './cert-supp-protect/cert-supp-protect.component';
import { CertSuppProtectService } from './cert-supp-protect/cert-supp-protect.service';
import {PatentComponent } from './patent/patent.component';
import { PatentService } from './patent/patent-service.service';
import { DrugUseComponent } from './drug-use/drug-use.component';
import { DrugUseService } from './drug-use/drug-use.service';
import { NoticeOfComplianceService } from './notice-of-compliance/notice-of-compliance.service';
import { NoticeOfComplianceComponent } from './notice-of-compliance/notice-of-compliance.component';


@NgModule({
  declarations: [
    CertSuppProtectComponent, PatentComponent, DrugUseComponent, NoticeOfComplianceComponent
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
    CertSuppProtectService, DatePipe, PatentService, DrugUseService, NoticeOfComplianceService
  ],
  exports: [CommonUiFeatureModule,
    CertSuppProtectComponent, PatentComponent, DrugUseComponent, NoticeOfComplianceComponent
   ],
})
export class AppFormModule {}
