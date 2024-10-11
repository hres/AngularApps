import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { BaseComponent, ControlMessagesComponent, ICodeDefinition, UtilsService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FeesService } from './fees.service';
import { TransactionEnrol } from '../models/transaction';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FeesComponent extends BaseComponent implements OnInit{

  lang: string;
  public showFieldErrors: boolean = false;
  public feesForm: FormGroup;

  @Input() showErrors: boolean;
  @Input() dataModel: TransactionEnrol;
  @Output() errorList = new EventEmitter(true);

  submissionClassOptions: ICodeDefinition[] = [];

  constructor(private __feesService: FeesService, private _fb: FormBuilder, 
    private _utilsService: UtilsService, private _globalService: GlobalService) {
    super();
    this.showFieldErrors = false;
  }
  
  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    
    if (!this.feesForm) {
      this.feesForm = FeesService.getFeesForm(this._fb);
    }

    // // this.descriptionTypeList = this._globalService.txDescs;
    this.submissionClassOptions = this._globalService.submissionClasses;
    // // this.mfTypeDescArray = this._globalService.mfTypeTxDescs;
    // // this.mfRevisedTypeDescArray = this._globalService.mfRevisedTypeDescs;
    // // this.mfUseOptions = this._globalService.mfUses;
    // this.yesNoList = this._globalService.yesnoList;
    // this.adminSubTypeOptions = this._globalService.adminSubTypes;
  }

  protected override emitErrors(errors: ControlMessagesComponent[]): void {
    // the combined list of errors from both "regulatory information" and "transaction details"
    // console.log('Combined Errors List: ', errors);
    this.errorList.emit(errors);
  }

}
