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
import { TransactionDetailsComponent } from './transaction-details/transaction.details.component';
import { TransactionDetailsService } from './transaction-details/transaction.details.service';
import { TransactionFeeComponent } from './transaction-fee/transaction.fee.component';
import { TransactionFeeService } from './transaction-fee/transaction.fee.service';

@NgModule({
  declarations: [
    TransactionDetailsComponent,
    TransactionFeeComponent
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
    TransactionDetailsService,
    TransactionFeeService
  ],
  exports: [CommonUiFeatureModule, 
    TransactionDetailsComponent,
    TransactionFeeComponent
  ],
})
export class AppFormModule {}