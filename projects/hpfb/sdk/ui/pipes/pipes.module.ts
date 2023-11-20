import { NgModule } from '@angular/core';

import { FormControlPipe } from './form/form-control.pipe';
import { JsonKeysPipe } from './json/json-keys.pipe';
import { TextTransformPipe } from './text/text-transform.pipe';
import { AriaTransformPipe } from './text/aria-transform.pipe';

@NgModule({
  declarations: [
    JsonKeysPipe,
    FormControlPipe,
    TextTransformPipe,
    AriaTransformPipe
  ],
  exports: [
    JsonKeysPipe,
    FormControlPipe,
    TextTransformPipe,
    AriaTransformPipe
  ],
})
export class PipesModule {}