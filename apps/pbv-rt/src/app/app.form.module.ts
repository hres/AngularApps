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
import { RegulatoryContactComponent } from './regulatory-contact/regulatory-contact.component';
import { RegulatoryContactService } from './regulatory-contact/regulatory-contact.service';

@NgModule({
  declarations: [
    RegulatoryInformationComponent,
    RegulatoryContactComponent,
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
    RegulatoryContactService,
    TransactionDetailsService
  ],
  exports: [CommonUiFeatureModule,
    RegulatoryInformationComponent,
    RegulatoryContactComponent,
    TransactionDetailsComponent
   ],
})
export class AppFormModule {}