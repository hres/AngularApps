import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContactDetailsComponent} from './contact.details/contact.details.component';
import {CompanyContactRecordComponent} from './company-contact-record/company-contact-record.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {ContactListComponent} from './contact.list/contact.list.component';
import {ContactListService} from './contact.list/contact-list.service';
import {TranslateModule} from '@ngx-translate/core';
import { ErrorModule, PipesModule, ExpanderModule, CommonUiFeatureModule } from '@hpfb/sdk/ui'; 

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    ErrorModule,
    PipesModule,
    ExpanderModule,
    TranslateModule
  ],
  declarations: [
    CompanyContactRecordComponent,
    ContactDetailsComponent,
    ContactListComponent

  ],
  exports: [
    CompanyContactRecordComponent,
    ContactDetailsComponent,
    ContactListComponent
  ],
  providers: [
   ContactListService
  ]
})
export class ContactModule { }
