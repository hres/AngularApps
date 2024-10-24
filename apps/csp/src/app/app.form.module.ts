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


@NgModule({
  declarations: [
    CertSuppProtectComponent,PatentComponent
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
    CertSuppProtectService, DatePipe, PatentService
  ],
  exports: [CommonUiFeatureModule,
    CertSuppProtectComponent,PatentComponent
   ],
})
export class AppFormModule {}
