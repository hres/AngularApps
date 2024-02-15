import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSummaryComponent } from './error-summary/error-summary.component';
import {ControlMessagesComponent} from './control-messages/control-messages.component';
import {TranslateModule} from '@ngx-translate/core';
import { PipesModule } from '../pipes/pipes.module';
import { CommonFormDendencyModule } from '../common.form.dendency.module';
import { ErrMessageService } from './err.message.service';
import { ErrorNotificationService } from './error.notification.service';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    TranslateModule,
  ],
  declarations: [
    ErrorSummaryComponent,
    ControlMessagesComponent
  ],
  exports:[
    ErrorSummaryComponent,
    ControlMessagesComponent
  ],
  providers:[ErrMessageService, ErrorNotificationService]
})
export class ErrorModule { } 