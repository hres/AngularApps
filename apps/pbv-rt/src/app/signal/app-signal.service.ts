import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppSignalService {

  constructor() { }

  private readonly selectedDossierType = signal<string>(null);
  private readonly selectedRaLead = signal<string>(null);
  private readonly selectedRaType = signal<string>(null);
  private readonly selectedTxnDesc = signal<string>(null);

  getSelectedDossierType(): Signal<string>{
    return this.selectedDossierType.asReadonly();
  }

  setSelectedDossierType(selectedDossierType: string): void{
    this.selectedDossierType.set(selectedDossierType);
  }

  getSelectedRaLead(): Signal<string>{
    return this.selectedRaLead.asReadonly();
  }

  setSelectedRaLead(selectedRaLead: string): void{
    this.selectedRaLead.set(selectedRaLead);
  }

  getSelectedRaType(): Signal<string>{
    return this.selectedRaType.asReadonly();
  }

  setSelectedRaType(selectedRaType: string): void{
    this.selectedRaType.set(selectedRaType);
  }

  getSelectedTxnDesc(): Signal<string>{
    return this.selectedTxnDesc.asReadonly();
  }

  setSelectedTxnDesc(selectedTxnDesc: string): void{
    this.selectedTxnDesc.set(selectedTxnDesc);
  }
}
