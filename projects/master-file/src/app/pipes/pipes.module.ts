import { NgModule } from '@angular/core';

import { FormControlPipe } from './form/form-control.pipe';
import { JsonKeysPipe } from './json/json-keys.pipe';
import { FormGroupPipe } from './form/form-group.pipe';
import { TextTransformPipe } from './text/text-transform.pipe';

@NgModule({
  declarations: [
    JsonKeysPipe,
    FormControlPipe,
    FormGroupPipe,
    TextTransformPipe
  ],
  exports: [
    JsonKeysPipe,
    FormControlPipe,
    FormGroupPipe,
    TextTransformPipe
  ],
})
export class NgPipesModule {}



