import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from './contact.list/contact.list.component';
import { ContactListService } from './contact.list/contact-list.service';
import { ContactDetailsComponent } from './contact.details/contact.details.component';
import { CompanyContactRecordComponent } from './company-contact-record/company-contact-record.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyContactRecordService } from './company-contact-record/company-contact-record.service';
import { ContactDetailsService } from './contact.details/contact.details.service';
import { ErrorModule, ExpanderModule, NumbersOnlyDirective, PipesModule, PopupComponent } from '@hpfb/sdk/ui';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    ErrorModule,
    PipesModule,
    ExpanderModule,
    NumbersOnlyDirective,
    PopupComponent
  ],
  declarations: [
    CompanyContactRecordComponent,
    ContactDetailsComponent,
    ContactListComponent,
  ],
  exports: [
    CompanyContactRecordComponent,
    ContactDetailsComponent,
    ContactListComponent
  ],
  providers: [
    ContactListService,
    CompanyContactRecordService,
    ContactDetailsService,
  ],
})
export class ContactModule {}
