import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { LoggerService } from '@hpfb/sdk/ui';
import { ENROLMENT_STATUS } from '../app.constants';
import { GlobalService } from '../global/global.service';

@Injectable()
export class AppSignalService {

  private _logger = inject(LoggerService)
  private _globalService = inject(GlobalService)

  constructor() { }

  private readonly isInternal = signal<boolean>(null);

  getIsInternal(): Signal<boolean>{
    return this.isInternal.asReadonly();
  }

  setIsInternal(flag : boolean) {
    this._logger.log(this._globalService.debugEnabled, 'AppSignalService', 'setIsInternal', `to ${flag}`)
    this.isInternal.set(flag);
  }

}
