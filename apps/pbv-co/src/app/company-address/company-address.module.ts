import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {BrowserModule} from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorModule, PipesModule, ExpanderModule, NumbersOnlyDirective, RecordDeleteService, RecordDiscardService } from '@hpfb/sdk/ui';
import { PopupComponent, ConfirmationPopupComponent } from '@hpfb/sdk/ui';
import { CompanyAddressItemComponent } from './company-address-item/company-address-item.component';
import { CompanyAddressListComponent } from './company-address-list/company-address-list.component';
import { CompanyAddressService } from './company-address.service';
import { AddressModule } from '@hpfb/pbv';
import { CompanyAddressItemService } from './company-address-item/company-address-item.service';
import { CompanyAddressListService } from './company-address-list/company-address-list.service';

@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    ErrorModule,
    PipesModule,
    ExpanderModule,
    NumbersOnlyDirective,
    PopupComponent,
    ConfirmationPopupComponent,
    AddressModule
  ],
  declarations: [
    CompanyAddressItemComponent,
    CompanyAddressListComponent
  ],
  exports: [
    CompanyAddressItemComponent,
    CompanyAddressListComponent
  ],
  providers: [
   CompanyAddressService,
   CompanyAddressItemService,
   CompanyAddressListService,
   RecordDeleteService,
   RecordDiscardService
  ]
})
export class CompanyAddressModule { }
