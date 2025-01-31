import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { LoggerService } from '@hpfb/sdk/ui';
import { ENROLMENT_STATUS } from '../app.constants';
import { GlobalService } from '../global/global.service';

@Injectable()
export class AppSignalService {

  private _logger = inject(LoggerService)
  private _globalService = inject(GlobalService)

  constructor() { }

  private readonly companyRoles = signal<string[]>([]);

  updateCompanyRoles(companyRole : string) : void {
    this.companyRoles.update((arr) => [...arr, companyRole]);
  }

  removeCompanyRole(companyRole: string) {
    this.companyRoles.update((arr) => arr.filter(item => item !== companyRole));
  }

  getSelectedCompanyRoles(): Signal<string[]> {
    return this.companyRoles.asReadonly();
  }

}
