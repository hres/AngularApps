import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { LoggerService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { DOSSIER_TYPE } from '../app.constants';

@Injectable()
export class AppSignalService {

  private _logger = inject(LoggerService)
  private _globalService = inject(GlobalService)

  constructor() { }
  
  private readonly selectedDossierType = signal<string>(null);
  private readonly selectedRaLead = signal<string>(null);
  private readonly selectedRaType = signal<string>(null);
  private readonly selectedTxnDesc = signal<string>(null);
  private readonly mitigationType = signal<string>(null);

  isPharmaBio(): Signal<boolean>{
    return computed(() => {
      return this.getSelectedDossierType()() === DOSSIER_TYPE.PHARMACEUTICAL_HUMAN || this.getSelectedDossierType()() === DOSSIER_TYPE.BIOLOGIC_HUMAN;
    });
  }

  isPharmaBioVet(): Signal<boolean>{
    return computed(() => {
      return this.getSelectedDossierType()() === DOSSIER_TYPE.PHARMACEUTICAL_HUMAN || this.getSelectedDossierType()() === DOSSIER_TYPE.BIOLOGIC_HUMAN || this.getSelectedDossierType()() === DOSSIER_TYPE.VETERINARY;
    });
  }

  getSelectedDossierType(): Signal<string>{
    return this.selectedDossierType.asReadonly();
  }

  setSelectedDossierType(selectedDossierType: string): void{
    this._logger.log(this._globalService.debugEnabled, 'AppSignalService', 'setSelectedDossierType', `to ${selectedDossierType}`)
    this.selectedDossierType.set(selectedDossierType);
  }

  getSelectedRaLead(): Signal<string>{ 
    return this.selectedRaLead.asReadonly();
  }

  setSelectedRaLead(selectedRaLead: string): void{
   this._logger.log(this._globalService.debugEnabled, 'AppSignalService', 'setSelectedRaLead', `to ${selectedRaLead}`)
    this.selectedRaLead.set(selectedRaLead);
  }

  getSelectedRaType(): Signal<string>{
    return this.selectedRaType.asReadonly();
  }

  setSelectedRaType(selectedRaType: string): void{
   this._logger.log(this._globalService.debugEnabled, 'AppSignalService', 'setSelectedRaType', `to ${selectedRaType}`)
    this.selectedRaType.set(selectedRaType);
  }

  getSelectedTxnDesc(): Signal<string>{
    return this.selectedTxnDesc.asReadonly();
  }

  setSelectedTxnDesc(selectedTxnDesc: string): void{
   this._logger.log(this._globalService.debugEnabled, 'AppSignalService', 'setSelectedTxnDesc', `to ${selectedTxnDesc}`)
    this.selectedTxnDesc.set(selectedTxnDesc);
  }

  getMitigationType(): Signal<string>{
    return this.mitigationType.asReadonly();
  }

  setMitigationType(mitigationType: string): void{
    this.mitigationType.set(mitigationType);
  }
}
