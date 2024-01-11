import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalService } from '../global/global.service';
import { LayoutComponent, PrivacyStatementComponent, SecurityDisclaimerComponent} from '@hpfb/sdk/ui';
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
  providers: [FormDataLoaderService],
  templateUrl: './container.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class ContainerComponent implements OnInit {
  language: string;
  isInternal: boolean;
  helpIndex: { [key: string]: number };
  devEnv: boolean = false;

  loadFormBaseComponent: boolean = false;

  dataSources: Observable<any>[] = [
    this._formDataLoader.getDeviceClassesList(),
    this._formDataLoader.getRegulatoryActivityTypesList(),
  ];

  constructor(private _globalService: GlobalService, private _formDataLoader: FormDataLoaderService) {}

  ngOnInit(): void {
    this.language = this._globalService.getCurrLanguage();
    this.helpIndex = this._globalService.getHelpIndex();
    this.devEnv = this._globalService.$devEnv;

    // Use forkJoin to wait for all API calls to complete
    forkJoin(this.dataSources).subscribe((data) => {
        console.log(data);
        this._globalService.$deviceClasseList = data[0];
        this._globalService.$RegulatoryActivityTypesList = data[1];

        this.loadFormBaseComponent = true;
      });
  }
}