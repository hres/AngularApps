import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, Output, OnInit, QueryList, ViewChildren, effect, ViewEncapsulation, SimpleChange, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlMessagesComponent, ErrorModule, ErrorSummaryComponent, ICode, PipesModule, UtilsService } from '@hpfb/sdk/ui';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from '../../global/global.service';
import { TISSUE_OTHER_ID, DERIVATIVE_OTHER_ID, MATERIAL_ERROR_PREFIX } from '../../app.constants';
import { MaterialListComponent } from '../material-list/material-list.component';
import { ErrorNotificationService } from '@hpfb/sdk/ui/error-msg/error.notification.service';
import { MaterialService } from '../material.service';

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
              private _errNotifService : ErrorNotificationService,
              private _materialService : MaterialService){

    effect(() => {
      //this._materialService.showMaterialErrorSummary() && 
      if (this._materialService.showMaterialErrorSummaryOneRec()) {
      this.showErrors = this._globalService.showErrors()
      this.showErrSummary = this.showErrors;

        if (this._globalService.showErrors()) {
          this._updateErrorList(this.msgList);
        }
      }
    
    });
  }

  ngOnChanges(changes : SimpleChanges) {
    this.onDerivativeSelected(null);
    this.onTissueTypeSelected(null);
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
      //console.log("error summary child change,", list);
      this.processSummaries(list);
    });
  }

  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Material List found >1 Error Summary ' + list.length);
    }
    this.errorSummaryChild = list.first;
    // notify subscriber(s) that contact records' error summaries are changed
    this._errNotifService.updateErrorSummary(MATERIAL_ERROR_PREFIX + this.cRRow.get('id').value, this.errorSummaryChild);
 
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
    this.onDerivativeSelected(null);
    this.onTissueTypeSelected(null);
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
    let selectedTissueType;
    if (e) {
      selectedTissueType = e.target.value;
    } else {
      selectedTissueType = this.cRRow.get('materialInfo.tissueType').value;
    }
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

  onDerivativeSelected(e : any) {
    let selectedDerivative;
    if (e) {
      selectedDerivative = e.target.value;
    } else {
      selectedDerivative = this.cRRow.get('materialInfo.derivative').value;
    }
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