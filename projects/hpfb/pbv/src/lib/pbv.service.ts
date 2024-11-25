import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PbvService {

  constructor() { }

  static pharmabioDossierIdValidator(control) {
    if (!control.value) {
      return null;
    }
    if (control.value.match(/^[a-z]{1}[0-9]{6}$/)) {
      return null;
    } else {
      return {'error.mgs.dossier.id': true};
    }
  }
}
