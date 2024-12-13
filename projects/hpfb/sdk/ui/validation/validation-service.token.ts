import { InjectionToken } from '@angular/core';
import { IValidationService } from './validation-service.interface';

export const VALIDATION_SERVICES = new InjectionToken<IValidationService[]>(
  'VALIDATION_SERVICES'
);