import { inject, Injectable, Signal, signal } from '@angular/core';
import { LoggerService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';

@Injectable()
export class AppSignalService {

  private _logger = inject(LoggerService)
  private _globalService = inject(GlobalService)

  constructor() { }

}
