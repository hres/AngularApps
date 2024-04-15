import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, ICode, YES } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { TransactionFeeService } from './transaction.fee.service';

@Component({
  selector: 'transaction-fee',
  templateUrl: 'transaction.fee.component.html',
  encapsulation: ViewEncapsulation.None
})

export class TransactionFeeComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit{

  public transFeeForm: FormGroup;

  @Input() showErrors: boolean;
  @Input() transFeeModel;
  @Output() feeErrorList = new EventEmitter(true);

  lang: string;
  public yesNoList: ICode[] = [];
  public showFieldErrors = false;

  constructor(private _fb: FormBuilder, private _feeService:TransactionFeeService, private _globalService: GlobalService,
              private cdr: ChangeDetectorRef) {

    super();                
    this.showFieldErrors = false;
    this.showErrors = false;

    if (!this.transFeeForm) {
      this.transFeeForm = this._feeService.getReactiveModel(this._fb);
    }
  }

  ngOnInit() {
    this.lang = this._globalService.getCurrLanguage();
    this.yesNoList = this._globalService.$yesnoList;
  }

  protected override emitErrors(errors: any[]): void {
    this.feeErrorList.emit(errors);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
    }

    if (changes['transFeeModel']) {
      const dataModel = changes['transFeeModel'].currentValue;
      if (!this.transFeeForm) {
        this.transFeeForm = this._feeService.getReactiveModel(this._fb);
        this.transFeeForm.markAsPristine();
      }
      this._feeService.mapDataModelToFeeForm(dataModel, (<FormGroup>this.transFeeForm));
    }
  }

  hasFeeYes() {
    if (this.transFeeForm.controls['hasFees'].value) {
      if (this.transFeeForm.controls['hasFees'].value === YES) {
        return true;
      } else {
        this.transFeeForm.controls['billCompanyId'].setValue(null);
        this.transFeeForm.controls['billCompanyId'].markAsUntouched();
        this.transFeeForm.controls['billContactId'].setValue(null);
        this.transFeeForm.controls['billContactId'].markAsUntouched();
      }
    }
    return false;
  }
  
}
