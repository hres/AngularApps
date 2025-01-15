import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { LoggerService } from '@hpfb/sdk/ui';
import { ENROLMENT_STATUS } from '../app.constants';
import { GlobalService } from '../global/global.service';

@Injectable()
export class AppSignalService {

  private _logger = inject(LoggerService)
  private _globalService = inject(GlobalService)

  constructor() { }

  private readonly enrolmentStatus = signal<string>(null);
  private readonly isInternal = signal<boolean>(null);

  isNEW(): Signal<boolean>{
    return computed(() => {
      return this.getEnrolmentStatus()() === ENROLMENT_STATUS.NEW;
    });
  }

  isAMEND(): Signal<boolean>{
    return computed(() => {
      return this.getEnrolmentStatus()() === ENROLMENT_STATUS.AMEND;
    });
  }

  isFINAL(): Signal<boolean>{
    return computed(() => {
      return this.getEnrolmentStatus()() === ENROLMENT_STATUS.FINAL;
    });
  }

  getEnrolmentStatus(): Signal<string>{
    return this.enrolmentStatus.asReadonly();
  }

  setEnrolmentStatus(status: string): void {
    this._logger.log(this._globalService.debugEnabled, 'AppSignalService', 'setEnrolmentStatus', `to ${status}`)
    this.enrolmentStatus.set(status);
  }

  getIsInternal(): Signal<boolean>{
    return this.isInternal.asReadonly();
  }

  setIsInternal(flag : boolean) {
    this._logger.log(this._globalService.debugEnabled, 'AppSignalService', 'setIsInternal', `to ${flag}`)
    this.isInternal.set(flag);
  }

}
