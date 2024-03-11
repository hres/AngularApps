import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalService } from '../global/global.service';
import { LayoutComponent, PrivacyStatementComponent, SecurityDisclaimerComponent} from '@hpfb/sdk/ui';
import { TranslateModule } from '@ngx-translate/core';
import { InstructionComponent } from '../instruction/instruction.component';
import { FormBaseComponent } from '../form-base/form-base.component';
import { FormDataLoaderService } from './form-data-loader.service';
import { Observable, catchError, combineLatest, forkJoin, map, of, switchMap } from 'rxjs';
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
    this._formDataLoader.getAmendReasonList(),
    this._formDataLoader.getAmendReasonRelationship(),
    this._formDataLoader.getTransactionDescriptionList(),
    this._formDataLoader.getYesNoList(),
  ];

  constructor(private _globalService: GlobalService, private _formDataLoader: FormDataLoaderService) {}

  ngOnInit(): void {
    this.language = this._globalService.getCurrLanguage();
    this.helpIndex = this._globalService.getHelpIndex();
    this.devEnv = this._globalService.$devEnv;

    // load data from apis
    combineLatest([
      // merge these two apis' returned data
      this._formDataLoader.getActivityTypeAndTransactionDescription(),
      this._formDataLoader.getTransactionDescriptionList(),
    ])
      .pipe(
        // use map will create nested observable
        // use switchMap in this manner to ensure that the result from the inner observable (created by forkJoin) is directly passed to the outer observable, avoiding unnecessary nesting
        switchMap(([acTypeTxDesc, txDesc]) => {
          const combinedData = this.combineData(acTypeTxDesc, txDesc);

          return forkJoin(this.dataSources).pipe(
            map(([deviceClasses, activityTypes, amendReasons, amendReasonRelationship, txDesciption, yesno]) => {
              // Return the combinedData from the first two API calls and the data from the other API calls
              return {
                deviceClasses,
                activityTypes,
                amendReasons,
                amendReasonRelationship,
                txDesciption,
                yesno,
                combinedData,
              };
            })
          );
        })
      )
      .subscribe((result) => {
        console.log(result);
        this._globalService.$deviceClasseList = result['deviceClasses'];
        this._globalService.$activityTypeList = result['activityTypes'];
        this._globalService.$amendReasonList = result['amendReasons'];
        this._globalService.$amendReasonRelationship = result['amendReasonRelationship'];
        this._globalService.$transactionDescriptionList = result['txDesciption'];
        this._globalService.$yesnoList = result['yesno'];
        this._globalService.$activityTypeTxDescription = result['combinedData'];

        this.loadFormBaseComponent = true;
      });

  }

  /*
  arr1:  [{"raTypeId": "B02-20160301-033","txDescIds": ["INITIAL","UD"]}, ...]
  arr2: [{"id": "INITIAL","en": "Initial","fr": "Initiale"}, ...]

  returns:[
	{
		"parentId": "B02-20160301-033",
		"children": [
			{
				"id": "INITIAL",
				"en": "Initial",
				"fr": "Initiale"
			},
			{
				"id": "UD",
				"en": "Unsolicited Information",
				"fr": "Renseignements non sollicités"
			}
		]
	}, ...]
 
  */
  private combineData(arr1: any[], arr2: any[]): any[] {
    // console.log(arr1, arr2);

    const combinedData = arr1.map((item) => ({
      parentId: item.raTypeId,
      children: arr2.filter((x) => {
        return item.txDescIds.includes(x.id);
      }),
    }));

    return combinedData;
  }

}
