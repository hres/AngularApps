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
import { RegulatoryContactComponent } from './regulatory-contact/regulatory-contact.component';
import { RegulatoryContactService } from './regulatory-contact/regulatory-contact.service';
import { HelpTextModuleModule } from "./instruction/help-text-module.module";
import { AppSignalService } from './signal/app-signal.service';
import { AddressDetailsComponent } from './address/address.details/address.details.component';
import { AddressDetailsService } from './address/address.details/address.details.service';
import { ContactDetailsComponent } from './contact/contact.details/contact.details.component';
import { ContactDetailsService } from './contact/contact.details/contact.details.service';

@NgModule({
  declarations: [
    RegulatoryInformationComponent,
    RegulatoryContactComponent,
    TransactionDetailsComponent,
    FeesComponent,
    AddressDetailsComponent,
    ContactDetailsComponent
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
    NumbersOnlyDirective,
    HelpTextModuleModule
],
  providers: [
    AppSignalService,
    RegulatoryInformationService,
    RegulatoryContactService,
    TransactionDetailsService,
    FeesService,
    AddressDetailsService,
    ContactDetailsService
  ],
  exports: [CommonUiFeatureModule,
    RegulatoryInformationComponent,
    RegulatoryContactComponent,
    TransactionDetailsComponent,
    FeesComponent,
    AddressDetailsComponent,
    ContactDetailsComponent
   ],
})
export class AppFormModule {}