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
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { TransactionDetailsService } from './transaction-details/transaction-details.service';

@NgModule({
  declarations: [
    RegulatoryInformationComponent,
    TransactionDetailsComponent
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
    TransactionDetailsService
  ],
  exports: [CommonUiFeatureModule,
    RegulatoryInformationComponent,
    TransactionDetailsComponent
   ],
})
export class AppFormModule {}