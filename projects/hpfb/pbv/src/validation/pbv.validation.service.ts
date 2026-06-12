import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PbvValidationService {

  constructor() { }

  getValidatorErrorMessage(validatorName: string): string | null {
    const config = {
      'error.mgs.pbv.dossier.id': 'error.mgs.dossier.id',
      'error.msg.roleSelected':'error.msg.roleSelected',
      'error.msg.business':'error.msg.business',
    };

    return config[validatorName] ?? validatorName;
  }

  static pharmabioDossierIdValidator(control) {
    if (!control.value) {
      return null;
    }
    if (control.value.match(/^['e','p','d']{1}[0-9]{6}$/)) {
      return null;
    } else {
      return {'error.mgs.pbv.dossier.id': true};
    }
  }

  static vetDossierIdValidator(control) {
    if (!control.value) {
      return null;
    }
    if (control.value.match(/^['v']{1}[0-9]{6}$/)) {
      return null;
    } else {
      return {'error.mgs.pbv.dossier.id': true};
    }
  }

  static dossierIdValidator(control) {
    if (!control.value) {
      return null;
    }
    if (control.value.match(/^['e','p','d','v']{1}[0-9]{6}$/)) {
      return null;
    } else {
      return {'error.mgs.pbv.dossier.id': true};
    }
  }

  static businessNumValidator(control) {
    if (!control.value) {
      return null;
    }
    if (control.value.match(/^[0-9]{9}$/)) {
      return null;
    } else {
      return {'error.msg.business': true};
    }
  }
}
