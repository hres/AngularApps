import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, Output, OnInit, QueryList, ViewChildren, effect, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlMessagesComponent, ErrorModule, ICode, PipesModule, UtilsService } from '@hpfb/sdk/ui';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from '../../global/global.service';
import { TISSUE_OTHER_ID, DERIVATIVE_OTHER_ID } from '../../app.constants';

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

  public countries: ICode[] = [];
  public specFamList: ICode[] = [];
  public tissueTypeList: ICode[] = [];
  public derivativeList: ICode[] = [];

  // public isTissueTypeOther = false;
  // public isDerivativeOther = false;

  //isInternal: boolean
  showErrors: boolean;
  showErrSummary: boolean = false;
  public errorList = [];

  public headingLevel = 'h4';
  headingPreamble: string = "heading.biological.material";
  headingPreambleParams: any;
  translatedParentLabel: string;

  @Output() error = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  constructor(private _globalService: GlobalService, private _utilsService: UtilsService, private _translateService: TranslateService){
    //this.isInternal = this._globalService.$isInternal;
    this.headingPreambleParams = this.j;
    this.translatedParentLabel = this._translateService.instant(this.headingPreamble, {seqnumber: this.headingPreambleParams});

    effect(() => {
      this.showErrors = this._globalService.showErrors()
      console.log('[effect]', this.showErrors, this._globalService.showErrors())
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
  }

  ngAfterViewInit(): void {
    console.log("first updated to error list");
    this._updateErrorList(this.msgList);

    this.msgList.changes.subscribe(errorObjs => {
      console.log("changes in msg list", this.msgList);
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
    console.log("error list - material item component", temp);
    this.errorList = temp;
    this.error.emit(temp);
  }

  public revertMaterialRecord(index: number, recordId: number): void {
    this.revertRecord.emit({ index: index, id: recordId });
    this.cRRow.markAsPristine();
  }

  public deleteMaterialRecord(index: number): void {
    this.deleteRecord.emit(index);  
  }


  public saveMaterialRecord(index: number): void {
    this._save(index);
  }

  private _save(index: number): void {
    console.log("save material record - item component");
    console.log(this.cRRow);
    if (this.cRRow.valid) {
      console.log("cRRow valid");
      this.saveRecord.emit({ index: index });
      this.cRRow.markAsPristine();
    } else {
      console.log("cRRow not valid");
      this.showErrSummary = true;
      this.showErrors = true;
    }
  } 
  
  isOtherType() {
    const tissueType = this.cRRow.get('materialInfo.tissueType').value;
    const tissueTypeDetails = this.cRRow.get('materialInfo.tissueTypeOtherDetails');
    console.log("tissueType", tissueType);
    if (tissueType) {
      if (tissueType === TISSUE_OTHER_ID) {
        return true;
      } else {
        // Reset tissue type details
        this._utilsService.resetControlsValues(tissueTypeDetails)
        // this.materialFormLocalModel.controls.tissueTypeOtherDetails.setValue(null);
        // this.materialFormLocalModel.controls.tissueTypeOtherDetails.markAsUntouched();
      }
    }
    return false;
  }

  isOtherDerivative() {
    const derivative = this.cRRow.get('materialInfo.derivative').value;
    const derivativeDetails = this.cRRow.get('materialInfo.derivativeOtherDetails');
    console.log("derivative",derivative);
    if (derivative) {
      if (derivative === DERIVATIVE_OTHER_ID) {
        return true;
      } else {
        // Reset derivate details
        this._utilsService.resetControlsValues(derivativeDetails);
        // this.materialFormLocalModel.controls.derivativeOtherDetails.setValue(null);
        // this.materialFormLocalModel.controls.derivativeOtherDetails.markAsUntouched();
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

  public showErrorSummary(): boolean {
    console.log("showErrorSummary", this.showErrSummary, this.errorList.length, this.errorList);
    console.log("show error signal", this._globalService.showErrors());
    return (this.showErrSummary && this.errorList.length > 0);
  }
  
  // todo use include, not !Remove
  // public isActiveContact(): boolean {
  //   return (!this.isContactStatus(ContactStatus.Remove));
  // }

 
}