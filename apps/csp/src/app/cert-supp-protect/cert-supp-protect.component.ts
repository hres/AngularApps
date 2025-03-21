import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren, ViewEncapsulation,
  computed,
  signal
} from '@angular/core';
import { ICodeDefinition, ICodeAria, ICode, IParentChildren, EntityBaseService, UtilsService, ErrorModule, PipesModule, BaseComponent, HelpSequence } from '@hpfb/sdk/ui';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CertSuppProtectService } from './cert-supp-protect.service';
import { Ectd, ICspInfomation } from '../models/transaction';
import { GlobalService } from '../global/global.service';
import { Subscription } from 'rxjs';
import { FormBaseService } from '../form-base/form-base.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cert-supp-protect',
  templateUrl: './cert-supp-protect.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class CertSuppProtectComponent extends BaseComponent implements OnInit, OnChanges {
  lang: string;
  helpIndex: HelpSequence
  @Input() showErrors: boolean;
  @Input() saveWorkCopyTime: number;
  @Input() cspiModel: ICspInfomation;
  @Output() errorList = new EventEmitter(true);

  public certSuppProtectForm: FormGroup;

  public showFieldErrors: boolean = false;

  constructor(private _certSuppProtectService: CertSuppProtectService, private _fb: FormBuilder,
    private _utilsService: UtilsService, private _globalService: GlobalService, private formBaseService: FormBaseService, private datepipe: DatePipe) {
    super();
    this.showFieldErrors = false;
  }

  ngOnInit(): void {
    this.lang = this._globalService.currLanguage;
    this.helpIndex = this._globalService.helpIndex;

    if (!this.certSuppProtectForm) {
      this.certSuppProtectForm = this._certSuppProtectService.getRegularInfoForm(this._fb);
      this.formBaseService.passCerForm( this.certSuppProtectForm )
    }
  }

  protected override emitErrors(errors: any[]): void {
    this.errorList.emit(errors);
  }

  ngOnChanges(changes: SimpleChanges) {
      this.showFieldErrors = this.showErrors || this.showFieldErrors;
      const isFirstChange = this._utilsService.isFirstChange(changes);
      if (!isFirstChange) {
        if (changes['cspiModel'])  {

          this._certSuppProtectService.mapDataModelToFormModel(
            changes['cspiModel'].currentValue,
            <FormGroup>this.certSuppProtectForm
          );
        }
      }
  }

  private _resetControlValues(controlNames: string[]) {
    for (let i = 0; i < controlNames.length; i++) {
      this._utilsService.resetControlsValues(this.certSuppProtectForm.controls[controlNames[i]]);
    }
  }

  getFormValue() {
    return this.certSuppProtectForm.value;
  }

  public sendForm(certSuppProtectForm: FormGroup){

  }
}
