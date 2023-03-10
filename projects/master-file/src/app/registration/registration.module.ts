import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileIoModule } from '../filereader/file-io/file-io.module';
import { SharedModule } from '../shared/shared.module';
import { MasterFileBaseComponent } from '../master-file-base/master-file-base.component';
import { RegulatoryInformationComponent } from '../regulatory-information/regulatory-information.component';
import { MasterFileDetailsComponent } from '../master-file-details/master-file.details.component';
import { MasterFileFeeComponent } from '../master-file-fee/master-file.fee.component';
import { AddressDetailsComponent } from '../address/address.details/address.details.component';
import { DataService } from '../shared/data.service';
import { RegulatoryInformationService } from '../regulatory-information/regulatory-information.service';

@NgModule({
  declarations: [
    MasterFileBaseComponent,
    RegulatoryInformationComponent,
    MasterFileDetailsComponent,
    MasterFileFeeComponent,
    AddressDetailsComponent,
  ],
  imports: [CommonModule, SharedModule, FileIoModule],
  exports: [
    MasterFileBaseComponent,
    RegulatoryInformationComponent,
    MasterFileDetailsComponent,
    MasterFileFeeComponent,
    AddressDetailsComponent,
  ],
  providers: [RegulatoryInformationService, DataService],
})
export class RegistrationModule {}
