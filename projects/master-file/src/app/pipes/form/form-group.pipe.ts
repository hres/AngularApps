import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'formGroup'
})
export class FormGroupPipe implements PipeTransform {

    transform(value: AbstractControl): FormGroup {
        return value as FormGroup;
    }
}