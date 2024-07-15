import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, HelpIndex, ICode, UtilsService } from '@hpfb/sdk/ui';
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
  public showNumOfAccessLetter: boolean = false;
  public yesNoList: ICode[] = [];
  public whoResponsibleList : ICode[] = [];
  public feeForm: FormGroup;

  @Input() showErrors: boolean;
  @Input() dataModel: FeeDetails;
  @Output() errorList = new EventEmitter(true);

  constructor(private _masterFileFeeService: MasterFileFeeService, private _fb: FormBuilder, 
    private _utilsService: UtilsService, private _globalService: GlobalService) {
    super();
    this.showFieldErrors = false;
    this.showErrors = false;

    if (!this.feeForm) {
      this.feeForm = this._masterFileFeeService.getReactiveModel(this._fb);
    }
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    this.yesNoList = this._globalService.yesnoList;
    this.whoResponsibleList = this._globalService.whoResponsible;
  }
  
  ngOnChanges(changes: SimpleChanges) {
    const isFirstChange = this._utilsService.isFirstChange(changes);
    if (!isFirstChange) {
      if (changes['showErrors']) {
        this.showFieldErrors = changes['showErrors'].currentValue;
      }
      if (changes['dataModel']) {
        const dataModel = changes['dataModel'].currentValue as FeeDetails;
        this._masterFileFeeService.mapDataModelToFormModel(dataModel, (<FormGroup>this.feeForm));
        this.areAccessLettersChanged();
      }
    }
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  areAccessLettersChanged() {
    if (this.feeForm.controls['areAccessLetters'].value === 'Y') {
      this.showNumOfAccessLetter = true;
    } else {
      this.showNumOfAccessLetter = false;
      this.feeForm.controls['numOfAccessLetter'].setValue(''); // null or empty? 
    }
  }

  getFormValue() {
    return this.feeForm.value;
  }
}
