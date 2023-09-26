import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilereaderComponent} from './filereader/filereader.component';
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
    FileConversionService
  ]
})
export class FileIoModule {
}
