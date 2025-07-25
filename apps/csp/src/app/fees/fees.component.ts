import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ICode, BaseComponent, HelpSequence, UtilsService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { FeesService } from './fees.service';
import { FeeDetails } from '../models/transaction';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrl: './fees.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})

export class FeesComponent  extends BaseComponent implements OnInit, OnChanges {

  public showFieldErrors: boolean = false;
  lang: string;
  helpIndex: HelpSequence;
  @Input() showErrors: boolean;
  @Output() errorList = new EventEmitter(true);
  feesForm: FormGroup;
  payMethodOptions: ICode[] = [];
  @Input() feePaymentModel: FeeDetails;

  constructor(private feesService: FeesService, private _fb: FormBuilder, private _globalService: GlobalService,
    private _utilsService: UtilsService) {
   super();
   this.showFieldErrors = false;
 }

 ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;

    if (!this.feesForm) {
      this.feesForm = this.feesService.getFeesForm(this._fb);
    }
    this.payMethodOptions = this._globalService.payMethod;
  }

  getFormValue(){
    return this.feesForm.value;
  }

  protected override emitErrors(errors: any[]){
    this.errorList.emit(errors);
  }

  ngOnChanges(changes: SimpleChanges){
    this.showFieldErrors = this.showErrors || this.showFieldErrors;
    if (!this._utilsService.isFirstChange(changes)) {
      if (changes['feePaymentModel']) {
        this.feesService.mapDataModelToFormModel(
          changes['feePaymentModel'].currentValue as FeeDetails,
          <FormGroup>this.feesForm
        );
      }
    }
  }
}