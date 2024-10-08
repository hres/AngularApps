import { computed, Injectable, Signal, signal } from '@angular/core';
import { DOSSIER_TYPE } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class AppSignalService {

  private readonly selectedDossierType = signal<string>(null)

  getSelectedDossierType(): Signal<string>{
    return this.selectedDossierType.asReadonly();
  }

  setSelectedDossierType(selectedDossierType: string): void{
    this.selectedDossierType.set(selectedDossierType);
  }

  constructor() { }
}
