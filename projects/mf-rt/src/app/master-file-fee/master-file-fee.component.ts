import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BaseComponent, EntityBaseService, ErrorModule, HelpIndex, ICode, PipesModule, UtilsService } from '@hpfb/sdk/ui';
import { TranslateModule } from '@ngx-translate/core';
import { MasterFileFeeService } from './master-file.fee.service';
import { GlobalService } from '../global/global.service';
import { FeeDetails } from '../models/transaction';

@Component({
  selector: 'master-file-fee',
  templateUrl: './master-file-fee.component.html',
  styleUrl: './master-file-fee.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class MasterFileFeeComponent extends BaseComponent implements OnInit{
  lang: string;
  helpIndex: HelpIndex; 
  public showFieldErrors: boolean = false;
  public showNumOfAccessLetter: boolean;
  public yesNoList: ICode[] = [];
  public whoResponsibleList : ICode[] = [];
  public mfFeeFormLocalModel: FormGroup;

  @Input() showErrors: boolean;
  @Input() dataModel: FeeDetails;
  @Output() errorList = new EventEmitter(true);

  constructor(private _masterFileFeeService: MasterFileFeeService, private _fb: FormBuilder, 
    private _entityBaseService: EntityBaseService, private _utilsService: UtilsService, private _globalService: GlobalService) {
      super();
    this.showFieldErrors = false;
    this.showErrors = false;

    if (!this.mfFeeFormLocalModel) {
      this.mfFeeFormLocalModel = this._masterFileFeeService.getReactiveModel(this._fb);
    }

  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    this.showNumOfAccessLetter = false;
    this.yesNoList = this._globalService.yesnoList;
    this.whoResponsibleList = this._globalService.whoResponsible;
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
    }
    if (changes['transFeeModel']) {
      const dataModel = changes['transFeeModel'].currentValue;
      if (!this.mfFeeFormLocalModel) {
        this.mfFeeFormLocalModel = this._masterFileFeeService.getReactiveModel(this._fb);
        this.mfFeeFormLocalModel.markAsPristine();
      }
      this._masterFileFeeService.mapDataModelToFormModel(dataModel, (<FormGroup>this.mfFeeFormLocalModel));
      if (dataModel.are_there_access_letters && dataModel.are_there_access_letters === 'Y') {
        this.showNumOfAccessLetter = true;
      } else {
        this.showNumOfAccessLetter = false;
      }
    }
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  areAccessLettersChanged() {
    if (this.mfFeeFormLocalModel.controls['areAccessLetters'].value.id === 'Y') {
      this.showNumOfAccessLetter = true;
    } else {
      this.showNumOfAccessLetter = false;
      this.mfFeeFormLocalModel.controls['numOfAccessLetter'].setValue(''); // null or empty? 
    }
  }

}
