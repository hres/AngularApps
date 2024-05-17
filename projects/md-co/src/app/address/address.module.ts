import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressDetailsComponent } from './address.details/address.details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AddressDetailsService } from './address.details/address.details.service';
import { ErrorModule, NumbersOnlyDirective, PipesModule } from '@hpfb/sdk/ui';


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
