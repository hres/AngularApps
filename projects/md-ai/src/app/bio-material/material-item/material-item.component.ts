import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, Output, OnInit, QueryList, ViewChildren, effect, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlMessagesComponent, ErrorModule, ErrorSummaryComponent, ICode, PipesModule, UtilsService } from '@hpfb/sdk/ui';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from '../../global/global.service';
import { TISSUE_OTHER_ID, DERIVATIVE_OTHER_ID } from '../../app.constants';
import { MaterialListComponent } from '../material-list/material-list.component';
import { ErrorNotificationService } from '@hpfb/sdk/ui/error-msg/error.notification.service';

@Component({
  selector: 'app-material-item',
  templateUrl: './material-item.component.html',
  encapsulation: ViewEncapsulation.None
})

export class MaterialItemComponent implements OnInit, AfterViewInit {
  @Input() cRRow: FormGroup;
  @Input() j: number;

  lang = this._globalService.lang();

  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() error = new EventEmitter(true);

  public countries: ICode[] = [];
  public specFamList: ICode[] = [];
  public tissueTypeList: ICode[] = [];
  public derivativeList: ICode[] = [];

  public isTissueTypeOther = false;
  public isDerivativeOther = false;

  showErrors: boolean;
  showErrSummary: boolean = false;
  public errorList = [];
  private errorSummaryChild: ErrorSummaryComponent = null;

  public headingLevel = 'h4';
  headingPreamble: string = "heading.biological.material";
  headingPreambleParams: any;
  translatedParentLabel: string;

  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;

  constructor(private _globalService: GlobalService, 
              private _utilsService: UtilsService, 
              private _translateService: TranslateService, 
              private _materialListComponent : MaterialListComponent,
              private _errorNotificationService : ErrorNotificationService){

    effect(() => {
      this.showErrors = this._globalService.showErrors()
      if (this._globalService.showErrors()) {
        this._updateErrorList(this.msgList);
      }
    });
  }

  async ngOnInit() {
    this.countries = this._globalService.$countryList;
    this.specFamList = this._globalService.$deviceSpeciesList;
    this.tissueTypeList = this._globalService.$deviceTissueList;
    this.derivativeList = this._globalService.$derivateList;

    this.headingPreambleParams = this.j+1;
    this.translatedParentLabel = this._translateService.instant(this.headingPreamble, {seqnumber: this.headingPreambleParams});
  }

  ngAfterViewInit(): void {
    this._updateErrorList(this.msgList);

    this.msgList.changes.subscribe(errorObjs => {
      this._updateErrorList(this.msgList);
    });
    /** this is processsing the errorSummary that is a child in  Contact record **/
    this.errorSummaryChildList.changes.subscribe(list => {
      console.log("error summary child change,", list);
      this.processSummaries(list);
    });
  }

  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Contact List found >1 Error Summary ' + list.length);
    }
    this.errorSummaryChild = list.first;
    // notify subscriber(s) that contact records' error summaries are changed
    this._errorNotificationService.updateErrorSummary(this.cRRow.get('id').value, this.errorSummaryChild);
 
    // this._emitErrors();
  }

  private _updateErrorList(errorObjs) {
    const temp = [];
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
    }
    this.errorList = temp;
    this.error.emit(temp);
  }

  public revertMaterialRecord(index: number, recordId: number): void {
    this.revertRecord.emit({ index: index, id: recordId });
    this.cRRow.markAsPristine();
  }

  public deleteMaterialRecord(index: number): void {
    this.errorSummaryChild = null;
    this.deleteRecord.emit(index);
    this.cRRow.markAsPristine();
    this._updateErrorList([]);
  }


  public saveMaterialRecord(index: number): void {
    this._save(index);
  }

  private _save(index: number): void {
    if (this.cRRow.valid) {
      this.saveRecord.emit({ index: index });
      this.cRRow.markAsPristine();
    } else {
      this.showErrSummary = true;
      this.showErrors = true;
    }
  } 

  /**
   * This method is to make the field more reactive when selecting "Other"
   */
  onTissueTypeSelected(e : any) {
    const selectedTissueType = e.target.value;
    const tissueTypeDetails = this.cRRow.get('materialInfo.tissueTypeOtherDetails');

    if (selectedTissueType) {
      if (selectedTissueType === TISSUE_OTHER_ID) {
        this.isTissueTypeOther = true;
      } else {
        this.isTissueTypeOther = false;
        // Reset tissue type details
        this._utilsService.resetControlsValues(tissueTypeDetails)
      }
    }
  }

  /**
   * This method ensures that the other details field is shown when control value is "Other" 
   */
  tissueTypeOther() {
    const tissueTypeDetails = this.cRRow.get('materialInfo.tissueTypeOtherDetails');
    const tissueType = this.cRRow.get('materialInfo.tissueType').value;

    if (tissueType) {
      if (tissueType === TISSUE_OTHER_ID) {
        return true;
      } else {
        // Reset tissue type details
        this._utilsService.resetControlsValues(tissueTypeDetails)
      }
    }
    return false;
  }

  onDerivativeSelected(e : any) {
    const selectedDerivative = e.target.value;
    const derivativeDetails = this.cRRow.get('materialInfo.derivativeOtherDetails');
    if (selectedDerivative) {
      if (selectedDerivative === DERIVATIVE_OTHER_ID) {
        this.isDerivativeOther = true;
      } else {
        this.isDerivativeOther = false;
        // Reset derivate details
        this._utilsService.resetControlsValues(derivativeDetails);
      }
    }
  }

  derivativeOther() {
    const derivativeDetails = this.cRRow.get('materialInfo.derivativeOtherDetails');
    const derivative = this.cRRow.get('materialInfo.derivative').value;

    if (derivative) {
      if (derivative === DERIVATIVE_OTHER_ID) {
        return true;
      } else {
        // Reset tissue type details
        this._utilsService.resetControlsValues(derivativeDetails)
      }
    }
    return false;
  }


  typed(rec) {
    // this._loggerService.log('address.detail', 'country is typed');
    let content = rec.toString().replace(/[\x00-\x7F]/g, '', '');
    if (content && this.existsInList(content)) {
      this.cRRow.get('materialInfo.originCountry').setValue([content]);
    }
  }

  tempCountryOnChange(rec) {
    // this._loggerService.log('address.detail', 'country is tempCountryOnblur');
    this.typed(rec)
  }

  existsInList(rec) {
    for (let country of this.countries) {
      if (country.id === rec) {
        return true;
      }
    }
    return false;
  }

  public disabledDiscardButton() {
    if (this.cRRow.get('isNew').value) {
      return true;
    }
    return false;
  }

  public showErrorSummary(): boolean {
    return (this.showErrSummary && this.errorList.length > 0);
  }
 
}