import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, Output, OnInit, QueryList, ViewChildren, effect, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlMessagesComponent, ErrorModule, ICode, PipesModule, UtilsService } from '@hpfb/sdk/ui';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from '../../global/global.service';
import { TISSUE_OTHER_ID, DERIVATIVE_OTHER_ID } from '../../app.constants';
import { MaterialListComponent } from '../material-list/material-list.component';

@Component({
  selector: 'app-material-item',
  templateUrl: './material-item.component.html',
  encapsulation: ViewEncapsulation.None
})

export class MaterialItemComponent implements OnInit, AfterViewInit {
  @Input() cRRow: FormGroup;
  @Input() j: number;
  //@Input() lang: string;

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

  //isInternal: boolean
  showErrors: boolean;
  showErrSummary: boolean = false;
  public errorList = [];

  public headingLevel = 'h4';
  headingPreamble: string = "heading.biological.material";
  headingPreambleParams: any;
  translatedParentLabel: string;

  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  constructor(private _globalService: GlobalService, private _utilsService: UtilsService, private _translateService: TranslateService, private _materialListComponent : MaterialListComponent){
    //this.isInternal = this._globalService.$isInternal;

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
        // this.materialFormLocalModel.controls.derivativeOtherDetails.setValue(null);
        // this.materialFormLocalModel.controls.derivativeOtherDetails.markAsUntouched();
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

  public disableDeleteButton() {
    if (this._materialListComponent.oneRecord()) {
      return true;
    }
    return false;
  }

  public showErrorSummary(): boolean {
    return (this.showErrSummary && this.errorList.length > 0);
  }
  
  // todo use include, not !Remove
  // public isActiveContact(): boolean {
  //   return (!this.isContactStatus(ContactStatus.Remove));
  // }

 
}