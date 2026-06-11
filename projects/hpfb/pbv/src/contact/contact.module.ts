import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactDetailsComponent } from './contact.details/contact.details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorModule, PipesModule, ExpanderModule, NumbersOnlyDirective, PopupComponent, UtilsService, ConverterService } from '@hpfb/sdk/ui';
import { ContactDetailsService } from './contact.details/contact.details.service';

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
    PopupComponent
  ],
  declarations: [
    ContactDetailsComponent
  ],
  exports: [
    ContactDetailsComponent
  ],
  providers: [
    ContactDetailsService,
    UtilsService,
    ConverterService
  ],
})
export class ContactModule {}