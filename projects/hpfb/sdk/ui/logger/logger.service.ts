import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {

  log(debugEnabled: boolean, className: string, methodName: string, ...messages: any[]) {
    if (debugEnabled) {
      console.log(`${className} -> ${methodName} ->`, ...this.formatMessages(messages));
    }
  }

  error(debugEnabled: boolean, className: string, methodName: string, ...messages: any[]) {
    if (debugEnabled) {
      console.error(`${className} -> ${methodName} ->`, ...this.formatMessages(messages));
    }
  }

  warn(debugEnabled: boolean, className: string, methodName: string, ...messages: any[]) {
    if (debugEnabled) {
      console.warn(`${className} -> ${methodName} ->`, ...this.formatMessages(messages));
    }
  }

  private formatMessages(messages: any[]): any[] {
    return messages.map(msg => 
      typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg
    );
  }
}
