import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { LoggerService } from '@hpfb/sdk/ui';
import { ENROLMENT_STATUS } from '../app.constants';
import { GlobalService } from '../global/global.service';

@Injectable()
export class AppSignalService {

  private _logger = inject(LoggerService)
  private _globalService = inject(GlobalService)

  constructor() { }

  private readonly contactCompanyRoles = signal<string[]>([]);
  private readonly addressCompanyRoles = signal<string[]>([]);

  updateContactCompanyRoles(companyRole: string): void {
    this.contactCompanyRoles.update((arr) => {
      return [...arr, companyRole];
    });
  }

  removeContactCompanyRole(companyRole: string) {
    this.contactCompanyRoles.update((arr) => arr.filter(item => item !== companyRole));
  }

  getSelectedContactCompanyRoles(): Signal<string[]> {
    return this.contactCompanyRoles.asReadonly();
  }

  updateAddressCompanyRoles(companyRole: string): void {
    this.addressCompanyRoles.update((arr) => {
      return [...arr, companyRole];
    });
  }

  removeAddressCompanyRole(companyRole: string) {
    this.addressCompanyRoles.update((arr) => arr.filter(item => item !== companyRole));
  }

  getSelectedAddressCompanyRoles(): Signal<string[]> {
    return this.addressCompanyRoles.asReadonly();
  }

  private readonly productLines = signal<string[]>([]);

  updateProductLine(productLine : string) : void {
    this.productLines.update((arr) => [...arr, productLine]);
  }

  removeProductLine(productLine: string) {
    this.productLines.update((arr) => arr.filter(item => item !== productLine));
  }

  getSelectedProductLines(): Signal<string[]> {
    return this.productLines.asReadonly();
  }

}
