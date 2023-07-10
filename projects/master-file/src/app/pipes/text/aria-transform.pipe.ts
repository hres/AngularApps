import { Pipe, PipeTransform } from '@angular/core';
import { GlobalsService } from '../../globals/globals.service';
import { ICodeAria } from '../../shared/data';

// take an ICode value and return either en or fr value based on lang

@Pipe({
  name: 'ariaTransform'
})
export class AriaTransformPipe implements PipeTransform {

  transform(value: ICodeAria, lang: string): unknown {
    return GlobalsService.isFrench(lang) ? value.ariaFr : value.ariaEn;
  }

}
