import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule } from '../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorModule } from '../error-msg/error-ui.module';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgPipesModule,
    ErrorModule,
    TranslateModule,
  ],
})
export class SharedModule {}
