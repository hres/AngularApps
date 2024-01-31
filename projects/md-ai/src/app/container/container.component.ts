import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalService } from '../global/global.service';
import { LayoutComponent, PrivacyStatementComponent, SecurityDisclaimerComponent } from '@hpfb/sdk/ui';
import { TranslateModule } from '@ngx-translate/core';
import { InstructionComponent } from '../instruction/instruction.component';
import { FormBaseComponent } from '../form-base/form-base.component';
import { FormDataLoaderService } from './form-data-loader.service';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { AppFormModule } from '../app.form.module';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [TranslateModule, LayoutComponent, PrivacyStatementComponent, SecurityDisclaimerComponent, InstructionComponent, FormBaseComponent, AppFormModule],
  templateUrl: './container.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [FormDataLoaderService],
})
export class ContainerComponent implements OnInit {

  language: string;
  isInternal: boolean;
  helpIndex: { [key: string]: number };
  devEnv: boolean = false;

  loadFormBaseComponent: boolean = false;

  dataSources: Observable<any>[] = [
    this._formDataLoader.getComplianceList(),
    this._formDataLoader.getDerivativeList(),
    this._formDataLoader.getDeviceClassesList(),
    this._formDataLoader.getDeviceSpeciesList(),
    this._formDataLoader.getDeviceTissueList(),
    this._formDataLoader.getRawDrugType(),
    this._formDataLoader.getLicenceAppTypeList(),
    this._formDataLoader.getMdAuditProgramList(),
    this._formDataLoader.getProvisionMdrList(),
    this._formDataLoader.getRegActivityTypeList(),
    this._formDataLoader.getYesNoList(),
    this._formDataLoader.getDiagnosisReasonList()
  ];


  constructor(private _globalService: GlobalService, private _formDataLoader: FormDataLoaderService) {}

  ngOnInit(): void {
    this.language = this._globalService.getCurrLanguage();
    this.helpIndex = this._globalService.getHelpIndex();
    this.devEnv = this._globalService.$devEnv;

    // Use forkJoin to wait for all API calls to complete
    forkJoin(this.dataSources).subscribe((data) => {
      console.log(data);
      this._globalService.$complianceList = data[0];
      this._globalService.$derivateList = data[1];
      this._globalService.$deviceClassesList = data[2];
      this._globalService.$deviceSpeciesList = data[3];
      this._globalService.$deviceTissueList = data[4];
      this._globalService.$rawDrugTypeList = data[5];
      this._globalService.$licenceAppTypeList = data[6];
      this._globalService.$mdAuditProgramList = data[7];
      this._globalService.$provisionMDRList = data[8];
      this._globalService.$regActivityTypeList = data[9];
      this._globalService.$yesNoList = data[10];
      this._globalService.$diagnosisReasonList = data[11];

      this.loadFormBaseComponent = true;
    });
  }

}