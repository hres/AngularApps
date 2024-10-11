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
import { FeesComponent } from './fees/fees.component';
import { FeesService } from './fees/fees.service';

@NgModule({
  declarations: [
    RegulatoryInformationComponent,
    TransactionDetailsComponent,
    FeesComponent
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
    TransactionDetailsService,
    FeesService
  ],
  exports: [CommonUiFeatureModule,
    RegulatoryInformationComponent,
    TransactionDetailsComponent,
    FeesComponent
   ],
})
export class AppFormModule {}