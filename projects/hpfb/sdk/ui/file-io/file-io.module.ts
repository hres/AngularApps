import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilereaderComponent} from './filereader/filereader.component';
import {FileIoGlobalsService} from './file-io-globals.service';
import {FileConversionService} from './file-conversion.service';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [
    FilereaderComponent
  ],
  exports: [
    FilereaderComponent
  ],
  providers: [
    FileConversionService,
    FileIoGlobalsService
  ]
})
export class FileIoModule {
}
