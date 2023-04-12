import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileIoModule } from '../filereader/file-io/file-io.module';
import { SharedModule } from '../shared/shared.module';
import { MasterFileBaseComponent } from '../master-file-base/master-file-base.component';
import { RegulatoryInformationComponent } from '../regulatory-information/regulatory-information.component';
import { MasterFileFeeComponent } from '../master-file-fee/master-file.fee.component';
import { AddressDetailsComponent } from '../address/address.details/address.details.component';
import { DataService } from '../shared/data.service';
import { RegulatoryInformationService } from '../regulatory-information/regulatory-information.service';
import { ContactDetailsComponent } from '../contact/contact.details/contact.details.component';

@NgModule({
  declarations: [
    MasterFileBaseComponent,
    RegulatoryInformationComponent,
    MasterFileFeeComponent,
    AddressDetailsComponent,
    ContactDetailsComponent
  ],
  imports: [CommonModule, SharedModule, FileIoModule],
  exports: [
    MasterFileBaseComponent,
    RegulatoryInformationComponent,
    MasterFileFeeComponent,
    AddressDetailsComponent,
    ContactDetailsComponent
  ],
  providers: [RegulatoryInformationService, DataService],
})
export class RegistrationModule {}
