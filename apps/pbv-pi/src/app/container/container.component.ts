import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  ];

  constructor(private _globalService: GlobalService, private _formDataLoader: FormDataLoaderService) {}

  ngOnInit(): void {
    this.language = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    this.devEnv = this._globalService.devEnv;

    forkJoin(this.dataSources).subscribe((data) => {
      // console.log(data);
      this._globalService.countryList = data[0];
      this._globalService.dossierTypes = data[1]
      this._globalService.yesnoList = data[2];

      this.loadFormBaseComponent = true;
    });
  }

}
