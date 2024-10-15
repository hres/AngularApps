import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalService } from '../global/global.service';
import { HelpIndex, LayoutComponent, PrivacyStatementComponent, SecurityDisclaimerComponent } from '@hpfb/sdk/ui';
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
  helpIndex: HelpIndex;
  devEnv: boolean = false;
  loadFormBaseComponent: boolean = false;

  dataSources: Observable<any>[] = [
    this._formDataLoader.getCountryList(this._globalService.currLanguage),
    this._formDataLoader.getProvinceList(this._globalService.currLanguage),
    this._formDataLoader.getStateList(this._globalService.currLanguage),
    this._formDataLoader.getDossierTypes(),
    this._formDataLoader.getRaLeads(),
    this._formDataLoader.getRaTypes(),
    this._formDataLoader.getTransactionDescriptions(),
    this._formDataLoader.getDossierTypeAndRaLeads(),
    this._formDataLoader.getRaLeadAndRaTypes(),
    this._formDataLoader.getDossierTypeRaTypeAndTransactionDescriptions(),
    this._formDataLoader.getYesNoList(),
    this._formDataLoader.getAdminSubTypes(this._globalService.currLanguage),
    this._formDataLoader.getSubmissionClasses()
  ];

  constructor(private _globalService: GlobalService, private _formDataLoader: FormDataLoaderService) {}

  ngOnInit(): void {
    this.language = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    this.devEnv = this._globalService.devEnv;

    forkJoin(this.dataSources).subscribe((data) => {
      // console.log(data);
      this._globalService.countryList = data[0];
      this._globalService.provinceList = data[1];
      this._globalService.stateList = data[2];
      this._globalService.dossierTypes = data[3];
      this._globalService.raLeads = data[4];
      this._globalService.raTypes = data[5];
      this._globalService.transactionDescriptions = data[6];
      this._globalService.dossierTypeAndRaLeadsRelationship = data[7];
      this._globalService.raLeadAndRaTypesRelationship = data[8];
      this._globalService.dossierTypeRaTypeAndTransactionDescriptionsRelationship = data[9];
      this._globalService.yesnoList = data[10];
      this._globalService.adminSubTypes = data[11];
      this._globalService.submissionClasses = data[12];

      this.loadFormBaseComponent = true;
    });
  }

}
