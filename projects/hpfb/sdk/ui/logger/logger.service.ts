import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {
  
  log(className: string, methodName: string, ...messages: any[]) {
    console.log(className + '-> ' + methodName + '->', messages.join(', '));
  }

  error(className: string, methodName: string, ...messages: any[]) {
    console.error(className + '-> ' + methodName + '->', messages.join(', '));
  }

  warn(className: string, methodName: string, ...messages: any[]) {
    console.warn(className + '-> ' + methodName + '->', messages.join(', '));
  }
}
