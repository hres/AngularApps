import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { ICodeAria } from '../data-loader/data';

// take an ICodeAria value and return either en or fr value based on lang

@Pipe({
  name: 'ariaTransform'
})
export class AriaTransformPipe implements PipeTransform {

  transform(value: ICodeAria, lang: string): unknown {
    return UtilsService.isFrench(lang) ? value.ariaFr : value.ariaEn;
  }

}
