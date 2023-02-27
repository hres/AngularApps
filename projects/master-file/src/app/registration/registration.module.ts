import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterFileBaseComponent } from '../master-file-base/master-file-base.component';
import { SharedModule } from '../shared/shared.module';
import { MasterFileDetailsComponent } from '../master-file-details/master-file.details.component';
import { MasterFileFeeComponent } from '../master-file-fee/master-file.fee.component';
import { FileIoModule } from '../filereader/file-io/file-io.module';
import { AddressDetailsComponent } from '../address/address.details/address.details.component';
import { ContactDetailsComponent } from '../contact/contact.details/contact.details.component';

@NgModule({
  declarations: [
    MasterFileBaseComponent,
    MasterFileDetailsComponent,
    MasterFileFeeComponent,
    AddressDetailsComponent,
    ContactDetailsComponent
  ],
  imports: [CommonModule, SharedModule, FileIoModule],
  exports: [
    MasterFileBaseComponent,
    MasterFileDetailsComponent,
    MasterFileFeeComponent,
    AddressDetailsComponent,
    ContactDetailsComponent
  ],
})
export class RegistrationModule {}
