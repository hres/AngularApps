import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from './contact.list/contact.list.component';
import { ContactListService } from './contact.list/contact-list.service';
import { ContactDetailsComponent } from './contact.details/contact.details.component';
import { CompanyContactRecordComponent } from './company-contact-record/company-contact-record.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorModule } from '../error-msg/error-ui.module';
import { PipesModule } from '../pipes/pipes.module';
import { ExpanderModule } from '../expander/expander.module';
import { CompanyContactRecordService } from './company-contact-record/company-contact-record.service';
import { ContactDetailsService } from './contact.details/contact.details.service';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    ErrorModule,
    PipesModule,
    ExpanderModule,
  ],
  declarations: [
    CompanyContactRecordComponent,
    ContactDetailsComponent,
    ContactListComponent,
  ],
  exports: [
    CompanyContactRecordComponent,
    ContactDetailsComponent,
    ContactListComponent,
  ],
  providers: [
    ContactListService,
    CompanyContactRecordService,
    ContactDetailsService,
  ],
})
export class ContactModule {}
