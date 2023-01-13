import { NgModule } from '@angular/core';

import { FormControlPipe } from './form/form-control.pipe';
import { JsonKeysPipe } from './json/json-keys.pipe';
import { FormGroupPipe } from './form/form-group.pipe';

@NgModule({
  declarations: [
    JsonKeysPipe,
    FormControlPipe,
    FormGroupPipe
  ],
  exports: [
    JsonKeysPipe,
    FormControlPipe,
    FormGroupPipe
  ],
})
export class NgPipesModule {}



