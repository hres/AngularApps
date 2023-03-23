import { Pipe, PipeTransform } from '@angular/core';
import { GlobalsService } from '../../globals/globals.service';
import { ICode } from '../../shared/data';

// take an ICode value and return either en or fr value based on lang

@Pipe({
  name: 'textTransform'
})
export class TextTransformPipe implements PipeTransform {

  transform(value: ICode, lang: string): unknown {
    console.log("TextTransformPipe ~ transform ~ lang:", lang);
    return GlobalsService.isFrench(lang) ? value.fr : value.en;
  }

}
