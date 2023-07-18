import { NgModule } from '@angular/core';

import { FormControlPipe } from './form/form-control.pipe';
import { JsonKeysPipe } from './json/json-keys.pipe';
import { FormGroupPipe } from './form/form-group.pipe';
import { TextTransformPipe } from './text/text-transform.pipe';
import { AriaTransformPipe } from './text/aria-transform.pipe';

@NgModule({
  declarations: [
    JsonKeysPipe,
    FormControlPipe,
    FormGroupPipe,
    TextTransformPipe,
    AriaTransformPipe
  ],
  exports: [
    JsonKeysPipe,
    FormControlPipe,
    FormGroupPipe,
    TextTransformPipe,
    AriaTransformPipe
  ],
})
export class NgPipesModule {}



