import { Component, input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, HelpIndex, UtilsService } from '@hpfb/sdk/ui';
import { TransactionDetailsService } from './transaction-details.service';
import { GlobalService } from '../global/global.service';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class TransactionDetailsComponent extends BaseComponent implements OnInit {

  lang: string;
  helpIndex: HelpIndex; 

  transctionDetailsForm: FormGroup;

  showErrors = input.required<boolean>();

  constructor(private _transactionDetailsService: TransactionDetailsService, private _fb: FormBuilder, 
    private _utilsService: UtilsService, private _globalService: GlobalService) {
    super();
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;
    
    if (!this.transctionDetailsForm) {
      this.transctionDetailsForm = this._transactionDetailsService.getTransctionDetailsForm(this._fb);
    }
    
  }

  protected override emitErrors(errors: any[]): void {
    throw new Error('Method not implemented.');
  }
}
