import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  exports: [FormsModule, ReactiveFormsModule, TranslateModule],
})
export class CommonFormDendencyModule {}

// this class contains all required libraries to build reactive forms with language translations