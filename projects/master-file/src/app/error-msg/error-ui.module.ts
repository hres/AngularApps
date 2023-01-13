import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSummaryComponent } from './error-summary/error-summary.component';
import {ControlMessagesComponent} from './control-messages.component/control-messages.component';
import {TranslateModule} from '@ngx-translate/core';
import { NgPipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    NgPipesModule,
    TranslateModule
  ],
  declarations: [
    ErrorSummaryComponent,
    ControlMessagesComponent
  ],
  exports:[
    ErrorSummaryComponent,
    ControlMessagesComponent
  ]
})
export class ErrorModule { }
