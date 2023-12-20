import { Injectable } from '@angular/core';
import { ValidationService } from '../validation/validation.service';

@Injectable()
export class ErrMessageService {

  constructor(){}

  getValidatorErrorMessageKey(error: string){
    // get the error message key in the en/fr.json for this error
    return ValidationService.getValidatorErrorMessage(error);
  }

}
