import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpanderComponent } from './expander/expander.component';
import { GreeterComponent } from './file-io/greeter/greeter.component';
import { LayoutComponent } from './layout/layout.component';
import { FileIoModule } from './file-io/file-io.module';
import { AddressDetailsComponent } from './address/address.details/address.details.component';
import { AddressDetailsService } from './address/address.details/address.details.service';
import { UtilsService } from './utils/utils.service';
import { FormControlPipe } from './pipes/form-control.pipe';

@NgModule({
  declarations: [LayoutComponent, AddressDetailsComponent, ExpanderComponent, GreeterComponent, FormControlPipe],
  imports: [CommonModule, FileIoModule],
  providers: [AddressDetailsService, UtilsService],
  exports: [LayoutComponent, AddressDetailsComponent, ExpanderComponent, GreeterComponent, FileIoModule, FormControlPipe],
})
export class UiModule {}
