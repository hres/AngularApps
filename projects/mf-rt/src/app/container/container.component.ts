import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalService } from '../global/global.service';
import { HelpIndex, LayoutComponent, PrivacyStatementComponent, SecurityDisclaimerComponent } from '@hpfb/sdk/ui';
import { TranslateModule } from '@ngx-translate/core';
import { InstructionComponent } from '../instruction/instruction.component';
import { FormBaseComponent } from '../form-base/form-base.component';
import { CommonModule } from '@angular/common';
import { FormDataLoaderService } from './form-data-loader.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [CommonModule, TranslateModule, LayoutComponent, PrivacyStatementComponent, SecurityDisclaimerComponent, InstructionComponent, FormBaseComponent],
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
    this._formDataLoader.getCountriesList(),
    this._formDataLoader.getYesNoList(),
    this._formDataLoader.getMasterFileTypes(),
    this._formDataLoader.getMasterFileUses(),
    this._formDataLoader.getTxDescriptions(),
    this._formDataLoader.getMasterFileTypeAndTransactionDescription(),
    this._formDataLoader.getMasterFileRevisedTypeAndTransactionDescription()
  ];

  constructor(private _globalService: GlobalService, private _formDataLoader: FormDataLoaderService) {}

  ngOnInit(): void {
    this.language = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    this.devEnv = this._globalService.devEnv;
    
    forkJoin(this.dataSources).subscribe((data) => {
      console.log(data);
      this._globalService.countriesList = data[0];
      this._globalService.yesnoList = data[1];
      this._globalService.mfTypes = data[2];
      this._globalService.mfUses = data[3];
      this._globalService.txDescs = data[4];
      this._globalService.mfTypeTxDescs = data[5];
      this._globalService.mfRevisedTypeDescs = data[6];

      this.loadFormBaseComponent = true;
    });
  }
  
}