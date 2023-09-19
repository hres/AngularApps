import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { ICode } from '../data-loader/data';

// take an ICode value and return either en or fr value based on lang

@Pipe({
  name: 'textTransform'
})
export class TextTransformPipe implements PipeTransform {

  transform(value: ICode, lang: string): unknown {
    return UtilsService.isFrench(lang) ? value.fr : value.en;
  }

}
