import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {
  
  log(className: string, methodName: string, ...messages: any[]) {
    console.log(className + '-> ' + methodName + '->', messages.join(', '));
  }

  error(className: string, message: any) {
    console.error(className + '-> ', message);
  }

  warn(className: string, message: any) {
    console.warn(className + '-> ', message);
  }
}
