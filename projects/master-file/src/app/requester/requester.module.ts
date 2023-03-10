import { NgModule } from '@angular/core';
import {RequesterDetailsComponent} from './requester.details/requester.details.component';
import {RequesterRecordComponent} from './requester-record/requester-record.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {SelectModule} from 'ng2-select';
import {FileIoModule} from '../filereader/file-io/file-io.module';
import {ErrorModule} from '../error-msg/error-ui.module';
import {RequesterListComponent} from './requester.list/requester.list.component';
import {RequesterListService} from './requester.list/requester-list.service';
import {CommonFeatureModule} from '../common/common-feature.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    // SelectModule,
    FileIoModule,
    ErrorModule,
    CommonFeatureModule,
    SharedModule
  ],
  declarations: [
    RequesterRecordComponent,
    RequesterDetailsComponent,
    RequesterListComponent
  ],
  exports: [
    RequesterRecordComponent,
    RequesterDetailsComponent,
    RequesterListComponent
  ],
  providers: [
   RequesterListService
  ]
})
export class RequesterModule { }
