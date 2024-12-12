import { Inject, Injectable } from '@angular/core';
import { IValidationService } from '../validation/validation-service.interface';
import { VALIDATION_SERVICES } from '../validation/validation-service.token';

@Injectable()
export class ErrMessageService {

  constructor(
    @Inject(VALIDATION_SERVICES) private validationServices: IValidationService[]
  ) {}

  getValidatorErrorMessageKey(validatorName: string): string | null {
    for (const service of this.validationServices) {
      // get the error message key in the en/fr.json for this errorz
      const messageKey = service.getValidatorErrorMessage(validatorName);
      if (messageKey) return messageKey; // Return the first matching key
    }
    return null; // Default to null if no match is found
  }
}
