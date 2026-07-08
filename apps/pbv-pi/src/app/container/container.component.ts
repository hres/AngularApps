import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalService } from '../global/global.service';
import { HelpSequence, LayoutComponent, SecurityDisclaimerComponent } from '@hpfb/sdk/ui';
import { PrivacyStatementComponent } from '@hpfb/pbv';
import { TranslateModule } from '@ngx-translate/core';
import { InstructionComponent } from '../instruction/instruction.component';
import { FormBaseComponent } from '../form-base/form-base.component';
import { CommonModule } from '@angular/common';
import { FormDataLoaderService } from './form-data-loader.service';
import { Observable, forkJoin } from 'rxjs';
import { AppFormModule } from '../app.form.module';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [CommonModule, TranslateModule, LayoutComponent, PrivacyStatementComponent, SecurityDisclaimerComponent, InstructionComponent, FormBaseComponent, AppFormModule],
  providers: [FormDataLoaderService],
  templateUrl: './container.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ContainerComponent implements OnInit {

  language: string;
  helpIndex: HelpSequence;
  devEnv: boolean = false;
  loadFormBaseComponent: boolean = false;

  dataSources: Observable<any>[] = [
    this._formDataLoader.getCountryList(this._globalService.currLanguage),
    this._formDataLoader.getDossierTypes(),
    this._formDataLoader.getYesNoList(),
    this._formDataLoader.getSubTypes(this._globalService.currLanguage),
    this._formDataLoader.getYesNoList(),
    this._formDataLoader.getDrugUses(),
    this._formDataLoader.getScheduleClaims(),
    this._formDataLoader.getDisinfectantTypes(),
    this._formDataLoader.getVetSpecies(),
    this._formDataLoader.getSubTypesSpecy(),
    this._formDataLoader.getNanomaterials(),
    this._formDataLoader.getOperators(),
    this._formDataLoader.getPer(),
    this._formDataLoader.getRoles(),
    this._formDataLoader.getUnits(),
    this._formDataLoader.getCalculatedBase(),
    this._formDataLoader.getUnitMeasure(),
    this._formDataLoader.getUnitPresentation(),
    this._formDataLoader.getDosageForms()
  ];

  constructor(private _globalService: GlobalService, private _formDataLoader: FormDataLoaderService, private _cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.language = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    this.devEnv = this._globalService.devEnv;

    forkJoin(this.dataSources).subscribe((data) => {
      // console.log(data);
      this._globalService.countryList = data[0];
      this._globalService.dossierTypes = data[1]
      this._globalService.yesnoList = data[2];
      this._globalService.subTypeList = data[3];
      this._globalService.drugUse = data[5];
      this._globalService.scheduleClaims = data[6];
      this._globalService.disinfectTypes = data[7];
      this._globalService.vetSpecies = data[8];
      this._globalService.specySubTypes = data[9];
      this._globalService.nanomaterialList = data[8];
      this._globalService.operatorList = data[9];
      this._globalService.perList = data[10];
      this._globalService.rolesList = data[11];
      this._globalService.unitsList = data[12];
      this._globalService.calculatedBaseList = data[13];
      this._globalService.unitMeasureList = data[14];
      this._globalService.unitPresentationList = data[15];
      this._globalService.dosageFormList = data[16];
      this.loadFormBaseComponent = true;
      this._cdr.detectChanges();
    });
  }

}