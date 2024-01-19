import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressDetailsComponent } from './address.details/address.details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
import { ErrorModule } from '../error-msg/error-ui.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../public-api';
import { AddressDetailsService } from './address.details/address.details.service';
import { NumbersOnlyDirective } from '../directives/number.only.directive';

@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    ErrorModule,
    PipesModule,
    TranslateModule,
    NumbersOnlyDirective
  ],
  declarations: [AddressDetailsComponent],
  exports: [AddressDetailsComponent],
  providers: [AddressDetailsService],
})
export class AddressModule {}
