// ref: https://stackoverflow.com/questions/67834802/template-error-type-abstractcontrol-is-not-assignable-to-type-formcontrol

import {Pipe, PipeTransform} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';

@Pipe({
    name: 'formControl',
})
export class FormControlPipe implements PipeTransform {
    transform(value: AbstractControl): FormControl {
        return value as FormControl;
    }
}