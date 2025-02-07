import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {BrowserModule} from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorModule, PipesModule, ExpanderModule, NumbersOnlyDirective } from '@hpfb/sdk/ui';
import { PopupComponent } from '@hpfb/sdk/ui';
import { CompanyContactItemComponent } from './company-contact-item/company-contact-item.component';
import { CompanyContactListComponent } from './company-contact-list/company-contact-list.component';
import { CompanyContactService } from './company-contact.service';
import { ContactModule } from '@hpfb/pbv';
import { CompanyContactItemService } from './company-contact-item/company-contact-item.service';
import { CompanyContactListService } from './company-contact-list/company-contact-list.service'


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
    ContactModule
  ],
  declarations: [
    CompanyContactItemComponent,
    CompanyContactListComponent
  ],
  exports: [
    CompanyContactItemComponent,
    CompanyContactListComponent
  ],
  providers: [
   CompanyContactService,
   CompanyContactItemService,
   CompanyContactListService
  ]
})
export class CompanyContactModule { }
