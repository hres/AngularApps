import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule } from '../pipes/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorModule } from '../error-msg/error-ui.module';
import { UpperCaseInputDirective } from './directives/to-uppercase.directive';
import { VersionService } from './version.service';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgPipesModule,
    NgSelectModule,
    ErrorModule,
    TranslateModule,
    UpperCaseInputDirective,
  ],
  providers: [VersionService],
  declarations: [UpperCaseInputDirective],
})
export class SharedModule {}
